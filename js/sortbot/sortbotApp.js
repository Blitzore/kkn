/**
 * SORT-BOT — Application Controller & Simulation Engine
 * File: js/sortbot/sortbotApp.js
 */

(function() {
    'use strict';

    // Web Audio Synthesizer
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
        playWhoosh() {
            if (this.muted) return;
            try {
                this.init();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.18);
                osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.38);
                gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.38);
            } catch(e) {}
        }
        scanBeep() { this.playTone(720, 0.11, 'sine', 0.14); }
        successDing() {
            this.playTone(523.25, 0.08, 'triangle', 0.18);
            setTimeout(() => this.playTone(659.25, 0.14, 'triangle', 0.18), 80);
        }
        errorBuzzer() { this.playTone(180, 0.28, 'sawtooth', 0.22); }
        fanfareWin() {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((n, i) => setTimeout(() => this.playTone(n, 0.22, 'triangle', 0.22), i * 110));
        }
    }

    const sfx = new SoundFX();

    const BIN_CATALOG = {
        KUNING: { key: 'KUNING', label: 'Tong Kuning', icon: '🟡', title: 'TONG KUNING' },
        HIJAU:  { key: 'HIJAU',  label: 'Tong Hijau',  icon: '🟢', title: 'TONG HIJAU' },
        MERAH:  { key: 'MERAH',  label: 'Tong Merah',  icon: '🔴', title: 'TONG MERAH' },
        BIRU:   { key: 'BIRU',   label: 'Tong Biru',   icon: '🔵', title: 'TONG BIRU' }
    };

    // State
    let activeLevelIdx = 0;
    let isRunningSimulation = false;
    let currentItemPointer = 0;
    let binCounts = { KUNING: 0, HIJAU: 0, MERAH: 0, BIRU: 0 };
    let starsHistory = JSON.parse(localStorage.getItem('sortbot_stars_v2') || '[0, 0, 0, 0, 0]');

    // DOM Elements
    let $labelActiveLevel;
    let $scoreStarsPill;
    let $missionContent;
    let $telemetryText;
    let $scannerLaser;
    let $conveyorBelt;
    let $itemsTrack;
    let $binsDock;
    let $factoryLog;

    // Logic Workspace DOM
    let $selectIfCond;
    let $selectIfAction;
    let $dynamicElseIfContainer;
    let $selectElseAction;

    let $btnRunFactory;
    let $btnStepFactory;
    let $btnResetFactory;

    // Modals
    let $modalLevelSelector;
    let $btnShowLevels;
    let $btnCloseLevelModal;
    let $modalLevelButtons;

    let $modalVictoryDialog;
    let $btnVicReplay;
    let $btnVicContinue;

    let $modalConceptGuide;
    let $btnOpenConceptModal;
    let $btnGuideInline;
    let $btnCloseConceptModal;
    let $btnUnderstandConcept;

    // Alert Pop-up Modal
    let $modalAlertDialog;
    let $alertDialogTitle;
    let $alertDialogMessage;
    let $btnAlertConfirm;
    let pendingAlertFocusEl = null;

    function init() {
        $labelActiveLevel = document.getElementById('label-active-level');
        $scoreStarsPill = document.getElementById('score-stars-pill');
        $missionContent = document.getElementById('mission-content');
        $telemetryText = document.getElementById('telemetry-text');
        $scannerLaser = document.getElementById('scanner-laser-line');
        $conveyorBelt = document.getElementById('conveyor-moving-belt');
        $itemsTrack = document.getElementById('items-track-container');
        $binsDock = document.getElementById('bins-dock-container');
        $factoryLog = document.getElementById('factory-log-display');

        $selectIfCond = document.getElementById('select-if-cond');
        $selectIfAction = document.getElementById('select-if-action');
        $dynamicElseIfContainer = document.getElementById('dynamic-elseif-container');
        $selectElseAction = document.getElementById('select-else-action');

        $btnRunFactory = document.getElementById('btn-run-factory');
        $btnStepFactory = document.getElementById('btn-step-factory');
        $btnResetFactory = document.getElementById('btn-reset-factory');

        $modalLevelSelector = document.getElementById('modal-level-selector');
        $btnShowLevels = document.getElementById('btn-show-levels');
        $btnCloseLevelModal = document.getElementById('btn-close-level-modal');
        $modalLevelButtons = document.getElementById('modal-level-buttons');

        $modalVictoryDialog = document.getElementById('modal-victory-dialog');
        $btnVicReplay = document.getElementById('btn-vic-replay');
        $btnVicContinue = document.getElementById('btn-vic-continue');

        $modalConceptGuide = document.getElementById('modal-concept-guide');
        $btnOpenConceptModal = document.getElementById('btn-open-concept-modal');
        $btnGuideInline = document.getElementById('btn-guide-inline');
        $btnCloseConceptModal = document.getElementById('btn-close-concept-modal');
        $btnUnderstandConcept = document.getElementById('btn-understand-concept');

        $modalAlertDialog = document.getElementById('modal-alert-dialog');
        $alertDialogTitle = document.getElementById('alert-dialog-title');
        $alertDialogMessage = document.getElementById('alert-dialog-message');
        $btnAlertConfirm = document.getElementById('btn-alert-confirm');

        renderLevel(activeLevelIdx);
        bindEventListeners();
        updateGlobalStarsHUD();
    }

    function updateGlobalStarsHUD() {
        if (!$scoreStarsPill) return;
        const total = starsHistory.reduce((a, b) => a + b, 0);
        $scoreStarsPill.textContent = `⭐ ${total}/15 Bintang`;
    }

    function updateLiveScannerHUD() {
        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
        const $icon = document.getElementById('scan-disp-icon');
        const $name = document.getElementById('scan-disp-name');
        const $catVal = document.getElementById('scan-disp-cat-val');
        if (!$icon || !$name || !$catVal) return;

        if (currentItemPointer < lvl.items.length) {
            const item = lvl.items[currentItemPointer];
            $icon.textContent = item.icon;
            $name.textContent = item.name;
            $catVal.textContent = item.type;
        } else {
            $icon.textContent = '🎉';
            $name.textContent = 'Semua Selesai Disortir!';
            $catVal.textContent = 'SELESAI';
        }
    }

    function renderLevel(idx) {
        activeLevelIdx = idx;
        const lvl = window.SORTBOT_LEVELS[idx];
        isRunningSimulation = false;
        currentItemPointer = 0;
        binCounts = { KUNING: 0, HIJAU: 0, MERAH: 0, BIRU: 0 };

        if ($labelActiveLevel) $labelActiveLevel.textContent = `Level ${lvl.id}`;
        if ($missionContent) {
            $missionContent.innerHTML = `
                <div class="mission-top-row">
                    <span class="mission-badge-title">🎯 ${lvl.headline}</span>
                </div>
                <div class="mission-goal-text">${lvl.puzzleGoal}</div>
                <div class="mission-clues-row">
                    ${lvl.clues.map(c => `
                        <span class="clue-chip ${c.isElse ? 'chip-else' : ''}">${c.text}</span>
                    `).join('')}
                </div>
            `;
        }
        if ($telemetryText) $telemetryText.textContent = `STATUS: AKTIF`;
        if ($conveyorBelt) $conveyorBelt.classList.remove('running');
        if ($scannerLaser) $scannerLaser.classList.remove('scanning');

        // 1. Render Realistic 3D Wheelie Bins (Hanya Tulis Warna Tong)
        $binsDock.innerHTML = lvl.availableBins.map(binKey => {
            const info = BIN_CATALOG[binKey];
            return `
                <div class="realistic-bin-container big-bin-card" data-type="${info.key}" id="bin-elem-${info.key}">
                    <div class="bin-lid-assembly">
                        <div class="bin-handle"></div>
                        <div class="bin-lid-cover"></div>
                        <div class="bin-lid-rim"></div>
                    </div>
                    <div class="bin-barrel-body">
                        <div class="bin-ribs-overlay"></div>
                        <div class="bin-emblem-badge">
                            <span class="bin-recycle-icon">♻️</span>
                            <span class="bin-category-name">${info.title}</span>
                        </div>
                        <div class="bin-counter-badge" id="bincount-${info.key}">0 item</div>
                    </div>
                    <div class="bin-wheel-base">
                        <div class="bin-wheel wheel-left"></div>
                        <div class="bin-axle"></div>
                        <div class="bin-wheel wheel-right"></div>
                    </div>
                </div>
            `;
        }).join('');

        // 2. Setup Action Dropdown Options (Tanpa tanda kurung)
        const actionOptions = `
            <option value="" selected>-- Pilih Tindakan / Tong --</option>
            ${lvl.availableBins.map(k => `<option value="${k}">Buang ke ${BIN_CATALOG[k].label}</option>`).join('')}
        `;

        $selectIfAction.innerHTML = actionOptions;
        $selectElseAction.innerHTML = actionOptions;

        // Reset IF dropdown to unconfigured placeholder
        $selectIfCond.selectedIndex = 0;
        $selectIfCond.classList.add('unconfigured');
        $selectIfAction.selectedIndex = 0;
        $selectIfAction.classList.add('unconfigured');
        $selectElseAction.selectedIndex = 0;
        $selectElseAction.classList.add('unconfigured');

        clearBranchEvaluations();

        // 3. Render Fixed ELSE IF branches based on level bin count
        $dynamicElseIfContainer.innerHTML = '';
        const requiredElseIfCount = Math.max(0, lvl.availableBins.length - 2);
        for (let bIdx = 0; bIdx < requiredElseIfCount; bIdx++) {
            addElseIfBranch(lvl.availableBins, bIdx + 1);
        }

        // 4. Render Items on track & update Live Scanner HUD
        renderTrackItems();
        updateLiveScannerHUD();

        $factoryLog.innerHTML = `🤖 Susun aturan logika percabangan lalu jalankan pabrik.`;
        $btnRunFactory.disabled = false;
        $btnStepFactory.disabled = false;
    }

    function addElseIfBranch(availableBins, branchNumber = 1) {
        const branchId = 'elseif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
        const row = document.createElement('div');
        row.className = 'branch-row dynamic-branch';
        row.id = branchId;

        row.innerHTML = `
            <div class="branch-head-line">
                <span class="badge-elseif">LAINNYA JIKA (ELSE IF)</span>
                <span>(Kategori ==</span>
                <select class="rule-select unconfigured cond-select">
                    <option value="" selected>-- Pilih Kategori --</option>
                    <option value="PLASTIK">PLASTIK 🧴</option>
                    <option value="ORGANIK">ORGANIK 🍏</option>
                    <option value="LOGAM">LOGAM / B3 🥫</option>
                    <option value="KERTAS">KERTAS 📦</option>
                </select>
                <span>)</span>
                <span class="branch-eval-pill eval-pill-elseif"></span>
            </div>
            <div class="branch-action-line">
                <span>👉 MAKA :</span>
                <select class="rule-select unconfigured action-select">
                    <option value="" selected>-- Pilih Tindakan / Tong --</option>
                    ${availableBins.map(k => `<option value="${k}">Buang ke ${BIN_CATALOG[k].label}</option>`).join('')}
                </select>
            </div>
        `;

        row.querySelectorAll('.rule-select').forEach(sel => {
            sel.addEventListener('change', () => sel.classList.remove('unconfigured'));
        });

        $dynamicElseIfContainer.appendChild(row);
    }

    function renderTrackItems() {
        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
        $itemsTrack.innerHTML = '';
        const stageW = $itemsTrack.offsetWidth || 500;
        const itemSpacing = 108;
        const cardWidth = 86;
        const scannerCenter = (stageW / 2) - (cardWidth / 2);

        lvl.items.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'trash-item-card';
            card.id = `trash-card-${i}`;
            card.innerHTML = `
                <span class="trash-icon">${item.icon}</span>
                <span class="trash-title">${item.name}</span>
                <span class="trash-cat-tag">[${item.type}]</span>
            `;
            const leftPos = scannerCenter - ((i - currentItemPointer) * itemSpacing);
            card.style.left = `${leftPos}px`;
            $itemsTrack.appendChild(card);
        });
    }

    function updateTrackPositions() {
        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
        const stageW = $itemsTrack.offsetWidth || 500;
        const itemSpacing = 108;
        const cardWidth = 86;
        const scannerCenter = (stageW / 2) - (cardWidth / 2);

        lvl.items.forEach((item, i) => {
            const card = document.getElementById(`trash-card-${i}`);
            if (!card) return;
            const offset = i - currentItemPointer;
            card.style.left = `${scannerCenter - (offset * itemSpacing)}px`;

            if (i === currentItemPointer) {
                card.classList.add('in-scan');
            } else {
                card.classList.remove('in-scan');
            }
        });

        updateLiveScannerHUD();
    }

    // Alert Modal Controls (Peringatan Pop-up Ramah Anak)
    function showAlertModal(title, message, targetEl, icon = '⚠️') {
        sfx.errorBuzzer();
        pendingAlertFocusEl = targetEl;

        const iconEl = document.getElementById('alert-dialog-icon');
        if (iconEl) iconEl.textContent = icon;
        if ($alertDialogTitle) $alertDialogTitle.textContent = title;
        if ($alertDialogMessage) $alertDialogMessage.innerHTML = message;
        if ($modalAlertDialog) $modalAlertDialog.classList.add('open');
    }

    function closeAlertModal() {
        if ($modalAlertDialog) $modalAlertDialog.classList.remove('open');
        if (pendingAlertFocusEl) {
            const el = pendingAlertFocusEl;
            pendingAlertFocusEl = null;
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

    // Validate whether player has actually configured the rules
    function validatePlayerRules() {
        if (!$selectIfCond.value) {
            showAlertModal(
                'Syarat JIKA Belum Dipilih!',
                'Pilih <strong>Kategori Sampah</strong> pada blok <strong>JIKA</strong> sebelum menjalankan pabrik.',
                $selectIfCond
            );
            return false;
        }
        if (!$selectIfAction.value) {
            showAlertModal(
                'Tindakan JIKA Belum Dipilih!',
                'Tentukan <strong>Tong Pembuangan</strong> pada blok <strong>JIKA</strong> agar robot tahu harus membuang ke mana.',
                $selectIfAction
            );
            return false;
        }

        const elseIfRows = $dynamicElseIfContainer.querySelectorAll('.dynamic-branch');
        for (let row of elseIfRows) {
            const condSel = row.querySelector('.cond-select');
            const actSel = row.querySelector('.action-select');
            if (!condSel.value) {
                showAlertModal(
                    'Syarat LAINNYA JIKA Kosong!',
                    'Pilih <strong>Kategori Sampah</strong> pada cabang <strong>LAINNYA JIKA</strong> agar robot dapat memeriksa sampah.',
                    condSel
                );
                return false;
            }
            if (!actSel.value) {
                showAlertModal(
                    'Tindakan LAINNYA JIKA Kosong!',
                    'Pilih <strong>Tong Pembuangan</strong> pada cabang <strong>LAINNYA JIKA</strong>.',
                    actSel
                );
                return false;
            }
        }

        if (!$selectElseAction.value) {
            showAlertModal(
                'Tindakan LAINNYA Belum Ada!',
                'Tentukan <strong>Tong Cadangan</strong> pada blok <strong>LAINNYA (ELSE)</strong> untuk sampah yang tidak cocok dengan syarat di atas.',
                $selectElseAction
            );
            return false;
        }
        return true;
    }

    function clearBranchEvaluations() {
        document.querySelectorAll('.branch-row').forEach(row => {
            row.classList.remove('eval-testing', 'eval-matched', 'eval-matched-else', 'eval-failed', 'eval-skipped');
        });
        document.querySelectorAll('.branch-eval-pill').forEach(pill => {
            pill.className = 'branch-eval-pill';
            pill.textContent = '';
        });
    }

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // Full automatic run
    async function runFullSimulation() {
        if (isRunningSimulation) return;
        if (!validatePlayerRules()) {
            sfx.errorBuzzer();
            return;
        }

        isRunningSimulation = true;
        $btnRunFactory.disabled = true;
        $btnStepFactory.disabled = true;
        $conveyorBelt.classList.add('running');
        $telemetryText.textContent = `STATUS: MENJALANKAN SIMULASI...`;

        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];

        while (currentItemPointer < lvl.items.length) {
            const success = await executeOneTrashItem();
            if (!success) {
                // Sorter halted due to logic mismatch
                isRunningSimulation = false;
                $conveyorBelt.classList.remove('running');
                $btnRunFactory.disabled = false;
                $btnStepFactory.disabled = false;
                $telemetryText.textContent = `STATUS: TERHENTI KARENA KESALAHAN SORTIR`;
                return;
            }
            await sleep(400);
        }

        // All items sorted successfully!
        isRunningSimulation = false;
        $conveyorBelt.classList.remove('running');
        $btnRunFactory.disabled = false;
        $btnStepFactory.disabled = false;
        $telemetryText.textContent = `STATUS: PABRIK SUKSES MENYORTIR! 🎉`;
        onLevelComplete();
    }

    // Step-by-step single item evaluation
    async function stepOneItem() {
        if (isRunningSimulation) return;
        if (!validatePlayerRules()) {
            sfx.errorBuzzer();
            return;
        }

        $btnRunFactory.disabled = true;
        $btnStepFactory.disabled = true;
        $conveyorBelt.classList.add('running');

        const success = await executeOneTrashItem();
        $conveyorBelt.classList.remove('running');
        $btnRunFactory.disabled = false;
        $btnStepFactory.disabled = false;

        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
        if (success && currentItemPointer >= lvl.items.length) {
            onLevelComplete();
        }
    }

    // Flying animation for sorted trash item with dynamic lid opening
    function animateTrashFlyToBin(cardElement, binElement, isCorrect) {
        return new Promise((resolve) => {
            if (!cardElement || !binElement) {
                resolve();
                return;
            }

            sfx.playWhoosh();
            const cardRect = cardElement.getBoundingClientRect();
            const binRect = binElement.getBoundingClientRect();

            const targetCenterX = binRect.left + (binRect.width / 2);
            const targetCenterY = binRect.top + 28;

            const clone = cardElement.cloneNode(true);
            clone.classList.remove('in-scan');
            clone.classList.add('flying-trash-clone');
            clone.style.position = 'fixed';
            clone.style.left = `${cardRect.left}px`;
            clone.style.top = `${cardRect.top}px`;
            clone.style.width = `${cardRect.width}px`;
            clone.style.height = `${cardRect.height}px`;
            clone.style.zIndex = '999';
            clone.style.pointerEvents = 'none';
            clone.style.margin = '0';
            clone.style.transition = 'none';
            document.body.appendChild(clone);

            cardElement.classList.add('sorted-hidden');

            const deltaX = targetCenterX - (cardRect.left + (cardRect.width / 2));
            const deltaY = targetCenterY - (cardRect.top + (cardRect.height / 2));
            const arcY = -45;

            // Buka tutup tong saat sampah melayang mendekat
            const lidTimer = setTimeout(() => {
                if (binElement) binElement.classList.add('bin-lid-open');
            }, 75);

            const keyframes = isCorrect ? [
                {
                    transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
                    opacity: 1,
                    boxShadow: '0 8px 24px rgba(56, 189, 248, 0.5)'
                },
                {
                    transform: `translate(${deltaX * 0.4}px, ${arcY}px) scale(1.15) rotate(${deltaX > 0 ? 14 : -14}deg)`,
                    opacity: 1,
                    boxShadow: '0 16px 36px rgba(56, 189, 248, 0.85)',
                    offset: 0.38
                },
                {
                    transform: `translate(${deltaX * 0.88}px, ${deltaY - 8}px) scale(0.9) rotate(${deltaX > 0 ? 20 : -20}deg)`,
                    opacity: 1,
                    offset: 0.82
                },
                {
                    transform: `translate(${deltaX}px, ${deltaY + 28}px) scale(0.35) rotate(${deltaX > 0 ? 30 : -30}deg)`,
                    opacity: 0.25,
                    filter: 'blur(1px)'
                }
            ] : [
                {
                    transform: 'translate(0px, 0px) scale(1.08) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${deltaX * 0.45}px, ${arcY}px) scale(1.18) rotate(${deltaX > 0 ? 14 : -14}deg)`,
                    opacity: 1,
                    offset: 0.42
                },
                {
                    transform: `translate(${deltaX}px, ${deltaY - 4}px) scale(0.95) rotate(0deg)`,
                    borderColor: '#ef4444',
                    boxShadow: '0 0 25px #ef4444',
                    opacity: 1,
                    offset: 0.84
                },
                {
                    transform: `translate(${deltaX}px, ${deltaY + 25}px) scale(0.4) rotate(15deg)`,
                    opacity: 0,
                    filter: 'blur(2px)'
                }
            ];

            const anim = clone.animate(keyframes, {
                duration: 620,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });

            anim.onfinish = () => {
                clearTimeout(lidTimer);
                if (binElement) binElement.classList.remove('bin-lid-open');
                clone.remove();
                if (isCorrect) {
                    binElement.classList.add('bin-catch');
                    setTimeout(() => binElement.classList.remove('bin-catch'), 450);
                    spawnPlusOneBadge(targetCenterX, targetCenterY);
                } else {
                    binElement.classList.add('bin-error');
                    setTimeout(() => binElement.classList.remove('bin-error'), 450);
                }
                resolve();
            };
        });
    }

    function spawnPlusOneBadge(x, y) {
        const badge = document.createElement('div');
        badge.className = 'floating-plus-one';
        badge.textContent = '+1 Tepat! 🎉';
        badge.style.left = `${x - 45}px`;
        badge.style.top = `${y - 10}px`;
        document.body.appendChild(badge);
        setTimeout(() => badge.remove(), 750);
    }

    // Evaluate 1 Trash Item through student's IF - ELSE IF - ELSE logic
    async function executeOneTrashItem() {
        const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
        const item = lvl.items[currentItemPointer];
        const card = document.getElementById(`trash-card-${currentItemPointer}`);

        updateTrackPositions();
        $telemetryText.textContent = `MEMERIKSA: ${item.name} (${item.type})`;
        await sleep(180);

        // Step 1: Scanner Active
        $scannerLaser.classList.add('scanning');
        sfx.scanBeep();
        $factoryLog.innerHTML = `🔍 Memeriksa <strong>[${item.name}]</strong> · Kategori: <span style="color:#38bdf8; font-weight:700;">${item.type}</span>`;

        clearBranchEvaluations();
        await sleep(320);

        // Step 2: Step-by-Step Logic Branch Evaluation
        const ifCond = $selectIfCond.value;
        const ifAction = $selectIfAction.value;
        let chosenAction = null;
        let logBranchText = '';

        // ── 1. EVALUASI JIKA (IF) ──
        const rowIf = document.getElementById('row-if');
        const pillIf = document.getElementById('pill-eval-if');
        rowIf.classList.add('eval-testing');
        pillIf.className = 'branch-eval-pill pill-testing';
        pillIf.textContent = `🔍 Menguji...`;
        await sleep(380);

        if (item.type === ifCond) {
            chosenAction = ifAction;
            rowIf.classList.remove('eval-testing');
            rowIf.classList.add('eval-matched');
            pillIf.className = 'branch-eval-pill pill-matched';
            pillIf.textContent = `✅ Cocok ✓`;
            logBranchText = `✅ Cocok syarat <strong>${ifCond}</strong> ➔ ${BIN_CATALOG[chosenAction]?.label}`;

            // Mark remaining branches as SKIPPED
            markSubsequentBranchesSkipped();
        } else {
            rowIf.classList.remove('eval-testing');
            rowIf.classList.add('eval-failed');
            pillIf.className = 'branch-eval-pill pill-failed';
            pillIf.textContent = `❌ Tidak Cocok ✗`;
            await sleep(300);

            // ── 2. EVALUASI LAINNYA JIKA (ELSE IF) ──
            let elseIfMatched = false;
            const elseIfRows = Array.from($dynamicElseIfContainer.querySelectorAll('.dynamic-branch'));

            for (let i = 0; i < elseIfRows.length; i++) {
                const row = elseIfRows[i];
                const condSel = row.querySelector('.cond-select');
                const actSel = row.querySelector('.action-select');
                const c = condSel.value;
                const a = actSel.value;
                const pill = row.querySelector('.eval-pill-elseif');

                row.classList.add('eval-testing');
                pill.className = 'branch-eval-pill eval-pill-elseif pill-testing';
                pill.textContent = `🔍 Menguji...`;
                await sleep(380);

                if (item.type === c) {
                    chosenAction = a;
                    row.classList.remove('eval-testing');
                    row.classList.add('eval-matched');
                    pill.className = 'branch-eval-pill eval-pill-elseif pill-matched';
                    pill.textContent = `✅ Cocok ✓`;
                    logBranchText = `✅ Cocok cabang ELSE IF ➔ ${BIN_CATALOG[chosenAction]?.label}`;
                    elseIfMatched = true;

                    // Mark remaining else-if & else as skipped
                    for (let j = i + 1; j < elseIfRows.length; j++) {
                        const rNext = elseIfRows[j];
                        const pNext = rNext.querySelector('.eval-pill-elseif');
                        rNext.classList.add('eval-skipped');
                        pNext.className = 'branch-eval-pill eval-pill-elseif pill-skipped';
                        pNext.textContent = `⏭️ Dilewati`;
                    }
                    const rowElse = document.getElementById('row-else');
                    const pillElse = document.getElementById('pill-eval-else');
                    rowElse.classList.add('eval-skipped');
                    pillElse.className = 'branch-eval-pill pill-skipped';
                    pillElse.textContent = `⏭️ Dilewati`;
                    break;
                } else {
                    row.classList.remove('eval-testing');
                    row.classList.add('eval-failed');
                    pill.className = 'branch-eval-pill eval-pill-elseif pill-failed';
                    pill.textContent = `❌ Tidak Cocok ✗`;
                    await sleep(300);
                }
            }

            // ── 3. EVALUASI LAINNYA (ELSE) JIKA TIDAK ADA YANG COCOK ──
            if (!elseIfMatched) {
                chosenAction = $selectElseAction.value;
                const rowElse = document.getElementById('row-else');
                const pillElse = document.getElementById('pill-eval-else');
                rowElse.classList.add('eval-matched-else');
                pillElse.className = 'branch-eval-pill pill-matched-else';
                pillElse.textContent = `⭐ Masuk ELSE ✓`;
                logBranchText = `⭐ Syarat atas tidak cocok. Masuk ke ELSE ➔ ${BIN_CATALOG[chosenAction]?.label}`;
            }
        }

        $factoryLog.innerHTML = logBranchText;

        // Step 3: Highlight target bin
        const binEl = document.getElementById(`bin-elem-${chosenAction}`);
        if (binEl) binEl.classList.add('highlight');
        await sleep(150);

        // Step 4: Flying Trash Animation
        const isCorrect = (item.targetBin ? (item.targetBin === chosenAction) : (item.type === chosenAction));
        await animateTrashFlyToBin(card, binEl, isCorrect);

        $scannerLaser.classList.remove('scanning');

        if (isCorrect) {
            sfx.successDing();
            binCounts[chosenAction] = (binCounts[chosenAction] || 0) + 1;
            const countBadge = document.getElementById(`bincount-${chosenAction}`);
            if (countBadge) countBadge.textContent = `${binCounts[chosenAction]} item`;

            $factoryLog.innerHTML = `<span style="color:#34d399; font-weight:700;">✅ TEPAT!</span> ${item.name} masuk ke ${BIN_CATALOG[chosenAction]?.label}.`;
            currentItemPointer++;
            await sleep(300);

            if (binEl) binEl.classList.remove('highlight');
            clearBranchEvaluations();
            return true;
        } else {
            sfx.errorBuzzer();
            $factoryLog.innerHTML = `<span style="color:#ef4444; font-weight:700;">❌ SALAH TONG!</span> ${item.name} (${item.type}) salah masuk ke ${BIN_CATALOG[chosenAction]?.label}!`;
            showAlertModal(
                'Salah Masuk Tong!',
                `Sampah <strong>${item.name}</strong> (${item.type}) salah masuk ke <strong>${BIN_CATALOG[chosenAction]?.label}</strong>.<br><br>Periksa kembali petunjuk teka-teki pemilahan di atas!`,
                null,
                '❌'
            );
            return false;
        }
    }

    function markSubsequentBranchesSkipped() {
        const elseIfRows = $dynamicElseIfContainer.querySelectorAll('.dynamic-branch');
        elseIfRows.forEach(row => {
            row.classList.add('eval-skipped');
            const pill = row.querySelector('.eval-pill-elseif');
            if (pill) {
                pill.className = 'branch-eval-pill eval-pill-elseif pill-skipped';
                pill.textContent = `⏭️ Dilewati`;
            }
        });
        const rowElse = document.getElementById('row-else');
        const pillElse = document.getElementById('pill-eval-else');
        if (rowElse) rowElse.classList.add('eval-skipped');
        if (pillElse) {
            pillElse.className = 'branch-eval-pill pill-skipped';
            pillElse.textContent = `⏭️ Dilewati (Syarat JIKA cocok)`;
        }
    }

    function onLevelComplete() {
        sfx.fanfareWin();
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        starsHistory[activeLevelIdx] = 3;
        localStorage.setItem('sortbot_stars_v2', JSON.stringify(starsHistory));
        updateGlobalStarsHUD();

        const vicHeading = document.getElementById('vic-heading');
        const vicSub = document.getElementById('vic-submessage');
        vicHeading.textContent = `Level ${activeLevelIdx + 1} Berhasil Diselesaikan!`;
        vicSub.innerHTML = `Selamat! Seluruh sampah berhasil disortir dengan struktur logika <strong>IF - ELSE</strong> yang benar!`;

        $modalVictoryDialog.classList.add('open');
    }

    function renderLevelSelectorModal() {
        $modalLevelButtons.innerHTML = window.SORTBOT_LEVELS.map((lvl, i) => {
            const stars = starsHistory[i] || 0;
            const starText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
            const isCur = (i === activeLevelIdx) ? 'active' : '';
            const isDone = (stars > 0) ? 'cleared' : '';
            return `
                <button type="button" class="lvl-select-btn ${isCur} ${isDone}" data-idx="${i}">
                    <span class="lvl-num">${lvl.id}</span>
                    <span class="lvl-stars">${starText}</span>
                </button>
            `;
        }).join('');

        $modalLevelButtons.querySelectorAll('.lvl-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                $modalLevelSelector.classList.remove('open');
                renderLevel(idx);
            });
        });
    }

    function bindEventListeners() {
        $btnRunFactory.addEventListener('click', runFullSimulation);
        $btnStepFactory.addEventListener('click', stepOneItem);

        $btnResetFactory.addEventListener('click', () => {
            const lvl = window.SORTBOT_LEVELS[activeLevelIdx];
            isRunningSimulation = false;
            currentItemPointer = 0;
            binCounts = { KUNING: 0, HIJAU: 0, MERAH: 0, BIRU: 0 };
            renderLevel(activeLevelIdx);
        });

        // Reset Semua Bintang ke 0
        function resetAllStars() {
            if (confirm('Yakin ingin mereset semua bintang SORT-BOT ke 0?\nSemua riwayat bintang level akan dikosongkan agar fresh untuk kelas baru.')) {
                starsHistory = [0, 0, 0, 0, 0];
                localStorage.setItem('sortbot_stars_v2', JSON.stringify(starsHistory));
                updateGlobalStarsHUD();
                renderLevelSelectorModal();
                sfx.playWhoosh();
            }
        }

        document.getElementById('btn-reset-stars-hud')?.addEventListener('click', resetAllStars);
        document.getElementById('btn-reset-stars-modal')?.addEventListener('click', resetAllStars);

        // Remove unconfigured class when select changed
        [$selectIfCond, $selectIfAction, $selectElseAction].forEach(sel => {
            sel.addEventListener('change', () => sel.classList.remove('unconfigured'));
        });

        // Level Modal toggles
        $btnShowLevels.addEventListener('click', () => {
            renderLevelSelectorModal();
            $modalLevelSelector.classList.add('open');
        });
        $btnCloseLevelModal.addEventListener('click', () => $modalLevelSelector.classList.remove('open'));
        $modalLevelSelector.addEventListener('click', (e) => {
            if (e.target === $modalLevelSelector) $modalLevelSelector.classList.remove('open');
        });

        // Concept Guide Modal toggles
        const openConcept = () => $modalConceptGuide.classList.add('open');
        const closeConcept = () => $modalConceptGuide.classList.remove('open');

        $btnOpenConceptModal.addEventListener('click', openConcept);
        $btnGuideInline.addEventListener('click', openConcept);
        $btnCloseConceptModal.addEventListener('click', closeConcept);
        $btnUnderstandConcept.addEventListener('click', closeConcept);
        $modalConceptGuide.addEventListener('click', (e) => {
            if (e.target === $modalConceptGuide) closeConcept();
        });

        // Victory Modal buttons
        $btnVicReplay.addEventListener('click', () => {
            $modalVictoryDialog.classList.remove('open');
            renderLevel(activeLevelIdx);
        });
        $btnVicContinue.addEventListener('click', () => {
            $modalVictoryDialog.classList.remove('open');
            if (activeLevelIdx < window.SORTBOT_LEVELS.length - 1) {
                renderLevel(activeLevelIdx + 1);
            } else {
                renderLevel(0);
            }
        });

        // Sound Toggle
        const $btnSound = document.getElementById('btn-sound-toggle');
        $btnSound.addEventListener('click', () => {
            sfx.muted = !sfx.muted;
            $btnSound.textContent = sfx.muted ? '🔇' : '🔊';
        });

        // Alert Modal buttons & dismiss
        if ($btnAlertConfirm) {
            $btnAlertConfirm.addEventListener('click', closeAlertModal);
        }
        if ($modalAlertDialog) {
            $modalAlertDialog.addEventListener('click', (e) => {
                if (e.target === $modalAlertDialog) closeAlertModal();
            });
        }
        window.addEventListener('keydown', (e) => {
            if ($modalAlertDialog && $modalAlertDialog.classList.contains('open')) {
                if (e.key === 'Escape' || e.key === 'Enter') {
                    e.preventDefault();
                    closeAlertModal();
                }
            }
        });

        // Re-render track on resize
        window.addEventListener('resize', () => {
            updateTrackPositions();
        });
    }

    window.addEventListener('DOMContentLoaded', init);
})();
