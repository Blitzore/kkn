/**
 * app.js — Controller Utama ALGO-BOT
 * Mengintegrasikan Lobby, Game Screen, CanvasEngine, GameState, dan Interpreter.
 * Bertanggung jawab atas: navigasi antar layar, UI deck, event handler, evaluasi kemenangan.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. Inisialisasi Modul ───────────────────── */
    const audio      = window.soundSystem;
    const gameState  = new window.GameState(window.GAME_LEVELS);
    const canvas     = new window.CanvasEngine('arena-canvas');
    const interpreter = new window.CodeInterpreter(canvas, audio);
    const tutorialDemo = null; // Dipersiapkan untuk demo in-game saat balok baru diperkenalkan
    canvas.start();

    /* ── 2. DOM References ──────────────────────── */
    const $ = id => document.getElementById(id);

    // HUD
    const hudTag      = $('hud-tag');
    const hudTitle    = $('hud-title');
    const hudScore    = $('hud-score');
    const arenaHint   = $('arena-hint');
    const conceptName = $('concept-name');

    // Deck
    const paletteContainer = $('palette-container');
    const mainSlots        = $('main-slots');
    const mainCounter      = $('main-counter');
    const f1Deck           = $('f1-deck');
    const f1Slots          = $('f1-slots');
    const f1Counter        = $('f1-counter');

    // Status
    const statusBar  = $('status-bar');
    const statusIcon = $('status-icon');
    const statusMsg  = $('status-msg');

    // Buttons
    const btnRun   = $('btn-run');
    const btnStep  = $('btn-step');
    const btnClear = $('btn-clear');
    const btnSpeed = $('btn-speed');

    /* ── 3. App State ───────────────────────────── */
    let mainSeq   = [];
    let f1Seq     = [];
    let inputTarget = 'main';   // 'main' | 'f1'
    let stepIdx   = 0;
    let playSpeed = 1;

    /* ── 4. Lobby ───────────────────────────────── */
    const lobby = new window.LobbyScreen(gameState, (levelIdx) => {
        lobby.hide();
        loadLevelWithIntro(levelIdx);
    });

    // Kembali ke lobby dari dalam game
    $('btn-lobby')?.addEventListener('click', () => {
        audio.playClick();
        if (interpreter.isExecuting) {
            interpreter.isExecuting = false;
        }
        lobby.show();
    });

    // Tampilkan lobby saat start atau langsung masuk level jika ada hash #level=X
    const hashMatch = window.location.hash.match(/level=(\d+)/);
    if (hashMatch) {
        const lvlIdx = Math.max(0, Math.min(parseInt(hashMatch[1], 10) - 1, gameState.levels.length - 1));
        lobby.hide();
        loadLevelWithIntro(lvlIdx);
    } else {
        lobby.show();
    }

    /* ── 5. Status Helper ──────────────────────── */
    function setStatus(msg, type = 'normal', icon = '🤖') {
        statusBar.className = 'status-bar' + (type !== 'normal' ? ` ${type}` : '');
        if (statusIcon) statusIcon.textContent = icon;
        if (statusMsg)  statusMsg.textContent  = msg;
    }

    /* ── 6. Modal Manager ──────────────────────── */
    const MODALS = ['modal-intro', 'modal-victory', 'modal-defeat', 'modal-map', 'modal-qr'];

    function openModal(id) {
        MODALS.forEach(m => $( m)?.classList.remove('active'));
        $(id)?.classList.add('active');
    }

    function closeAllModals() {
        MODALS.forEach(m => $(m)?.classList.remove('active'));
    }

    // Close buttons (class-based)
    document.querySelectorAll('.js-close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Click outside modal sheet to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeAllModals();
        });
    });

    /* ── 7. Level Briefing (Intro Modal) ─────────── */
    function showIntro(lvl) {
        const b = lvl.introBriefing || {};
        $('intro-icon').textContent   = lvl.conceptIcon || '🧩';
        $('intro-title').textContent  = lvl.conceptTitle || lvl.name;
        $('intro-module').textContent = `${lvl.moduleName || ''} · Level ${lvl.id}`;
        $('intro-body').textContent   = b.explanation || lvl.hint;

        // Indikator Bintang
        const starsBadge = $('intro-stars-badge');
        if (starsBadge) {
            starsBadge.className = 'intro-stars-badge master-solution';
            starsBadge.innerHTML = `
                <div class="stars-icon-row">⭐⭐⭐</div>
                <div class="stars-badge-text">
                    <strong>Target 3 Bintang</strong>
                    <p>Selesaikan misi dengan susunan balok paling efisien untuk rekor optimal.</p>
                </div>
            `;
        }

        const analogyEl = $('intro-analogy');
        if (b.realLifeAnalogy) {
            analogyEl.style.display = '';
            analogyEl.textContent = b.realLifeAnalogy;
        } else {
            analogyEl.style.display = 'none';
        }

        const unlockEl = $('intro-unlock');
        if (b.newUnlock) {
            unlockEl.style.display = '';
            $('intro-unlock-icon').textContent  = b.newUnlock.icon || '✨';
            $('intro-unlock-title').textContent = `Baru: ${b.newUnlock.label}`;
            $('intro-unlock-desc').textContent  = b.newUnlock.desc || '';
        } else {
            unlockEl.style.display = 'none';
        }

        openModal('modal-intro');
    }

    /* ── 8. Start Level ──────────────────────────── */
    function startLevel(lvl) {
        hudTag.textContent   = `Level ${lvl.id} · ${lvl.moduleName}`;
        hudTitle.textContent = lvl.name;
        hudScore.textContent = `⭐ ${gameState.getTotalStars()}/${gameState.getMaxStars()}`;
        arenaHint.innerHTML  = `🎯 ${lvl.hint}`;

        if (conceptName) conceptName.textContent = lvl.conceptTitle;

        canvas.resize();
        canvas.setMap(lvl.map);
        canvas.setCameraPreset('iso');

        // Sequence reset
        if (lvl.initialSequence?.length > 0) {
            mainSeq = JSON.parse(JSON.stringify(lvl.initialSequence));
            setStatus('Mode Debug: temukan balok yang keliru!', 'running', '🐞');
        } else {
            mainSeq = [];
            setStatus('Siap — pasang balok lalu tekan Jalankan.', 'normal', '🤖');
        }

        f1Seq       = [];
        inputTarget = 'main';
        stepIdx     = 0;

        if (f1Deck) f1Deck.style.display = lvl.hasFunctionBox ? 'flex' : 'none';

        renderPalette(lvl);
        renderSlots();
    }

    function loadLevelWithIntro(idx) {
        const lvl = gameState.setLevel(idx);
        if (lvl) showIntro(lvl);
    }

    /* ── Helper Penghitung Jumlah Balok Total (Termasuk Isi Apitan) ── */
    function countTotalBlocks(seq) {
        if (!Array.isArray(seq)) return 0;
        let count = 0;
        seq.forEach(item => {
            count++; // Blok itu sendiri (atau kontainer)
            if (typeof item === 'object' && item !== null) {
                if (item.type === 'loop' && Array.isArray(item.body)) {
                    count += countTotalBlocks(item.body);
                } else if (item.type === 'if_else') {
                    if (Array.isArray(item.ifBody)) count += countTotalBlocks(item.ifBody);
                    if (Array.isArray(item.elseBody)) count += countTotalBlocks(item.elseBody);
                }
            }
        });
        return count;
    }

    let activeInsertTarget = { type: 'main' }; // { type: 'main' | 'f1' | 'loop' | 'if_branch' | 'else_branch', index, deck }

    /* ── 9. Palette Render (Kumulatif: Balok Tak Pernah Hilang) ── */
    function renderPalette(lvl) {
        const cumulativeAllowed = [];
        for (let l = 0; l <= gameState.currentLevelIndex; l++) {
            const u = gameState.levels[l]?.unlockedCommands || [];
            u.forEach(cmd => { if (!cumulativeAllowed.includes(cmd)) cumulativeAllowed.push(cmd); });
        }
        if (lvl.unlockedCommands) {
            lvl.unlockedCommands.forEach(cmd => { if (!cumulativeAllowed.includes(cmd)) cumulativeAllowed.push(cmd); });
        }

        const allowedDefs = [];
        const seenIds = new Set();
        (cumulativeAllowed.length > 0 ? cumulativeAllowed : ['FORWARD', 'ACTIVATE']).forEach(rawId => {
            if (rawId === 'LOOP_END') return; // Pastikan LOOP_END tidak pernah muncul
            const def = window.COMMAND_DEFINITIONS[rawId];
            if (def && !seenIds.has(def.id)) {
                seenIds.add(def.id);
                allowedDefs.push(def);
            }
        });

        paletteContainer.innerHTML = allowedDefs.map(def => {
            const isNew = (
                lvl.introBriefing?.newUnlock?.label?.includes(def.label)
            );
            return `
                <button type="button" class="btn-block" data-id="${def.id}" title="${def.desc}">
                    ${isNew ? '<span class="badge-new">Baru</span>' : ''}
                    <span class="block-icon">${def.icon}</span>
                    <span class="block-label">${def.label}</span>
                </button>
            `;
        }).join('');

        paletteContainer.querySelectorAll('.btn-block').forEach(btn => {
            btn.addEventListener('click', () => {
                if (interpreter.isExecuting) return;
                const lvl = gameState.getCurrentLevel();
                const id  = btn.dataset.id;
                const def = window.COMMAND_DEFINITIONS[id];
                const curTotal = countTotalBlocks(mainSeq) + countTotalBlocks(f1Seq);

                if (curTotal >= lvl.maxBlocks && !['LOOP', 'IF_ELSE'].includes(id)) {
                    audio.playError();
                    setStatus(`Slot penuh! Maks. ${lvl.maxBlocks} balok untuk level ini.`, 'error', '⚠️');
                    return;
                }

                // 1. Tambah Balok Penjepit LOOP
                if (id === 'LOOP' || id === 'LOOP_START') {
                    audio.playSnap();
                    const newLoop = { type: 'loop', count: null, body: [] };
                    if (inputTarget === 'f1') {
                        f1Seq.push(newLoop);
                        activeInsertTarget = { type: 'loop', index: f1Seq.length - 1, deck: 'f1' };
                    } else {
                        mainSeq.push(newLoop);
                        activeInsertTarget = { type: 'loop', index: mainSeq.length - 1, deck: 'main' };
                    }
                    renderSlots();
                    setStatus('🔁 Balok ULANGI dipasang! Atur angka X (+/-) dan klik balok di palet untuk memasukkan ke dalam loop.', 'normal', '🔁');
                    return;
                }

                // 2. Tambah Balok Penjepit IF-ELSE (JIKA - LAINNYA)
                if (id === 'IF_ELSE' || id === 'IF_ELSE_MYSTERY') {
                    audio.playSnap();
                    const newIfElse = { type: 'if_else', ifBody: [], elseBody: [] };
                    if (inputTarget === 'f1') {
                        f1Seq.push(newIfElse);
                        activeInsertTarget = { type: 'if_branch', index: f1Seq.length - 1, deck: 'f1' };
                    } else {
                        mainSeq.push(newIfElse);
                        activeInsertTarget = { type: 'if_branch', index: mainSeq.length - 1, deck: 'main' };
                    }
                    renderSlots();
                    setStatus('🔀 Balok JIKA-LAINNYA dipasang! Pilih aksi untuk JIKA ada Jurang (misal: LOMPAT)...', 'normal', '🔀');
                    return;
                }

                // 3. Perintah Gerak / Aksi Reguler
                const targetDeck = (activeInsertTarget.deck === 'f1' || inputTarget === 'f1') ? f1Seq : mainSeq;
                const targetDeckName = (activeInsertTarget.deck === 'f1' || inputTarget === 'f1') ? 'f1' : 'main';

                if (activeInsertTarget.type === 'loop') {
                    const loopObj = targetDeck[activeInsertTarget.index];
                    if (loopObj && loopObj.type === 'loop') {
                        audio.playSnap();
                        loopObj.body.push(id);
                        renderSlots();
                        setStatus(`[${def.label}] dimasukkan ke dalam Loop.`, 'normal', '➕');
                        return;
                    }
                } else if (activeInsertTarget.type === 'if_branch') {
                    const ifElseObj = targetDeck[activeInsertTarget.index];
                    if (ifElseObj && ifElseObj.type === 'if_else') {
                        audio.playSnap();
                        ifElseObj.ifBody.push(id);
                        // Otomatis arahkan ke cabang LAINNYA
                        activeInsertTarget = { type: 'else_branch', index: activeInsertTarget.index, deck: targetDeckName };
                        renderSlots();
                        setStatus(`Bagus! Sekarang pilih aksi untuk cabang LAINNYA jika ada Laser (misal: TUNDUK)...`, 'normal', '🔀');
                        return;
                    }
                } else if (activeInsertTarget.type === 'else_branch') {
                    const ifElseObj = targetDeck[activeInsertTarget.index];
                    if (ifElseObj && ifElseObj.type === 'if_else') {
                        audio.playSnap();
                        ifElseObj.elseBody.push(id);
                        // Otomatis kembalikan target ke deck utama
                        activeInsertTarget = { type: targetDeckName };
                        renderSlots();
                        setStatus(`✨ Percabangan JIKA-LAINNYA selesai dirangkai!`, 'normal', '✅');
                        return;
                    }
                }

                // Default: Tambahkan ke deck luar
                if (inputTarget === 'f1') {
                    const maxF1 = lvl.maxFunctionBlocks || 3;
                    if (f1Seq.length < maxF1) {
                        audio.playSnap();
                        f1Seq.push(id);
                        renderSlots();
                        setStatus(`Fungsi F1: [${def.label}] ditambahkan.`, 'normal', '📦');
                    } else {
                        audio.playError();
                        setStatus(`Fungsi F1 penuh! Maks. ${maxF1} balok.`, 'error', '⚠️');
                    }
                } else {
                    audio.playSnap();
                    mainSeq.push(id);
                    renderSlots();
                    setStatus(`[${def.label}] ditambahkan.`, 'normal', '➕');
                }
            });
        });
    }

    /* ── 10. Slots Render (Visual Penjepit C-Clamp & E-Clamp Code.org) ── */
    function renderSlots(activeStepPath = '', activeDeck = 'main') {
        const lvl = gameState.getCurrentLevel();
        if (!lvl) return;

        const totalUsed = countTotalBlocks(mainSeq);
        mainCounter.textContent = `${totalUsed}/${lvl.maxBlocks}`;

        // Helper render blok tunggal atau blok kontainer
        function renderBlockHtml(item, path, deckName) {
            const isExec = (activeDeck === deckName && activeStepPath === path);

            // A. Perintah Tunggal
            if (typeof item === 'string') {
                const def = window.COMMAND_DEFINITIONS[item] || { label: item, icon: '⚡' };
                return `
                    <div class="slot filled${isExec ? ' executing' : ''}" data-path="${path}" data-deck="${deckName}">
                        <span>${def.icon}</span>
                        <span>${def.label}</span>
                    </div>
                `;
            }

            // B. Balok Penjepit LOOP (C-Clamp)
            if (item.type === 'loop') {
                const isTarget = (activeInsertTarget.type === 'loop' && String(activeInsertTarget.index) === path && activeInsertTarget.deck === deckName);
                const isSet = (typeof item.count === 'number' && item.count > 0);
                const countHtml = isSet
                    ? `<span class="clamp-count-val">${item.count}x</span>`
                    : `<span class="clamp-count-val unconfigured" style="color:#f59e0b;font-weight:900;border:1px dashed #f59e0b;padding:1px 6px;border-radius:4px;background:rgba(245,158,11,0.18);" title="Tentukan jumlah putaran X dengan tombol [+] atau [-]">?x</span>`;
                const innerHtml = (item.body || []).map((sub, b) =>
                    renderBlockHtml(sub, `${path}.body.${b}`, deckName)
                ).join('');

                return `
                    <div class="block-clamp block-loop" data-path="${path}" data-deck="${deckName}">
                        <div class="clamp-header">
                            <span class="clamp-tag">🔁 ULANGI</span>
                            <div class="clamp-stepper">
                                <button type="button" class="btn-clamp-count minus" data-path="${path}" data-deck="${deckName}">-</button>
                                ${countHtml}
                                <button type="button" class="btn-clamp-count plus" data-path="${path}" data-deck="${deckName}">+</button>
                            </div>
                            <span class="clamp-sub">KALI:</span>
                            ${isTarget ? `<button type="button" class="btn-clamp-exit" data-deck="${deckName}" title="Selesai mengisi loop">✓ Selesai Loop</button>` : ''}
                            <button type="button" class="btn-clamp-del" data-path="${path}" data-deck="${deckName}" title="Hapus Balok Ulangi">✕</button>
                        </div>
                        <div class="clamp-body${isTarget ? ' active-target' : ''}" data-target-type="loop" data-path="${path}" data-deck="${deckName}">
                            ${innerHtml}
                            <div class="slot empty-drop" data-target-type="loop" data-path="${path}" data-deck="${deckName}">+ Balok Loop</div>
                        </div>
                    </div>
                `;
            }

            // C. Balok Penjepit IF-ELSE (E-Clamp)
            if (item.type === 'if_else') {
                const isIfTarget = (activeInsertTarget.type === 'if_branch' && String(activeInsertTarget.index) === path && activeInsertTarget.deck === deckName);
                const isElseTarget = (activeInsertTarget.type === 'else_branch' && String(activeInsertTarget.index) === path && activeInsertTarget.deck === deckName);

                const ifHtml = (item.ifBody || []).map((sub, b) =>
                    renderBlockHtml(sub, `${path}.if.${b}`, deckName)
                ).join('');

                const elseHtml = (item.elseBody || []).map((sub, b) =>
                    renderBlockHtml(sub, `${path}.else.${b}`, deckName)
                ).join('');

                return `
                    <div class="block-clamp block-ifelse" data-path="${path}" data-deck="${deckName}">
                        <!-- CABANG JIKA -->
                        <div class="clamp-header if-header">
                            <span class="clamp-tag">🔀 JIKA ada Jurang di depan:</span>
                            <button type="button" class="btn-clamp-del" data-path="${path}" data-deck="${deckName}" title="Hapus Balok Jika-Lainnya">✕</button>
                        </div>
                        <div class="clamp-body if-body${isIfTarget ? ' active-target' : ''}" data-target-type="if_branch" data-path="${path}" data-deck="${deckName}">
                            ${ifHtml}
                            ${(item.ifBody || []).length === 0 ? `<div class="slot empty-drop" data-target-type="if_branch" data-path="${path}" data-deck="${deckName}">+ Aksi Jurang</div>` : ''}
                        </div>

                        <!-- CABANG LAINNYA -->
                        <div class="clamp-header else-header">
                            <span class="clamp-tag">↳ LAINNYA (jika ada Laser):</span>
                        </div>
                        <div class="clamp-body else-body${isElseTarget ? ' active-target' : ''}" data-target-type="else_branch" data-path="${path}" data-deck="${deckName}">
                            ${elseHtml}
                            ${(item.elseBody || []).length === 0 ? `<div class="slot empty-drop" data-target-type="else_branch" data-path="${path}" data-deck="${deckName}">+ Aksi Laser</div>` : ''}
                        </div>
                    </div>
                `;
            }

            return '';
        }

        // Render main deck
        let mainHtml = mainSeq.map((item, i) => renderBlockHtml(item, `${i}`, 'main')).join('');
        if (mainSeq.length === 0) {
            mainHtml = `<div class="slot empty" style="width:100%;"><span style="opacity:0.5;">[ Pasang balok perintah dari palet di atas ]</span></div>`;
        } else if (totalUsed < lvl.maxBlocks) {
            const isMainTarget = (activeInsertTarget.type === 'main');
            mainHtml += `<div class="slot empty-drop-outer${isMainTarget ? ' active-target' : ''}" data-target-deck="main" title="Klik untuk menambah balok berikutnya di luar penjepit">+ Balok Berikutnya</div>`;
        }
        mainSlots.innerHTML = mainHtml;

        // Render F1 deck
        if (lvl.hasFunctionBox && f1Slots) {
            const maxF1 = lvl.maxFunctionBlocks || 3;
            const f1Count = countTotalBlocks(f1Seq);
            f1Counter.textContent = `${f1Count}/${maxF1}`;
            let f1Html = f1Seq.map((item, f) => renderBlockHtml(item, `${f}`, 'f1')).join('');
            if (f1Seq.length === 0) {
                f1Html = `<div class="slot empty" style="width:100%;"><span style="opacity:0.5;">[ Kotak F1 masih kosong ]</span></div>`;
            } else if (f1Count < maxF1) {
                const isF1Target = (activeInsertTarget.type === 'f1');
                f1Html += `<div class="slot empty-drop-outer${isF1Target ? ' active-target' : ''}" data-target-deck="f1" title="Klik untuk menambah balok di Kotak F1">+ Balok F1</div>`;
            }
            f1Slots.innerHTML = f1Html;
        }

        // ── Pasang Event Handler Klik UI ──

        // Tombol Selesai Loop
        document.querySelectorAll('.btn-clamp-exit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (interpreter.isExecuting) return;
                const deck = btn.dataset.deck;
                activeInsertTarget = { type: deck };
                audio.playClick();
                renderSlots();
                setStatus('Selesai mengisi loop. Sekarang balok berikutnya akan dipasang di luar loop.', 'normal', '✅');
            });
        });

        // Dropzone Balok Luar
        document.querySelectorAll('.slot.empty-drop-outer').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (interpreter.isExecuting) return;
                const deck = el.dataset.targetDeck;
                inputTarget = deck;
                activeInsertTarget = { type: deck };
                audio.playClick();
                renderSlots();
                setStatus(`Target aktif: ${deck === 'f1' ? 'Kotak Fungsi F1' : 'Program Utama'} (di luar penjepit)`, 'normal', '🧩');
            });
        });

        // 1. Tombol Hapus Clamp (✕)
        document.querySelectorAll('.btn-clamp-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (interpreter.isExecuting) return;
                const path = btn.dataset.path;
                const deck = btn.dataset.deck;
                const targetArr = deck === 'f1' ? f1Seq : mainSeq;
                const idx = parseInt(path, 10);
                audio.playTrash();
                targetArr.splice(idx, 1);
                activeInsertTarget = { type: deck };
                renderSlots();
                setStatus('Balok dihapus.', 'normal', '🗑️');
            });
        });

        // 2. Tombol Stepper [-] dan [+] pada Loop
        document.querySelectorAll('.btn-clamp-count').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (interpreter.isExecuting) return;
                const path = btn.dataset.path;
                const deck = btn.dataset.deck;
                const targetArr = deck === 'f1' ? f1Seq : mainSeq;
                const idx = parseInt(path, 10);
                const loopObj = targetArr[idx];
                if (loopObj && loopObj.type === 'loop') {
                    const isPlus = btn.classList.contains('plus');
                    let c = loopObj.count;
                    if (typeof c !== 'number' || c <= 0) {
                        c = isPlus ? 2 : 1;
                    } else {
                        c = isPlus ? Math.min(8, c + 1) : Math.max(1, c - 1);
                    }
                    loopObj.count = c;
                    audio.playClick();
                    renderSlots();
                    setStatus(`Jumlah perulangan diatur ke ${c}x`, 'normal', '🔁');
                }
            });
        });

        // 3. Klik Dropzone / Body untuk Memilih Target Masuk
        document.querySelectorAll('.clamp-body, .slot.empty-drop').forEach(el => {
            el.addEventListener('click', (e) => {
                if (interpreter.isExecuting) return;
                e.stopPropagation();
                const type = el.dataset.targetType;
                const path = el.dataset.path;
                const deck = el.dataset.deck;
                const idx = parseInt(path, 10);
                activeInsertTarget = { type, index: idx, deck };
                audio.playClick();
                renderSlots();
                if (type === 'loop') setStatus('Target aktif: Masukkan balok ke dalam balok ULANGI.', 'normal', '🔁');
                else if (type === 'if_branch') setStatus('Target aktif: Masukkan aksi untuk JIKA ada Jurang.', 'normal', '🔀');
                else if (type === 'else_branch') setStatus('Target aktif: Masukkan aksi untuk LAINNYA jika ada Laser.', 'normal', '🔀');
            });
        });

        // 4. Klik Balok Terisi untuk Menghapus Balok Tunggal
        document.querySelectorAll('.slot.filled').forEach(slot => {
            slot.addEventListener('click', (e) => {
                if (interpreter.isExecuting) return;
                e.stopPropagation();
                const path = slot.dataset.path;
                const deck = slot.dataset.deck;
                const targetArr = deck === 'f1' ? f1Seq : mainSeq;

                audio.playTrash();
                const parts = path.split('.');
                if (parts.length === 1) {
                    // Balok luar
                    targetArr.splice(parseInt(parts[0], 10), 1);
                } else if (parts.length === 3) {
                    // Balok dalam: e.g. "1.body.0" atau "2.if.0"
                    const parentIdx = parseInt(parts[0], 10);
                    const prop = parts[1]; // 'body', 'if' (ifBody), 'else' (elseBody)
                    const childIdx = parseInt(parts[2], 10);
                    const parentObj = targetArr[parentIdx];
                    if (parentObj) {
                        if (prop === 'body') parentObj.body.splice(childIdx, 1);
                        else if (prop === 'if') parentObj.ifBody.splice(childIdx, 1);
                        else if (prop === 'else') parentObj.elseBody.splice(childIdx, 1);
                    }
                }
                renderSlots();
                setStatus('Balok dihapus.', 'normal', '🗑️');
            });
        });
    }

    /* ── 11. Toggle Input Target (Main vs F1) ──── */
    if (f1Deck) {
        f1Deck.addEventListener('click', e => {
            if (e.target.closest('.slot.filled') || e.target.closest('.btn-clamp-del')) return;
            inputTarget = 'f1';
            activeInsertTarget = { type: 'f1' };
            f1Deck.style.borderColor  = 'rgba(168, 85, 247, 0.7)';
            setStatus('Mengisi Fungsi F1...', 'normal', '📦');
            renderSlots();
        });
    }
    mainSlots?.parentElement?.addEventListener('click', e => {
        if (e.target.closest('.slot.filled') || e.target.closest('.btn-clamp-del') || e.target.closest('.clamp-body')) return;
        inputTarget = 'main';
        activeInsertTarget = { type: 'main' };
        if (f1Deck) f1Deck.style.borderColor = 'rgba(168, 85, 247, 0.3)';
        setStatus('Mengisi Program Utama...', 'normal', '🧩');
        renderSlots();
    });

    /* ── 12. Run / Step / Clear ─────────────────── */
    function hasUnconfiguredLoop(seq) {
        if (!Array.isArray(seq)) return false;
        for (const item of seq) {
            if (item && item.type === 'loop') {
                if (typeof item.count !== 'number' || item.count <= 0) return true;
                if (hasUnconfiguredLoop(item.body || [])) return true;
            }
        }
        return false;
    }

    btnRun.addEventListener('click', async () => {
        if (interpreter.isExecuting) return;
        if (mainSeq.length === 0) {
            audio.playError();
            setStatus('Pasang minimal satu balok dulu!', 'error', '⚠️');
            return;
        }

        if (hasUnconfiguredLoop(mainSeq) || hasUnconfiguredLoop(f1Seq)) {
            audio.playError();
            setStatus('⚠️ Tentukan angka perulangan X (+/-) pada balok ULANGI terlebih dahulu!', 'error', '⚠️');
            return;
        }

        btnRun.disabled  = true;
        btnStep.disabled = true;

        const lvl = gameState.getCurrentLevel();
        canvas.setMap(lvl.map);
        setStatus('Menjalankan...', 'running', '🚀');

        await interpreter.runProgram(mainSeq, f1Seq, {
            onStepActive: (path, deck) => renderSlots(path, deck),
            onLog: (msg, type) => setStatus(msg, type),
            onComplete: res => {
                btnRun.disabled  = false;
                btnStep.disabled = false;
                renderSlots();
                if (res.success && res.finished) {
                    evaluateVictory(lvl);
                } else if (!res.success) {
                    audio.playError();
                    const reason = res.reason || 'Robot melangkah ke petak kosong tanpa lantai!';
                    setStatus(reason, 'error', '❌');
                    showDefeatModal(reason, 'fall');
                }
            }
        });
    });

    // Helper membuat jejak langkah debug untuk eksekusi per langkah (btnStep)
    function buildDebugTrace(seq, pathPrefix = '') {
        const trace = [];
        seq.forEach((item, i) => {
            const p = pathPrefix ? `${pathPrefix}.${i}` : `${i}`;
            if (typeof item === 'string') {
                trace.push({ item, path: p });
            } else if (item.type === 'loop') {
                const count = item.count || 2;
                for (let r = 0; r < count; r++) {
                    (item.body || []).forEach((sub, b) => {
                        trace.push({ item: sub, path: `${p}.body.${b}` });
                    });
                }
            } else if (item.type === 'if_else') {
                trace.push({ item, path: p, isIfElse: true });
            }
        });
        return trace;
    }

    let debugTrace = [];
    btnStep.addEventListener('click', async () => {
        if (interpreter.isExecuting || mainSeq.length === 0) return;
        if (hasUnconfiguredLoop(mainSeq) || hasUnconfiguredLoop(f1Seq)) {
            audio.playError();
            setStatus('⚠️ Tentukan angka perulangan X (+/-) pada balok ULANGI terlebih dahulu!', 'error', '⚠️');
            return;
        }
        const lvl = gameState.getCurrentLevel();

        if (stepIdx === 0 || stepIdx >= debugTrace.length) {
            stepIdx = 0;
            canvas.setMap(lvl.map);
            debugTrace = buildDebugTrace(mainSeq);
        }

        if (stepIdx < debugTrace.length) {
            const step = debugTrace[stepIdx];
            renderSlots(step.path, 'main');
            const def = (typeof step.item === 'string') ? (window.COMMAND_DEFINITIONS[step.item] || { label: step.item }) : { label: 'JIKA-LAINNYA' };
            setStatus(`Debug: langkah ${stepIdx + 1} — ${def.label}`, 'running', '⏭️');

            const res = await interpreter.executeBlockItem(step.item, f1Seq, {
                onStepActive: (p) => renderSlots(p, 'main'),
                onLog: (m, t) => setStatus(m, t)
            }, step.path);

            stepIdx++;

            if (!res.success) {
                audio.playError();
                const reason = res.reason || 'Robot melangkah ke petak kosong tanpa lantai!';
                setStatus(reason, 'error', '❌');
                stepIdx = 0;
                renderSlots();
                showDefeatModal(reason, 'fall');
                return;
            }

            if (stepIdx >= debugTrace.length) {
                renderSlots();
                evaluateVictory(lvl);
            }
        }
    });

    btnClear.addEventListener('click', () => {
        if (interpreter.isExecuting) return;
        audio.playTrash();
        mainSeq = []; f1Seq = []; stepIdx = 0;
        activeInsertTarget = { type: 'main' };
        const lvl = gameState.getCurrentLevel();
        canvas.setMap(lvl.map);
        renderSlots();
        setStatus('Semua balok dihapus.', 'normal', '🧹');
    });

    /* ── 13. Speed Toggle ──────────────────────── */
    btnSpeed.addEventListener('click', () => {
        playSpeed = playSpeed === 1 ? 2 : 1;
        btnSpeed.textContent = `${playSpeed}×`;
        canvas.setSpeed(playSpeed);
        audio.playClick();
        setStatus(`Kecepatan: ${playSpeed}×`, 'normal', '⚡');
    });

    /* ── 14. Sound Toggle ──────────────────────── */
    $('btn-sound').addEventListener('click', () => {
        const muted = audio.toggleMute();
        $('btn-sound').textContent = muted ? '🔇' : '🔊';
    });

    /* ── 15. Info / Materi ─────────────────────── */
    $('btn-info').addEventListener('click', () => {
        audio.playClick();
        showIntro(gameState.getCurrentLevel());
    });

    $('concept-chip')?.addEventListener('click', () => {
        audio.playClick();
        showIntro(gameState.getCurrentLevel());
    });

    /* ── 16. Kamera 3D ─────────────────────────── */
    function setCamUI(name) {
        ['btn-cam-iso','btn-cam-top','btn-cam-side'].forEach(id => {
            $(id)?.classList.toggle('active', $(id)?.id === `btn-cam-${name}`);
        });
    }

    $('btn-cam-iso')?.addEventListener('click', () => {
        audio.playClick();
        canvas.setCameraPreset('iso');
        setCamUI('iso');
    });
    $('btn-cam-top')?.addEventListener('click', () => {
        audio.playClick();
        canvas.setCameraPreset('top');
        setCamUI('top');
    });
    $('btn-cam-side')?.addEventListener('click', () => {
        audio.playClick();
        canvas.setCameraPreset('side');
        setCamUI('side');
    });
    $('btn-cam-reset')?.addEventListener('click', () => {
        audio.playClick();
        canvas.setCameraPreset('iso');
        setCamUI('iso');
    });

    // Sync active class when user drags (camera fires setActivePresetUI)
    // Override to use our new class names
    canvas.setActivePresetUI = (name) => setCamUI(name);

    /* ── 17. Peta Level ────────────────────────── */
    $('btn-map')?.addEventListener('click', () => {
        audio.playClick();
        renderLevelGrid();
        openModal('modal-map');
    });

    function renderLevelGrid() {
        const grid = $('level-grid');
        if (!grid) return;
        grid.innerHTML = gameState.levels.map((lvl, i) => {
            const isDone = gameState.isLevelCompleted(i);
            const s      = gameState.starsEarned[i] || 0;
            const cur    = i === gameState.currentLevelIndex;

            let badgeHtml = '—';
            if (isDone) {
                badgeHtml = '⭐'.repeat(Math.max(1, s));
            }

            return `
                <div class="level-grid-card${cur ? ' active' : ''}" data-idx="${i}">
                    <span class="lgc-num">Level ${lvl.id}</span>
                    <span class="lgc-name">${lvl.name}</span>
                    <span class="lgc-stars">${badgeHtml}</span>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.level-grid-card').forEach(card => {
            card.addEventListener('click', () => {
                audio.playClick();
                closeAllModals();
                loadLevelWithIntro(parseInt(card.dataset.idx, 10));
            });
        });
    }

    // Handler Reset Semua Bintang (Modal Peta Level & HUD Bar)
    function performReset() {
        if (confirm('Yakin ingin mereset semua bintang dan progres ke 0?\nSemua riwayat penyelesaian level akan dibersihkan agar fresh saat di sekolah.')) {
            audio.playClick();
            gameState.resetProgress();
            renderLevelGrid();
            if (hudScore) hudScore.textContent = `⭐ 0/${gameState.getMaxStars()}`;
            setStatus('Semua bintang berhasil di-reset ke 0!', 'normal', '🔄');
            if (lobby && typeof lobby.render === 'function') lobby.render();
        }
    }

    $('btn-reset-stars')?.addEventListener('click', performReset);
    $('btn-hud-reset-stars')?.addEventListener('click', performReset);

    /* ── 18. Start Mission (dari modal intro) ─── */
    $('btn-start-level')?.addEventListener('click', () => {
        audio.playClick();
        ensureBgm();
        closeAllModals();
        startLevel(gameState.getCurrentLevel());
    });

    /* ── 19. Victory ───────────────────────────── */
    function evaluateVictory(lvl) {
        const remaining = canvas.mapData?.tiles?.filter(t => t.hasTarget && !t.collected) ?? [];

        if (remaining.length === 0) {
            audio.playVictory();

            let stars = 1;
            let noteHtml = '';
            const max = lvl.maxStars || 1;
            const totalBlocks = countTotalBlocks(mainSeq);

            if (max === 1) {
                // Tepat 1 Solusi (Jalur Tunggal) -> Pasti 1 Bintang
                stars = 1;
                noteHtml = `✨ <strong>Hebat! (⭐ 1 Bintang)</strong> Kamu berhasil menyelesaikan misi dengan <strong>tepat ${totalBlocks} balok</strong>!`;
            } else if (max === 2) {
                // Dua Solusi (Jalur Ganda) -> Solusi Cerdas = 2 Bintang, Solusi Standar = 1 Bintang
                const threshold = lvl.star2Blocks || lvl.optimalBlocks || 3;
                if (totalBlocks <= threshold) {
                    stars = 2;
                    noteHtml = `🚀 <strong>Luar Biasa! (⭐⭐ 2 Bintang)</strong> Kamu berhasil menemukan Solusi Cerdas (<strong>tepat ${totalBlocks} balok</strong>)!`;
                } else {
                    stars = 1;
                    const targetStr = lvl.star2Blocks ? `tepat ${lvl.star2Blocks} balok` : 'lebih hemat balok';
                    noteHtml = `👍 <strong>Bagus! (⭐ 1 Bintang)</strong> Kamu menyelesaikan dengan Solusi Standar (<strong>tepat ${totalBlocks} balok</strong>). Coba gunakan Solusi Cerdas (${targetStr}) untuk meraih 2 Bintang!`;
                }
            } else if (max >= 3) {
                // Tiga Solusi (3 Bintang) -> Master = 3 Bintang, Cerdas = 2 Bintang, Standar = 1 Bintang
                const s3 = lvl.star3Blocks || lvl.optimalBlocks || 3;
                const s2 = lvl.star2Blocks || (s3 + 2);
                if (totalBlocks <= s3) {
                    stars = 3;
                    noteHtml = `👑 <strong>SEMPURNA! (⭐⭐⭐ 3 Bintang Penuh)</strong> Kamu berhasil menemukan Solusi Master (<strong>tepat ${totalBlocks} balok</strong>)!`;
                } else if (totalBlocks <= s2) {
                    stars = 2;
                    noteHtml = `🚀 <strong>Luar Biasa! (⭐⭐ 2 Bintang)</strong> Kamu menemukan Solusi Cerdas (<strong>tepat ${totalBlocks} balok</strong>)! Bisakah kamu memecahkan rekor dengan Solusi Master (tepat ${s3} balok) untuk meraih 3 Bintang Penuh?`;
                } else {
                    stars = 1;
                    noteHtml = `👍 <strong>Bagus! (⭐ 1 Bintang)</strong> Misi selesai dengan Solusi Standar (<strong>tepat ${totalBlocks} balok</strong>). Coba cari strategi lebih hemat untuk meraih bintang lebih tinggi!`;
                }
            }

            gameState.markCompleted(stars);

            hudScore.textContent = `⭐ ${gameState.getTotalStars()}/${gameState.getMaxStars()}`;
            setStatus('Misi berhasil!', 'success', '🎉');

            if (window.confetti) {
                window.confetti({ particleCount: 100, spread: 75, origin: { y: 0.65 } });
            }

            const starWord = stars === 3 ? 'Master Sempurna! ⭐⭐⭐' : (stars === 2 ? 'Luar Biasa! ⭐⭐' : 'Selesai! ⭐');
            $('victory-title').textContent = `${lvl.name} — ${starWord}`;

            // Tampilkan bintang sesuai maxStars (1 atau 2 bintang)
            $('victory-stars').innerHTML = Array.from({ length: max }, () =>
                `<span class="victory-star">⭐</span>`
            ).join('');

            const starEls = document.querySelectorAll('#victory-stars .victory-star');
            starEls.forEach((el, i) => {
                el.classList.remove('lit');
                if (i < stars) {
                    setTimeout(() => el.classList.add('lit'), 200 + i * 200);
                }
            });

            $('victory-takeaway').innerHTML = `
                <p style="margin-bottom:8px;">${lvl.introBriefing?.explanation || ''}</p>
                <div style="font-size:0.92rem;color:#38bdf8;border-top:1px solid #1e3557;padding-top:8px;">
                    ${noteHtml}
                </div>
            `;

            setTimeout(() => openModal('modal-victory'), 500);
        } else {
            audio.playError();
            const reason = remaining.length === 1
                ? 'Ada 1 kristal energi yang terlewat / belum diambil!'
                : `Masih ada ${remaining.length} kristal energi yang tertinggal di arena!`;
            setStatus(reason, 'error', '⚠️');
            showDefeatModal(reason, 'crystal');
        }
    }

    /* ── 20. Defeat Modal & Handlers ────────────── */
    function showDefeatModal(reasonText, type = 'fall') {
        const defeatTitle = $('defeat-title');
        const defeatSubtitle = $('defeat-subtitle');
        const defeatReason = $('defeat-reason');
        const defeatIcon = $('defeat-icon');

        if (type === 'crystal') {
            if (defeatIcon) defeatIcon.textContent = '💎⚠️';
            if (defeatTitle) defeatTitle.textContent = 'Kristal Belum Lengkap!';
            if (defeatSubtitle) defeatSubtitle.textContent = 'Semua kristal harus diambil untuk menang';
            if (defeatReason) {
                defeatReason.innerHTML = `
                    <div style="font-weight:700;font-size:1.05rem;color:#fca5a5;margin-bottom:6px;">
                        ⚠️ Misi Belum Selesai:
                    </div>
                    <div>${reasonText}</div>
                    <div style="margin-top:10px;font-size:0.92rem;color:#cbd5e1;border-top:1px solid #4c1d33;padding-top:8px;">
                        💡 Robot harus berjalan tepat ke atas setiap kristal lalu mengeksekusi balok <strong>[AMBIL]</strong>!
                    </div>
                `;
            }
        } else {
            if (defeatIcon) defeatIcon.textContent = '💥';
            if (defeatTitle) defeatTitle.textContent = 'Robot Terjatuh!';
            if (defeatSubtitle) defeatSubtitle.textContent = 'Hati-hati dengan tepi arena & rintangan';
            if (defeatReason) {
                defeatReason.innerHTML = `
                    <div style="font-weight:700;font-size:1.05rem;color:#fca5a5;margin-bottom:6px;">
                        ❌ Robot Keluar Jalur:
                    </div>
                    <div>${reasonText || 'Robot melangkah atau melompat ke petak kosong tanpa lantai!'}</div>
                    <div style="margin-top:10px;font-size:0.92rem;color:#cbd5e1;border-top:1px solid #4c1d33;padding-top:8px;">
                        💡 Perhatikan arah hadap panah robot dan hitung jarak langkah sebelum melangkah atau melompat.
                    </div>
                `;
            }
        }

        setTimeout(() => {
            openModal('modal-defeat');
        }, 550);
    }

    $('btn-defeat-retry')?.addEventListener('click', () => {
        audio.playClick();
        closeAllModals();
        const lvl = gameState.getCurrentLevel();
        canvas.setMap(lvl.map);
        stepIdx = 0;
        renderSlots();
        setStatus('Robot kembali ke posisi awal. Periksa balokmu!', 'normal', '🤖');
    });

    $('btn-defeat-clear')?.addEventListener('click', () => {
        audio.playTrash();
        closeAllModals();
        mainSeq = [];
        f1Seq = [];
        stepIdx = 0;
        const lvl = gameState.getCurrentLevel();
        canvas.setMap(lvl.map);
        renderSlots();
        setStatus('Semua balok dihapus. Silakan susun kembali.', 'normal', '🧹');
    });

    $('btn-next-level')?.addEventListener('click', () => {
        audio.playClick();
        closeAllModals();
        const next = gameState.nextLevel();
        if (next.hasNext) {
            loadLevelWithIntro(gameState.currentLevelIndex);
        } else {
            // Selesai semua level — kembali ke lobby
            lobby.show();
        }
    });

    $('btn-replay-level')?.addEventListener('click', () => {
        audio.playClick();
        closeAllModals();
        startLevel(gameState.getCurrentLevel());
    });

    /* ── 20. QR Modal ──────────────────────────── */
    // (No dedicated button in HTML for QR anymore, but kept for completeness)

    /* ── 21. BGM autostart on first interaction ── */
    function ensureBgm() {
        if (!audio.bgmPlaying && !audio.muted) {
            audio.init();
            audio.startBgm();
        }
    }
    document.addEventListener('click',      ensureBgm, { passive: true });
    document.addEventListener('touchstart', ensureBgm, { passive: true });

});
