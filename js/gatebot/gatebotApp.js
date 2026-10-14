/**
 * GATE-BOT — Main Application Controller
 * File: js/gatebot/gatebotApp.js
 * Coordinates Game State, Boolean Evaluation, Sound FX, and Visitor Decisions
 */

(function() {
    'use strict';

    class GateBotApp {
        constructor() {
            this.currentLvlIdx = 0;
            this.stars = JSON.parse(localStorage.getItem('gatebot_stars') || '[0, 0, 0, 0, 0]');
            this.userDecisions = [];
            this.isRunning = false;
            this.currentVisitorIdx = 0;

            this.dom = {
                scorePill: document.getElementById('score-stars-pill'),
                activeLvlLabel: document.getElementById('label-active-level'),
                missionContent: document.getElementById('mission-content'),
                targetRuleText: document.getElementById('target-rule-text'),
                allowedAttrsPills: document.getElementById('allowed-attrs-pills'),
                visitorQueueList: document.getElementById('visitor-queue-list'),
                stageLog: document.getElementById('stage-log-display'),
                btnRun: document.getElementById('btn-run-gate'),
                btnStep: document.getElementById('btn-step-gate'),
                btnReset: document.getElementById('btn-reset-gate'),
                gateArm: document.getElementById('gate-barrier-arm'),
                gateLightBulb: document.getElementById('gate-status-light'),
                gateStatusText: document.getElementById('gate-status-text'),
                botEyes: document.getElementById('gate-bot-eyes'),
                botStatusTag: document.getElementById('bot-status-tag'),
                currentVisitorCard: document.getElementById('active-visitor-booth'),
                lvlModal: document.getElementById('modal-level-selector'),
                lvlButtonsContainer: document.getElementById('modal-level-buttons'),
                vicModal: document.getElementById('modal-victory-dialog'),
                alertModal: document.getElementById('modal-alert-dialog'),
                alertTitle: document.getElementById('alert-dialog-title'),
                alertMessage: document.getElementById('alert-dialog-message'),
                btnAlertConfirm: document.getElementById('btn-alert-confirm')
            };

            this.sound = new window.GateBotSound();
            this.renderer = new window.GateBotRenderer(this.dom);
            this.pendingAlertFocusEl = null;

            this.initEvents();
            this.loadLevel(0);
        }

        showAlertModal(title, message, targetEl) {
            this.sound.gateDenied();
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
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('pulse-attention');
                        setTimeout(() => el.classList.remove('pulse-attention'), 2000);
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
                this.sound.muted = !this.sound.muted;
                e.currentTarget.textContent = this.sound.muted ? '🔇' : '🔊';
            });

            this.dom.btnRun.addEventListener('click', () => this.runSimulation());
            this.dom.btnStep.addEventListener('click', () => this.stepSimulation());
            this.dom.btnReset.addEventListener('click', () => this.resetSimulation(true));

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
                this.resetSimulation(false);
            });
            document.getElementById('btn-vic-continue').addEventListener('click', () => {
                this.dom.vicModal.classList.remove('open');
                const levels = window.GATEBOT_LEVELS || [];
                if (this.currentLvlIdx < levels.length - 1) {
                    this.loadLevel(this.currentLvlIdx + 1);
                } else {
                    this.loadLevel(0);
                }
            });
        }

        loadLevel(idx) {
            this.currentLvlIdx = idx;
            const lvl = window.GATEBOT_LEVELS[idx];

            this.updateScoreDisplay();
            this.renderer.renderLevelInfo(lvl);

            // Initialize decisions array with null for all visitors
            this.userDecisions = new Array(lvl.visitors.length).fill(null);

            this.renderer.renderVisitorWorksheet(lvl, this.userDecisions, (visitorIdx, val) => {
                this.handleChoice(visitorIdx, val);
            });

            this.resetSimulation(false);
        }

        handleChoice(visitorIdx, val) {
            if (this.isRunning) return;
            this.userDecisions[visitorIdx] = val;
            this.renderer.updateCardChoiceUI(visitorIdx, val);
            this.sound.playTone(val ? 587.33 : 370, 0.05, 'triangle', 0.12);

            if (this.userDecisions.every(d => d !== null)) {
                setTimeout(() => {
                    this.scrollToStage();
                }, 300);
            }
        }

        scrollToStage() {
            if (window.innerWidth <= 1024) {
                const stage = document.querySelector('.card-deck');
                if (stage) {
                    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }

        renderLevelModal() {
            const levels = window.GATEBOT_LEVELS || [];
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
            if (confirm('Yakin ingin mereset semua bintang GATE-BOT ke 0?\nSemua riwayat bintang level akan dikosongkan agar fresh untuk kelas baru.')) {
                this.stars = [0, 0, 0, 0, 0];
                localStorage.setItem('gatebot_stars', JSON.stringify(this.stars));
                this.updateScoreDisplay();
                this.renderLevelModal();
                this.sound.gateOpen();
            }
        }

        resetSimulation(clearDecisions = false) {
            this.isRunning = false;
            this.currentVisitorIdx = 0;
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            const lvl = window.GATEBOT_LEVELS[this.currentLvlIdx];

            if (clearDecisions) {
                this.userDecisions = new Array(lvl.visitors.length).fill(null);
                this.renderer.renderVisitorWorksheet(lvl, this.userDecisions, (visitorIdx, val) => {
                    this.handleChoice(visitorIdx, val);
                });
            }

            this.renderer.resetQueueVisuals(lvl, this.userDecisions);
            this.renderer.setGateState('OFF');
            this.dom.stageLog.textContent = '🤖 GATE-BOT siap. Tentukan keputusan TRUE / FALSE untuk tiap anak lalu jalankan robot.';
        }

        validateAllDecisionsMade() {
            const lvl = window.GATEBOT_LEVELS[this.currentLvlIdx];
            for (let i = 0; i < lvl.visitors.length; i++) {
                if (this.userDecisions[i] === null) {
                    const card = document.getElementById(`vis-card-${i}`);
                    this.showAlertModal(
                        'Pilihan Belum Lengkap!',
                        `Pilih apakah gerbang bernilai <strong>TRUE (Buka)</strong> atau <strong>FALSE (Kunci)</strong> untuk <strong>Soal ${i + 1}: ${lvl.visitors[i].name}</strong>.`,
                        card
                    );
                    return false;
                }
            }
            return true;
        }

        async runSimulation() {
            if (this.isRunning) return;
            if (!this.validateAllDecisionsMade()) return;

            this.scrollToStage();
            if (window.innerWidth <= 1024) {
                await new Promise(r => setTimeout(r, 350));
            }

            this.isRunning = true;
            this.dom.btnRun.disabled = true;
            this.dom.btnStep.disabled = true;

            const lvl = window.GATEBOT_LEVELS[this.currentLvlIdx];
            let allPassed = true;

            for (let i = 0; i < lvl.visitors.length; i++) {
                const passed = await this.inspectVisitor(i);
                if (!passed) {
                    allPassed = false;
                    break;
                }
                await new Promise(r => setTimeout(r, 650));
            }

            this.isRunning = false;
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            if (allPassed) {
                this.onVictory();
            }
        }

        async stepSimulation() {
            if (this.isRunning) return;
            if (!this.validateAllDecisionsMade()) return;

            this.scrollToStage();
            if (window.innerWidth <= 1024) {
                await new Promise(r => setTimeout(r, 350));
            }

            const lvl = window.GATEBOT_LEVELS[this.currentLvlIdx];
            if (this.currentVisitorIdx >= lvl.visitors.length) {
                this.resetSimulation(false);
            }

            this.dom.btnRun.disabled = true;
            this.dom.btnStep.disabled = true;

            const passed = await this.inspectVisitor(this.currentVisitorIdx);
            this.dom.btnRun.disabled = false;
            this.dom.btnStep.disabled = false;

            if (passed) {
                this.currentVisitorIdx++;
                if (this.currentVisitorIdx >= lvl.visitors.length) {
                    this.onVictory();
                }
            }
        }

        async inspectVisitor(visitorIdx) {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            const lvl = window.GATEBOT_LEVELS[this.currentLvlIdx];
            const visitor = lvl.visitors[visitorIdx];
            const userChoice = this.userDecisions[visitorIdx];

            // Highlight queue item
            document.querySelectorAll('.visitor-question-card').forEach(c => c.classList.remove('vis-active'));
            const card = document.getElementById(`vis-card-${visitorIdx}`);
            const badge = document.getElementById(`vis-badge-${visitorIdx}`);
            if (card) card.classList.add('vis-active');
            if (badge) {
                badge.textContent = '⚡ Memeriksa...';
                badge.className = 'vis-status-badge badge-checking';
            }

            // Calculate exact truth equation using evaluator
            const allowedKeys = lvl.allowedAttributes.map(a => a.key);
            const evalResult = window.GateBotEvaluator.evaluate(lvl.logicExpression, visitor.attributes, allowedKeys);
            const trueOutcome = evalResult.result;

            // Display in active inspection booth
            this.renderer.renderActiveBooth(visitor, visitorIdx, lvl, evalResult.equationStr, userChoice);
            this.renderer.setGateState('CHECKING');
            this.dom.stageLog.textContent = `[${visitor.name}] Sensor membaca atribut pengunjung...`;
            await sleep(450);

            // Gate physically reacts to truth value
            if (trueOutcome) {
                this.renderer.setGateState('OPEN');
                this.sound.gateOpen();
            } else {
                this.renderer.setGateState('CLOSED');
            }

            await sleep(550);

            // Compare student's decision with true outcome
            const isStudentCorrect = (userChoice === trueOutcome);

            if (isStudentCorrect) {
                if (card) {
                    card.classList.remove('vis-active');
                    card.classList.add('vis-passed');
                }
                if (badge) {
                    badge.textContent = trueOutcome ? '✅ Tepat (TRUE)' : '✅ Tepat (FALSE)';
                    badge.className = 'vis-status-badge badge-pass';
                }
                this.sound.accessGranted();
                this.dom.stageLog.textContent = `✅ [${visitor.name}] Pilihan tepat! ${evalResult.equationStr} (${visitor.reason})`;
                return true;
            } else {
                if (card) {
                    card.classList.remove('vis-active');
                    card.classList.add('vis-failed');
                }
                if (badge) {
                    badge.textContent = '❌ Pilihan Keliru';
                    badge.className = 'vis-status-badge badge-fail';
                }
                this.sound.gateDenied();
                this.dom.stageLog.textContent = `❌ [${visitor.name}] Keliru! Kamu memilih ${userChoice ? 'TRUE' : 'FALSE'}, padahal hasilnya ${trueOutcome ? 'TRUE' : 'FALSE'}.`;
                this.showAlertModal(
                    'Keputusan Kurang Tepat!',
                    `Untuk <strong>Soal ${visitorIdx + 1}: ${visitor.name}</strong>:<br><br>` +
                    `Atribut yang dibawa: <em>${lvl.allowedAttributes.map(a => `${a.key}=${visitor.attributes[a.key] ? 'TRUE' : 'FALSE'}`).join(', ')}</em>.<br><br>` +
                    `Evaluasi Logika:<br><code>${evalResult.equationStr}</code><br><br>` +
                    `Kamu memilih <strong>${userChoice ? 'TRUE (Buka)' : 'FALSE (Kunci)'}</strong>, seharusnya <strong>${trueOutcome ? 'TRUE (Buka)' : 'FALSE (Kunci)'}</strong>.<br><br>` +
                    `<em>Penjelasan: ${visitor.reason}</em>`,
                    card
                );
                return false;
            }
        }

        onVictory() {
            this.sound.fanfareWin();
            if (window.confetti) {
                confetti({ particleCount: 95, spread: 70, origin: { y: 0.6 } });
            }

            this.stars[this.currentLvlIdx] = 3;
            localStorage.setItem('gatebot_stars', JSON.stringify(this.stars));
            this.updateScoreDisplay();

            const levels = window.GATEBOT_LEVELS || [];
            const vicHeading = document.getElementById('vic-heading');
            const vicSub = document.getElementById('vic-submessage');
            vicHeading.textContent = `Level ${levels[this.currentLvlIdx].id} Sempurna!`;
            vicSub.innerHTML = `Hebat sekali! Semua nilai logika <strong>TRUE</strong> dan <strong>FALSE</strong> berhasil dianalisis dengan 100% tepat!`;
            this.dom.vicModal.classList.add('open');
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        new GateBotApp();
    });
})();
