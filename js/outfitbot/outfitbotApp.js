/**
 * OUTFIT-BOT — Application Controller & Engine
 * File: js/outfitbot/outfitbotApp.js
 */

(function() {
    'use strict';

    class SoundFX {
        constructor() {
            this.ctx = null;
            this.muted = false;
        }
        init() {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }
        playTone(freq, dur, type = 'sine', vol = 0.15) {
            if (this.muted) return;
            try {
                this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + dur);
            } catch(e) {}
        }
        clothSlide() { this.playTone(480, 0.08, 'sine', 0.12); }
        equipChime() {
            this.playTone(587.33, 0.08, 'triangle', 0.16);
            setTimeout(() => this.playTone(880.00, 0.14, 'triangle', 0.18), 75);
        }
        errorBuzzer() { this.playTone(180, 0.28, 'sawtooth', 0.22); }
        fanfareWin() {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((n, i) => setTimeout(() => this.playTone(n, 0.2, 'triangle', 0.2), i * 105));
        }
    }

    const sfx = new SoundFX();

    class OutfitBotApp {
        constructor() {
            this.currentLvlIdx = 0;
            this.stars = JSON.parse(localStorage.getItem('outfitbot_stars') || '[0, 0, 0, 0, 0]');
            this.userCalls = [];
            this.isRunning = false;
            this.currentStepDayIdx = 0;

            this.dom = {
                scorePill: document.getElementById('score-stars-pill'),
                activeLvlLabel: document.getElementById('label-active-level'),
                missionContent: document.getElementById('mission-content'),
                calendarGrid: document.getElementById('calendar-days-container'),
                blueprintSig: document.getElementById('blueprint-sig'),
                blueprintCodeBody: document.getElementById('blueprint-code-body'),
                blueprintEfficiencyBadge: document.getElementById('blueprint-efficiency-badge'),
                callRowsContainer: document.getElementById('call-rows-container'),
                stageLog: document.getElementById('stage-log-display'),
                closetArmStatus: document.getElementById('closet-arm-status'),
                mannequinTag: document.getElementById('mannequin-status-label'),
                btnRun: document.getElementById('btn-run-outfit'),
                btnStep: document.getElementById('btn-step-outfit'),
                btnReset: document.getElementById('btn-reset-outfit'),
                studentSvg: document.getElementById('student-svg'),
                svgShirt: document.getElementById('svg-part-shirt'),
                svgSleeveL: document.getElementById('svg-part-sleeve-l'),
                svgSleeveR: document.getElementById('svg-part-sleeve-r'),
                svgPants: document.getElementById('svg-part-pants'),
                svgHat: document.getElementById('svg-part-hat'),
                svgTie: document.getElementById('svg-part-tie'),
                svgTieShape: document.getElementById('svg-tie-shape'),
                svgBelt: document.getElementById('svg-part-belt'),
                lvlModal: document.getElementById('modal-level-selector'),
                lvlButtonsContainer: document.getElementById('modal-level-buttons'),
                vicModal: document.getElementById('modal-victory-dialog'),
                alertModal: document.getElementById('modal-alert-dialog'),
                alertTitle: document.getElementById('alert-dialog-title'),
                alertMessage: document.getElementById('alert-dialog-message'),
                btnAlertConfirm: document.getElementById('btn-alert-confirm')
            };

            this.pendingAlertFocusEl = null;

            this.initEvents();
            this.loadLevel(0);
        }

        showAlertModal(title, message, targetEl) {
            sfx.errorBuzzer();
            this.pendingAlertFocusEl = targetEl;
            if (this.dom.alertTitle) this.dom.alertTitle.textContent = title;
            if (this.dom.alertMessage) this.dom.alertMessage.innerHTML = message;
            if (this.dom.alertModal) this.dom.alertModal.classList.add('open');
        }

        closeAlertModal() {
            if (this.dom.alertModal) this.dom.alertModal.classList.remove('open');
            if (this.pendingAlertFocusEl) {
                const el = this.pendingAlertFocusEl;
                this.pendingAlertFocusEl = null;
                setTimeout(() => {
                    try {
                        el.focus();
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('pulse-attention');
                        setTimeout(() => el.classList.remove('pulse-attention'), 2400);
                    } catch(e) {}
                }, 80);
            }
        }

        initEvents() {
            document.getElementById('btn-show-levels').addEventListener('click', () => {
                this.renderLevelModal();
                this.dom.lvlModal.classList.add('open');
            });
            document.getElementById('btn-close-level-modal').addEventListener('click', () => {
                this.dom.lvlModal.classList.remove('open');
            });
            document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
                sfx.muted = !sfx.muted;
                e.currentTarget.textContent = sfx.muted ? '🔇' : '🔊';
            });

            this.dom.btnRun.addEventListener('click', () => this.runSimulation());
            this.dom.btnStep.addEventListener('click', () => this.stepSimulation());
            this.dom.btnReset.addEventListener('click', () => this.resetSimulation());

            const onResetStars = () => this.resetAllStars();
            document.getElementById('btn-reset-stars-hud')?.addEventListener('click', onResetStars);
            document.getElementById('btn-reset-stars-modal')?.addEventListener('click', onResetStars);

            if (this.dom.btnAlertConfirm) {
                this.dom.btnAlertConfirm.addEventListener('click', () => this.closeAlertModal());
            }
            if (this.dom.alertModal) {
                this.dom.alertModal.addEventListener('click', (e) => {
                    if (e.target === this.dom.alertModal) this.closeAlertModal();
                });
            }
            window.addEventListener('keydown', (e) => {
                if (this.dom.alertModal && this.dom.alertModal.classList.contains('open')) {
                    if (e.key === 'Escape' || e.key === 'Enter') {
                        e.preventDefault();
                        this.closeAlertModal();
                    }
                }
            });

            document.getElementById('btn-vic-replay').addEventListener('click', () => {
                this.dom.vicModal.classList.remove('open');
                this.resetSimulation();
            });
            document.getElementById('btn-vic-continue').addEventListener('click', () => {
                this.dom.vicModal.classList.remove('open');
                const levels = window.OUTFITBOT_LEVELS || [];
                if (this.currentLvlIdx < levels.length - 1) {
                    this.loadLevel(this.currentLvlIdx + 1);
                } else {
                    this.loadLevel(0);
                }
            });
        }

        loadLevel(idx) {
            this.currentLvlIdx = idx;
            const lvl = window.OUTFITBOT_LEVELS[idx];
            this.dom.activeLvlLabel.textContent = `Level ${lvl.id}`;
            this.updateScoreDisplay();

            // Mission Banner
            this.dom.missionContent.innerHTML = `
                <div class="mission-headline">${lvl.headline}</div>
                <div>${lvl.desc}</div>
            `;

            this.userCalls = lvl.scheduleDays.map(d => {
                return {
                    day: d.day,
                    label: d.label,
                    promptText: d.promptText,
                    expectedArgs: d.expectedArgs,
                    req: d.req,
                    rawCall: ''
                };
            });

            this.renderBlueprint();
            this.renderCalendar();
            this.renderCallRows();
            this.resetSimulation();
        }

        getBlueprintSteps(lvl) {
            const hasPants = lvl.params.includes('bawahan');
            const hasAcc = lvl.params.includes('atribut');

            if (!hasPants && !hasAcc) {
                // Tier 1: 1 Parameter (atasan) — Prosedur penyiapan baju atasan
                return [
                    { num: 1, id: 'step-open', label: 'Buka pintu lemari pakaian' },
                    { num: 2, id: 'step-shirt', label: `Ambil baju + <span class="param-highlight">atasan</span> dari gantungan` },
                    { num: 3, id: 'step-check', label: 'Periksa kebersihan kerah baju' },
                    { num: 4, id: 'step-iron-front', label: 'Setrika bagian badan baju hingga rapi' },
                    { num: 5, id: 'step-iron-sleeve', label: 'Setrika bagian lengan baju hingga licin' },
                    { num: 6, id: 'step-button', label: 'Pasang dan rapikan kancing baju' },
                    { num: 7, id: 'step-perfume', label: 'Semprot parfum pewangi pakaian' },
                    { num: 8, id: 'step-wear', label: 'Pasangkan baju ke mannequin siswa' },
                    { num: 9, id: 'step-close', label: 'Tutup kembali pintu lemari pakaian' }
                ];
            } else if (hasPants && !hasAcc) {
                // Tier 2: 2 Parameter (atasan & bawahan) — Setelan baju atasan dan celana bawahan
                return [
                    { num: 1, id: 'step-open', label: 'Buka pintu lemari pakaian' },
                    { num: 2, id: 'step-shirt', label: `Ambil baju + <span class="param-highlight">atasan</span> dari gantungan` },
                    { num: 3, id: 'step-iron-shirt', label: 'Setrika baju dan rapikan kancing' },
                    { num: 4, id: 'step-pants', label: `Ambil celana + <span class="param-highlight">bawahan</span> dari rak lemari` },
                    { num: 5, id: 'step-iron-pants', label: 'Setrika dan luruskan lipatan celana' },
                    { num: 6, id: 'step-match', label: 'Satukan setelan baju dan celana' },
                    { num: 7, id: 'step-perfume', label: 'Semprot parfum pewangi pakaian' },
                    { num: 8, id: 'step-wear', label: 'Pasangkan setelan ke mannequin siswa' },
                    { num: 9, id: 'step-close', label: 'Tutup kembali pintu lemari pakaian' }
                ];
            } else {
                // Tier 3: 3 Parameter (atasan, bawahan, atribut) — Seragam sekolah lengkap
                return [
                    { num: 1, id: 'step-open', label: 'Buka pintu lemari pakaian' },
                    { num: 2, id: 'step-shirt', label: `Ambil baju + <span class="param-highlight">atasan</span> dari gantungan` },
                    { num: 3, id: 'step-iron-shirt', label: 'Setrika baju dan rapikan kancing' },
                    { num: 4, id: 'step-pants', label: `Ambil celana + <span class="param-highlight">bawahan</span> dari rak lemari` },
                    { num: 5, id: 'step-iron-pants', label: 'Setrika dan rapikan lipatan celana' },
                    { num: 6, id: 'step-acc', label: `Pasang atribut + <span class="param-highlight">atribut</span> seragam` },
                    { num: 7, id: 'step-perfume', label: 'Semprot parfum pewangi pakaian' },
                    { num: 8, id: 'step-wear', label: 'Pasangkan seragam lengkap ke mannequin siswa' },
                    { num: 9, id: 'step-close', label: 'Tutup kembali pintu lemari pakaian' }
                ];
            }
        }

        renderBlueprint() {
            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            this.dom.blueprintSig.innerHTML = `<span class="code-kw">fungsi</span> <span class="code-fn-name">${lvl.fnName}</span>(${lvl.params.map(p => `<span class="param-highlight">${p}</span>`).join(', ')}) {`;

            const steps = this.getBlueprintSteps(lvl);
            const totalSteps = steps.length;
            const daysCount = lvl.scheduleDays.length;
            const manualCount = totalSteps * daysCount;

            if (this.dom.blueprintEfficiencyBadge) {
                this.dom.blueprintEfficiencyBadge.textContent = `⚡ 1 Fungsi = 9 Prosedur (Hemat ${manualCount - daysCount} Baris!)`;
            }

            if (this.dom.blueprintCodeBody) {
                this.dom.blueprintCodeBody.innerHTML = steps.map(s => `
                    <div class="blueprint-code-line" id="bp-${s.id}">
                        <span class="code-num">${s.num}.</span>
                        <span class="code-step-text">${s.label}</span>
                    </div>
                `).join('');
            }
        }

        highlightBlueprintStep(stepId) {
            document.querySelectorAll('.blueprint-code-line').forEach(el => el.classList.remove('bp-step-active'));
            if (stepId) {
                const el = document.getElementById(`bp-${stepId}`);
                if (el) el.classList.add('bp-step-active');
            }
        }

        renderCalendar() {
            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            this.dom.calendarGrid.innerHTML = lvl.scheduleDays.map((d, i) => {
                return `
                    <div class="day-card" id="cal-day-${i}">
                        <div class="day-name">${d.day}</div>
                        <div class="day-rule-req">${d.label}</div>
                        <div class="day-status-icon" id="cal-status-${i}">⏳</div>
                    </div>
                `;
            }).join('');
        }

        renderCallRows() {
            this.dom.callRowsContainer.innerHTML = this.userCalls.map((call, cIdx) => {
                const isUnconfigured = !call.rawCall.trim();

                return `
                    <div class="worksheet-question-card" id="call-card-${cIdx}">
                        <div class="worksheet-card-top">
                            <span class="question-pill">Soal ${cIdx + 1}: ${call.day}</span>
                            <span class="activity-pill">${call.label}</span>
                            <span class="call-status-badge" id="call-status-badge-${cIdx}">⏳ Belum Diuji</span>
                        </div>

                        <div class="question-prompt-text">
                            👉 <strong>Tugas:</strong> ${call.promptText}
                        </div>

                        <div class="code-input-area">
                            <label class="code-input-label">💻 Ketik Perintah Pemanggilan Fungsi:</label>
                            <div class="code-full-input-wrap ${isUnconfigured ? 'unconfigured-wrap' : ''}" id="wrap-${cIdx}">
                                <span class="prompt-symbol">➔</span>
                                <input type="text" 
                                       class="code-full-input ${isUnconfigured ? 'unconfigured' : ''}" 
                                       id="input-call-${cIdx}" 
                                       data-call="${cIdx}" 
                                       value="${call.rawCall}" 
                                       autocomplete="off" 
                                       spellcheck="false" />
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Bind manual input typing
            this.dom.callRowsContainer.querySelectorAll('.code-full-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const cIdx = parseInt(e.target.dataset.call, 10);
                    this.userCalls[cIdx].rawCall = e.target.value;
                    const wrapEl = document.getElementById(`wrap-${cIdx}`);
                    if (e.target.value.trim()) {
                        e.target.classList.remove('unconfigured');
                        if (wrapEl) wrapEl.classList.remove('unconfigured-wrap');
                    } else {
                        e.target.classList.add('unconfigured');
                        if (wrapEl) wrapEl.classList.add('unconfigured-wrap');
                    }
                });

                input.addEventListener('focus', (e) => {
                    e.target.select();
                });
            });
        }

        splitArgs(argsString) {
            const args = [];
            let current = '';
            let inQuote = null;
            for (let i = 0; i < argsString.length; i++) {
                const char = argsString[i];
                if ((char === "'" || char === '"') && (i === 0 || argsString[i - 1] !== '\\')) {
                    if (inQuote === char) {
                        inQuote = null;
                    } else if (!inQuote) {
                        inQuote = char;
                    }
                    current += char;
                } else if (char === ',' && !inQuote) {
                    args.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            if (current.trim()) {
                args.push(current.trim());
            }
            return args;
        }

        normalizeArgValue(val) {
            if (!val) return '';
            let clean = val.trim();
            if (clean.includes(':')) {
                clean = clean.split(':')[1].trim();
            } else if (clean.includes('=')) {
                clean = clean.split('=')[1].trim();
            }

            clean = clean.replace(/^['"]+|['"]+$/g, '').trim().toUpperCase();
            clean = clean.replace(/\s+/g, ' ');

            // Strip garment prefixes if user wrote 'baju putih', 'celana merah', etc.
            clean = clean.replace(/^(BAJU|KEMEJA|KAOS|CELANA|ROK)\s+/i, '');

            const spaced = clean.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

            // Atribut normalization
            if (spaced === 'TOPI DAN DASI' || spaced === 'TOPI & DASI' || spaced === 'TOPI DASI' || spaced === 'TOPI, DASI' || spaced === 'TOPI' || spaced === 'TOPI_DASI') {
                return 'TOPI_DASI';
            }
            if (spaced === 'KACU DAN HASDUK' || spaced === 'KACU & HASDUK' || spaced === 'KACU HASDUK' || spaced === 'KACU' || spaced === 'HASDUK' || spaced === 'KACU_HASDUK') {
                return 'KACU_HASDUK';
            }
            if (spaced === 'SABUK' || spaced === 'IKAT PINGGANG') {
                return 'SABUK';
            }
            if (spaced === 'DASI') {
                return 'DASI';
            }

            // Warna & Pakaian normalization
            if (spaced === 'COKELAT' || spaced === 'COKELAT TUA' || spaced === 'COKELAT_TUA') {
                return 'COKELAT_TUA';
            }
            if (spaced === 'KOTAK' || spaced === 'KOTAK KOTAK' || spaced === 'KOTAK-KOTAK') {
                return 'KOTAK';
            }
            if (spaced === 'PUTIH') return 'PUTIH';
            if (spaced === 'MERAH') return 'MERAH';
            if (spaced === 'HITAM') return 'HITAM';
            if (spaced === 'BATIK') return 'BATIK';
            if (spaced === 'PRAMUKA') return 'PRAMUKA';

            return clean;
        }

        getItemDisplayName(type, key) {
            const shirtNames = {
                PUTIH: 'Putih',
                BATIK: 'Batik',
                KOTAK: 'Kotak',
                PRAMUKA: 'Pramuka',
                DEFAULT: 'Standar'
            };
            const pantsNames = {
                MERAH: 'Merah',
                PUTIH: 'Putih',
                HITAM: 'Hitam',
                COKELAT_TUA: 'Cokelat',
                DEFAULT: 'Standar'
            };
            const accNames = {
                TOPI_DASI: 'Topi & Dasi',
                DASI: 'Dasi',
                SABUK: 'Sabuk',
                KACU_HASDUK: 'Kacu',
                NONE: 'Tanpa Atribut'
            };
            if (type === 'shirt') return shirtNames[key] || key;
            if (type === 'pants') return pantsNames[key] || key;
            if (type === 'acc') return accNames[key] || key;
            return key;
        }

        parseCall(rawText, expectedFnName = 'siapkanSeragam') {
            let str = (rawText || '').trim();
            if (!str) return { valid: false, error: 'empty' };

            let argsString = '';
            const fnMatch = str.match(/^([a-zA-Z0-9_]+)\s*\((.*)\)\s*;?$/);
            if (fnMatch) {
                const calledName = fnMatch[1];
                if (calledName.toLowerCase() !== expectedFnName.toLowerCase()) {
                    return {
                        valid: false,
                        error: `Nama fungsi belum sesuai. Gunakan nama <code>${expectedFnName}</code>, bukan <code>${calledName}</code>.`
                    };
                }
                argsString = fnMatch[2].trim();
            } else {
                const parenMatch = str.match(/^\((.*)\)\s*;?$/);
                if (parenMatch) {
                    argsString = parenMatch[1].trim();
                } else {
                    return {
                        valid: false,
                        error: `Tulis pemanggilan fungsi secara lengkap dengan tanda kurung: <code>${expectedFnName}('...')</code>.`
                    };
                }
            }

            const rawArgs = argsString ? this.splitArgs(argsString) : [];
            const normalizedArgs = rawArgs.map(a => this.normalizeArgValue(a));

            return {
                valid: true,
                args: normalizedArgs
            };
        }

        renderLevelModal() {
            const levels = window.OUTFITBOT_LEVELS || [];
            this.dom.lvlButtonsContainer.innerHTML = levels.map((lvl, i) => {
                const stars = this.stars[i] || 0;
                const starText = stars > 0 ? '⭐'.repeat(stars) : '☆☆☆';
                return `
                    <button type="button" class="btn-level-card ${i === this.currentLvlIdx ? 'active-lvl' : ''}" data-idx="${i}">
                        <div class="level-card-num">${lvl.id}</div>
                        <div class="level-card-stars">${starText}</div>
                    </button>
                `;
            }).join('');

            this.dom.lvlButtonsContainer.querySelectorAll('.btn-level-card').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.idx, 10);
                    this.dom.lvlModal.classList.remove('open');
                    this.loadLevel(idx);
                });
            });
        }

        updateScoreDisplay() {
            const totalStars = this.stars.reduce((a, b) => a + b, 0);
            this.dom.scorePill.textContent = `⭐ ${totalStars}/15 Bintang`;
        }

        resetAllStars() {
            if (confirm('Yakin ingin mereset semua bintang OUTFIT-BOT ke 0?\nSemua riwayat bintang level akan dikosongkan agar fresh untuk kelas baru.')) {
                this.stars = [0, 0, 0, 0, 0];
                localStorage.setItem('outfitbot_stars', JSON.stringify(this.stars));
                this.updateScoreDisplay();
                this.renderLevelModal();
                sfx.clothSlide();
            }
        }

        resetSimulation() {
            this.isRunning = false;
            this.currentStepDayIdx = 0;
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            lvl.scheduleDays.forEach((_, i) => {
                const cal = document.getElementById(`cal-day-${i}`);
                const icon = document.getElementById(`cal-status-${i}`);
                const card = document.getElementById(`call-card-${i}`);
                const badge = document.getElementById(`call-status-badge-${i}`);
                if (cal) cal.className = 'day-card';
                if (icon) icon.textContent = '⏳';
                if (card) {
                    card.classList.remove('active-executing', 'call-passed', 'call-failed');
                }
                if (badge) badge.textContent = '⏳ Belum Diuji';
            });

            this.highlightBlueprintStep(null);
            document.querySelectorAll('.wardrobe-item-pill').forEach(el => el.classList.remove('active-pick'));
            if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Siap';
            this.setMannequinOutfit({ shirt: 'DEFAULT', pants: 'DEFAULT', acc: 'NONE' });
            this.dom.mannequinTag.textContent = 'Siap Berpakaian';
            this.dom.stageLog.textContent = '🤖 OUTFIT-BOT siap. Ketik pemanggilan fungsi pada lembar soal lalu jalankan.';
        }

        setMannequinOutfit({ shirt, pants, acc }) {
            const colors = {
                PUTIH: '#f8fafc',
                BATIK: '#f59e0b',
                KOTAK: '#3b82f6',
                PRAMUKA: '#d97706',
                MERAH: '#ef4444',
                HITAM: '#1e293b',
                COKELAT_TUA: '#78350f',
                DEFAULT: '#334155'
            };

            const shirtColor = colors[shirt] || colors.DEFAULT;
            this.dom.svgShirt.setAttribute('fill', shirtColor);
            this.dom.svgSleeveL.setAttribute('fill', shirtColor);
            this.dom.svgSleeveR.setAttribute('fill', shirtColor);

            const pantsColor = colors[pants] || colors.DEFAULT;
            this.dom.svgPants.setAttribute('fill', pantsColor);

            this.dom.svgHat.style.display = 'none';
            this.dom.svgTie.style.display = 'none';
            this.dom.svgBelt.style.display = 'none';

            if (acc === 'TOPI_DASI') {
                this.dom.svgHat.style.display = '';
                this.dom.svgTie.style.display = '';
                this.dom.svgTieShape.setAttribute('fill', '#ef4444');
                this.dom.svgBelt.style.display = '';
            } else if (acc === 'DASI') {
                this.dom.svgTie.style.display = '';
                this.dom.svgTieShape.setAttribute('fill', '#ef4444');
                this.dom.svgBelt.style.display = '';
            } else if (acc === 'KACU_HASDUK') {
                this.dom.svgTie.style.display = '';
                this.dom.svgTieShape.setAttribute('fill', '#dc2626');
                this.dom.svgBelt.style.display = '';
            } else if (acc === 'SABUK') {
                this.dom.svgBelt.style.display = '';
            }

            this.dom.studentSvg.classList.remove('dress-animate');
            void this.dom.studentSvg.offsetWidth;
            this.dom.studentSvg.classList.add('dress-animate');
        }

        validateAllCalls() {
            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            for (let dayIdx = 0; dayIdx < lvl.scheduleDays.length; dayIdx++) {
                const call = this.userCalls[dayIdx];
                const inputEl = document.getElementById(`input-call-${dayIdx}`);

                if (!call.rawCall.trim()) {
                    this.showAlertModal(
                        'Soal Belum Dijawab!',
                        `Ketik pemanggilan fungsi pada <strong>Soal ${dayIdx + 1} (${call.day})</strong>.<br><br>Format: <code>${lvl.fnName}(...)</code>`,
                        inputEl
                    );
                    return false;
                }

                const parsed = this.parseCall(call.rawCall, lvl.fnName);
                if (!parsed.valid) {
                    this.showAlertModal(
                        'Format Pemanggilan Belum Tepat!',
                        `Jawaban pada <strong>Soal ${dayIdx + 1} (${call.day})</strong> belum benar.<br><br>${parsed.error}`,
                        inputEl
                    );
                    return false;
                }

                if (parsed.args.length < lvl.params.length) {
                    this.showAlertModal(
                        'Parameter Kurang!',
                        `Fungsi pada level ini membutuhkan <strong>${lvl.params.length} parameter</strong>: (<code>${lvl.params.join(', ')}</code>).`,
                        inputEl
                    );
                    return false;
                }
            }
            return true;
        }

        async runSimulation() {
            if (this.isRunning) return;
            if (!this.validateAllCalls()) return;

            this.isRunning = true;
            this.dom.btnRun.disabled = true;
            this.dom.btnStep.disabled = true;

            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            let allSuccess = true;

            for (let i = 0; i < lvl.scheduleDays.length; i++) {
                const ok = await this.executeOneDay(i);
                if (!ok) {
                    allSuccess = false;
                    break;
                }
                await new Promise(r => setTimeout(r, 450));
            }

            this.isRunning = false;
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            if (allSuccess) {
                this.onVictory();
            }
        }

        async stepSimulation() {
            if (this.isRunning) return;
            if (!this.validateAllCalls()) return;

            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            if (this.currentStepDayIdx >= lvl.scheduleDays.length) {
                this.resetSimulation();
            }

            this.dom.btnRun.disabled = true;
            this.dom.btnStep.disabled = true;

            const ok = await this.executeOneDay(this.currentStepDayIdx);
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            if (ok) {
                this.currentStepDayIdx++;
                if (this.currentStepDayIdx >= lvl.scheduleDays.length) {
                    this.onVictory();
                }
            }
        }

        async executeOneDay(dayIdx) {
            const lvl = window.OUTFITBOT_LEVELS[this.currentLvlIdx];
            const dayConfig = lvl.scheduleDays[dayIdx];
            const call = this.userCalls[dayIdx];

            const cal = document.getElementById(`cal-day-${dayIdx}`);
            const card = document.getElementById(`call-card-${dayIdx}`);
            const badge = document.getElementById(`call-status-badge-${dayIdx}`);
            if (cal) cal.className = 'day-card active-day';
            if (card) card.classList.add('active-executing');
            if (badge) badge.textContent = '⚡ Menjalankan...';

            // Parse args
            const parsed = this.parseCall(call.rawCall, lvl.fnName);
            const args = parsed.args || [];

            let effectiveShirt = args[0] || dayConfig.req.shirt;
            let effectivePants = (lvl.params.includes('bawahan') && args[1]) ? args[1] : dayConfig.req.pants;
            let effectiveAcc = (lvl.params.includes('atribut') && args[2]) ? args[2] : dayConfig.req.acc;

            const shirtName = this.getItemDisplayName('shirt', effectiveShirt);
            const pantsName = this.getItemDisplayName('pants', effectivePants);
            const accName = this.getItemDisplayName('acc', effectiveAcc);

            // ── 9 Procedural Steps Animation ──
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            const hasPants = lvl.params.includes('bawahan');
            const hasAcc = lvl.params.includes('atribut');

            if (!hasPants && !hasAcc) {
                // Tier 1: 1 Parameter (atasan) — Penyiapan baju atasan
                // 1. Buka pintu lemari
                this.highlightBlueprintStep('step-open');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Buka Lemari';
                this.dom.stageLog.textContent = `[${call.day}] 1. Buka pintu lemari pakaian...`;
                await sleep(200);

                // 2. Ambil baju atasan
                this.highlightBlueprintStep('step-shirt');
                document.querySelectorAll('.wardrobe-item-pill').forEach(el => el.classList.remove('active-pick'));
                const pickShirtEl = document.getElementById(`closet-shirt-${effectiveShirt}`);
                if (pickShirtEl) pickShirtEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 2. Ambil baju '${shirtName}' dari gantungan...`;
                await sleep(250);

                // 3. Periksa kancing & kerah
                this.highlightBlueprintStep('step-check');
                this.dom.stageLog.textContent = `[${call.day}] 3. Periksa kebersihan kerah baju...`;
                await sleep(180);

                // 4. Setrika badan
                this.highlightBlueprintStep('step-iron-front');
                this.dom.stageLog.textContent = `[${call.day}] 4. Setrika bagian badan baju hingga rapi...`;
                await sleep(180);

                // 5. Setrika lengan
                this.highlightBlueprintStep('step-iron-sleeve');
                this.dom.stageLog.textContent = `[${call.day}] 5. Setrika lengan baju hingga licin...`;
                await sleep(180);

                // 6. Pasang kancing
                this.highlightBlueprintStep('step-button');
                this.dom.stageLog.textContent = `[${call.day}] 6. Pasang dan rapikan kancing baju...`;
                await sleep(150);

                // 7. Semprot pewangi
                this.highlightBlueprintStep('step-perfume');
                this.dom.stageLog.textContent = `[${call.day}] 7. Semprot parfum pewangi pakaian...`;
                await sleep(160);

                // 8. Pasangkan baju ke mannequin
                this.highlightBlueprintStep('step-wear');
                this.setMannequinOutfit({ shirt: effectiveShirt, pants: 'MERAH', acc: 'NONE' });
                sfx.equipChime();
                await sleep(240);

                // 9. Tutup pintu lemari
                this.highlightBlueprintStep('step-close');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Siap';
                await sleep(160);
            } else if (hasPants && !hasAcc) {
                // Tier 2: 2 Parameter (atasan & bawahan) — Setelan baju dan celana
                // 1. Buka pintu lemari
                this.highlightBlueprintStep('step-open');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Buka Lemari';
                this.dom.stageLog.textContent = `[${call.day}] 1. Buka pintu lemari pakaian...`;
                await sleep(200);

                // 2. Ambil baju atasan
                this.highlightBlueprintStep('step-shirt');
                document.querySelectorAll('.wardrobe-item-pill').forEach(el => el.classList.remove('active-pick'));
                const pickShirtEl = document.getElementById(`closet-shirt-${effectiveShirt}`);
                if (pickShirtEl) pickShirtEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 2. Ambil baju '${shirtName}' dari gantungan...`;
                await sleep(250);

                // 3. Setrika baju
                this.highlightBlueprintStep('step-iron-shirt');
                this.dom.stageLog.textContent = `[${call.day}] 3. Setrika baju dan rapikan kancing...`;
                await sleep(180);

                // 4. Ambil celana bawahan
                this.highlightBlueprintStep('step-pants');
                const pickPantsEl = document.getElementById(`closet-pants-${effectivePants}`);
                if (pickPantsEl) pickPantsEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 4. Ambil celana '${pantsName}' dari rak lemari...`;
                await sleep(220);

                // 5. Setrika celana
                this.highlightBlueprintStep('step-iron-pants');
                this.dom.stageLog.textContent = `[${call.day}] 5. Setrika dan luruskan lipatan celana...`;
                await sleep(180);

                // 6. Satukan setelan
                this.highlightBlueprintStep('step-match');
                this.dom.stageLog.textContent = `[${call.day}] 6. Satukan setelan baju dan celana...`;
                await sleep(150);

                // 7. Semprot pewangi
                this.highlightBlueprintStep('step-perfume');
                this.dom.stageLog.textContent = `[${call.day}] 7. Semprot parfum pewangi pakaian...`;
                await sleep(160);

                // 8. Pasangkan setelan ke mannequin
                this.highlightBlueprintStep('step-wear');
                this.setMannequinOutfit({ shirt: effectiveShirt, pants: effectivePants, acc: 'NONE' });
                sfx.equipChime();
                await sleep(240);

                // 9. Tutup pintu lemari
                this.highlightBlueprintStep('step-close');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Siap';
                await sleep(160);
            } else {
                // Tier 3: 3 Parameter (atasan, bawahan, atribut) — Seragam lengkap
                // 1. Buka pintu lemari
                this.highlightBlueprintStep('step-open');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Buka Lemari';
                this.dom.stageLog.textContent = `[${call.day}] 1. Buka pintu lemari pakaian...`;
                await sleep(200);

                // 2. Ambil baju atasan
                this.highlightBlueprintStep('step-shirt');
                document.querySelectorAll('.wardrobe-item-pill').forEach(el => el.classList.remove('active-pick'));
                const pickShirtEl = document.getElementById(`closet-shirt-${effectiveShirt}`);
                if (pickShirtEl) pickShirtEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 2. Ambil baju '${shirtName}' dari gantungan...`;
                await sleep(250);

                // 3. Setrika baju
                this.highlightBlueprintStep('step-iron-shirt');
                this.dom.stageLog.textContent = `[${call.day}] 3. Setrika baju dan rapikan kancing...`;
                await sleep(180);

                // 4. Ambil celana bawahan
                this.highlightBlueprintStep('step-pants');
                const pickPantsEl = document.getElementById(`closet-pants-${effectivePants}`);
                if (pickPantsEl) pickPantsEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 4. Ambil celana '${pantsName}' dari rak lemari...`;
                await sleep(220);

                // 5. Setrika celana
                this.highlightBlueprintStep('step-iron-pants');
                this.dom.stageLog.textContent = `[${call.day}] 5. Setrika dan rapikan lipatan celana...`;
                await sleep(180);

                // 6. Pasang atribut
                this.highlightBlueprintStep('step-acc');
                const pickAccEl = document.getElementById(`closet-acc-${effectiveAcc}`);
                if (pickAccEl) pickAccEl.classList.add('active-pick');
                sfx.clothSlide();
                this.dom.stageLog.textContent = `[${call.day}] 6. Ambil dan pasang atribut '${accName}'...`;
                await sleep(200);

                // 7. Semprot pewangi
                this.highlightBlueprintStep('step-perfume');
                this.dom.stageLog.textContent = `[${call.day}] 7. Semprot parfum pewangi pakaian...`;
                await sleep(160);

                // 8. Pasang ke mannequin
                this.highlightBlueprintStep('step-wear');
                this.setMannequinOutfit({ shirt: effectiveShirt, pants: effectivePants, acc: effectiveAcc });
                sfx.equipChime();
                await sleep(240);

                // 9. Tutup pintu lemari
                this.highlightBlueprintStep('step-close');
                if (this.dom.closetArmStatus) this.dom.closetArmStatus.textContent = '🦾 Siap';
                await sleep(160);
            }

            this.highlightBlueprintStep(null);

            // Evaluation against requirement
            let isCorrect = false;
            if (!hasPants && !hasAcc) {
                isCorrect = (effectiveShirt === dayConfig.req.shirt);
            } else if (hasPants && !hasAcc) {
                isCorrect = (effectiveShirt === dayConfig.req.shirt && effectivePants === dayConfig.req.pants);
            } else {
                isCorrect = (
                    effectiveShirt === dayConfig.req.shirt &&
                    effectivePants === dayConfig.req.pants &&
                    effectiveAcc === dayConfig.req.acc
                );
            }

            const icon = document.getElementById(`cal-status-${dayIdx}`);
            if (isCorrect) {
                if (cal) cal.className = 'day-card day-passed';
                if (card) {
                    card.classList.remove('active-executing');
                    card.classList.add('call-passed');
                }
                if (badge) badge.textContent = '✅ Berhasil';
                if (icon) icon.textContent = '✅';
                this.dom.mannequinTag.textContent = `${call.day}: Baju ${shirtName}${hasPants ? ', Celana ' + pantsName : ''}! ✨`;
                this.dom.stageLog.textContent = `✅ ${call.day}: Pemanggilan fungsi tepat! Baju ${shirtName}${hasPants ? ' & celana ' + pantsName : ''} siap.`;
                return true;
            } else {
                if (cal) cal.className = 'day-card day-failed';
                if (card) {
                    card.classList.remove('active-executing');
                    card.classList.add('call-failed');
                }
                if (badge) badge.textContent = '❌ Tidak Sesuai';
                if (icon) icon.textContent = '❌';
                sfx.errorBuzzer();
                this.dom.mannequinTag.textContent = `${call.day}: Tidak Cocok!`;
                this.dom.stageLog.textContent = `❌ ${call.day}: Pakaian belum sesuai ketentuan tugas.`;
                this.showAlertModal(
                    'Pilihan Belum Sesuai!',
                    `Untuk <strong>Soal ${dayIdx + 1} (${call.day})</strong>:<br><br>Tugasnya: <em>"${call.promptText}"</em><br><br>Periksa kembali argumen pada <code>${call.rawCall}</code>!`,
                    card
                );
                return false;
            }
        }

        onVictory() {
            sfx.fanfareWin();
            if (window.confetti) {
                confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            }

            this.stars[this.currentLvlIdx] = 3;
            localStorage.setItem('outfitbot_stars', JSON.stringify(this.stars));
            this.updateScoreDisplay();

            const levels = window.OUTFITBOT_LEVELS || [];
            const vicHeading = document.getElementById('vic-heading');
            const vicSub = document.getElementById('vic-submessage');
            vicHeading.textContent = `Level ${levels[this.currentLvlIdx].id} Berhasil!`;
            vicSub.innerHTML = `Luar biasa! Seluruh lembar soal pemanggilan fungsi berhasil diselesaikan dengan tepat!`;
            this.dom.vicModal.classList.add('open');
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        new OutfitBotApp();
    });
})();
