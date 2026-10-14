/**
 * lobby.js — Layar Lobby ALGO-BOT
 * Menampilkan halaman awal sebelum masuk ke permainan.
 * Bertanggung jawab atas:
 *  - Tampilan progress (bintang & level selesai)
 *  - Grid level selector di lobby
 *  - Tombol "Mulai" dan "Lanjutkan"
 *  - Transisi masuk ke layar game
 */

class LobbyScreen {
    /**
     * @param {Object} gameState   — Instance GameState
     * @param {Function} onEnter  — Callback saat pemain memilih level
     */
    constructor(gameState, onEnter, onSelectDemo = null) {
        this.gameState    = gameState;
        this.onEnter      = onEnter;          // onEnter(levelIndex)
        this.onSelectDemo = onSelectDemo;    // onSelectDemo(demoStageKey)

        this.$lobby       = document.getElementById('screen-lobby');
        this.$game        = document.getElementById('screen-game');
    }

    /** Render dan tampilkan lobby */
    show() {
        if (!this.$lobby) return;
        this.$lobby.classList.remove('hidden');
        if (this.$game) this.$game.classList.add('hidden');
        this.render();
    }

    /** Sembunyikan lobby, tampilkan game */
    hide() {
        if (this.$lobby) this.$lobby.classList.add('hidden');
        if (this.$game) this.$game.classList.remove('hidden');
        window.dispatchEvent(new Event('resize'));
    }

    /** Bangun ulang seluruh konten lobby */
    render() {
        const gs       = this.gameState;
        const levels   = gs.levels;
        const total    = levels.length;
        const done     = levels.filter((_, i) => gs.isLevelCompleted(i)).length;
        const stars    = gs.getTotalStars();
        const maxStars = gs.getMaxStars();
        const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

        // Cari level pertama yang belum selesai (untuk tombol lanjut)
        const continueIdx = Math.min(
            levels.findIndex((_, i) => !gs.isLevelCompleted(i)),
            total - 1
        );
        const safeIdx = continueIdx < 0 ? total - 1 : continueIdx;

        this.$lobby.innerHTML = `
            <div class="lobby-layout">

                <!-- Hero / Brand -->
                <div class="lobby-hero">
                    <div class="lobby-logo-icon">🤖</div>
                    <div class="lobby-brand-name">ALGO-BOT</div>
                    <p class="lobby-brand-sub">Media Visual Interaktif<br>Pengenalan Logika Pemrograman</p>
                </div>

                <!-- Progress summary -->
                <div class="lobby-progress-card">
                    <div class="progress-stat">
                        <span class="progress-stat-value">${stars}</span>
                        <span class="progress-stat-label">Bintang<br>Terkumpul</span>
                    </div>
                    <div class="progress-divider"></div>
                    <div class="progress-stat">
                        <span class="progress-stat-value">${done}</span>
                        <span class="progress-stat-label">Level<br>Selesai</span>
                    </div>
                    <div class="progress-divider"></div>
                    <div class="progress-stat">
                        <span class="progress-stat-value">${total}</span>
                        <span class="progress-stat-label">Total<br>Level</span>
                    </div>
                </div>

                <!-- Tombol Reset Semua Bintang (Fresh untuk Sekolah) -->
                <div style="display:flex;justify-content:center;margin-top:6px;">
                    <button type="button" class="btn-lobby-reset-prominent" id="lobby-btn-reset-prominent" title="Bersihkan semua bintang & progres agar kembali ke 0">
                        🔄 Reset Semua Bintang (Mulai Fresh)
                    </button>
                </div>

                <!-- Progress bar -->
                <div class="progress-bar-wrap" style="margin-top:14px;">
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" id="lobby-progress-fill" style="width:0%"></div>
                    </div>
                    <div class="progress-bar-label">
                        <span>Progress</span>
                        <span>${done}/${total} level · ${stars}/${maxStars} ⭐</span>
                    </div>
                </div>

                <!-- Level grid dengan Panggung Demo Menyatu Sebelum Balok Baru Muncul -->
                <div class="lobby-level-section">
                    <div class="lobby-section-label">🎯 Peta Petualangan & Misi Level (20 Level)</div>
                    <div class="lobby-level-grid" id="lobby-level-grid">
                        ${this.renderUnifiedGrid(levels, safeIdx)}
                    </div>
                </div>

                <!-- CTA -->
                <div class="lobby-cta">
                    <button type="button" class="btn-lobby-primary" id="lobby-btn-continue">
                        ${done === 0 ? '🚀 Mulai Bermain' : `▶ Lanjutkan — Level ${safeIdx + 1}`}
                    </button>
                    ${done > 0 ? `
                    <button type="button" class="btn-lobby-secondary" id="lobby-btn-reset">
                        Mulai dari Awal
                    </button>` : ''}
                </div>

                <!-- Hub Modul Tambahan (Di Bawah & Ringkas) -->
                <div class="lobby-games-hub compact-bottom">
                    <div class="lobby-modules-title">🎮 Modul Spesial Lainnya</div>
                    <div class="lobby-modules-grid">
                        <a href="sortbot.html" class="lobby-module-compact-card sortbot-compact" title="SORT-BOT: Robot Pemilah Sampah (IF-ELSE)">
                            <span class="compact-icon">♻️</span>
                            <div class="compact-info">
                                <span class="compact-title">SORT-BOT</span>
                                <span class="compact-sub">Pemilah Sampah · IF-ELSE</span>
                            </div>
                            <span class="compact-arrow">➔</span>
                        </a>

                        <a href="outfitbot.html" class="lobby-module-compact-card outfitbot-compact" title="OUTFIT-BOT: Robot Lemari Seragam (Fungsi & Parameter)">
                            <span class="compact-icon">👗</span>
                            <div class="compact-info">
                                <span class="compact-title">OUTFIT-BOT</span>
                                <span class="compact-sub">Lemari Baju · Fungsi</span>
                            </div>
                            <span class="compact-arrow">➔</span>
                        </a>

                        <a href="gatebot.html" class="lobby-module-compact-card gatebot-compact" title="GATE-BOT: Gerbang Keamanan Pintar (Operator Logika: AND, OR, NOT)">
                            <span class="compact-icon">🚪</span>
                            <div class="compact-info">
                                <span class="compact-title">GATE-BOT</span>
                                <span class="compact-sub">Gerbang · AND, OR, NOT</span>
                            </div>
                            <span class="compact-arrow">➔</span>
                        </a>

                        <a href="lembar_soal_algobot.html" target="_blank" class="lobby-module-compact-card worksheet-compact" title="Buka Lembar Kerja Soal Cetak A4 untuk Siswa (20 Level)" style="border-color:rgba(56, 189, 248, 0.35);background:rgba(14, 165, 233, 0.08);">
                            <span class="compact-icon">📄</span>
                            <div class="compact-info">
                                <span class="compact-title" style="color:#38bdf8;">Lembar Soal Siswa</span>
                                <span class="compact-sub">Cetak PDF / A4 · 20 Level</span>
                            </div>
                            <span class="compact-arrow">🖨️</span>
                        </a>
                    </div>
                </div>

            </div>
        `;

        // Animate progress bar setelah render
        requestAnimationFrame(() => {
            const fill = document.getElementById('lobby-progress-fill');
            if (fill) fill.style.width = pct + '%';
        });

        // Event: tombol lanjutkan
        document.getElementById('lobby-btn-continue')?.addEventListener('click', () => {
            window.soundSystem?.playClick();
            window.soundSystem?.init();
            window.soundSystem?.startBgm();
            this.onEnter(safeIdx);
        });

        // Event: tombol reset
        const handleReset = () => {
            if (confirm('Yakin ingin mereset semua bintang dan progres ke 0?\nSemua riwayat penyelesaian level akan dibersihkan agar fresh untuk sesi sekolah.')) {
                gs.resetProgress();
                window.soundSystem?.playClick();
                this.render();
            }
        };
        document.getElementById('lobby-btn-reset')?.addEventListener('click', handleReset);
        document.getElementById('lobby-btn-reset-prominent')?.addEventListener('click', handleReset);

        // Event: klik tombol panggung demo di lobby
        this.$lobby.querySelectorAll('.lobby-demo-btn[data-stage]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundSystem?.playClick();
                window.soundSystem?.init();
                window.soundSystem?.startBgm();
                const key = btn.dataset.stage;
                if (typeof this.onSelectDemo === 'function') {
                    this.onSelectDemo(key);
                }
            });
        });

        // Event: klik level di grid
        this.$lobby.querySelectorAll('.lobby-level-btn[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.soundSystem?.playClick();
                window.soundSystem?.init();
                window.soundSystem?.startBgm();
                const idx = parseInt(btn.dataset.idx, 10);
                this.onEnter(idx);
            });
        });
    }

    renderUnifiedGrid(levels, currentIdx) {
        // Panggung demo disisipkan tepat sebelum level yang memperkenalkan balok baru tersebut
        const DEMO_BEFORE_LEVEL = {
            1: 'forward_grab', // D1 Maju & Ambil sebelum Level 1
            3: 'turn',         // D2 Putar Haluan sebelum Level 3
            6: 'jump',         // D3 Lompat Jurang sebelum Level 6
            8: 'duck',         // D4 Tunduk Laser sebelum Level 8
            11: 'loop'         // D5 Perulangan Loop sebelum Level 11
        };

        const demoList = window.DEMO_STAGE_LIST || [];
        let html = '';

        levels.forEach((lvl, i) => {
            const demoKey = DEMO_BEFORE_LEVEL[lvl.id];
            if (demoKey) {
                const item = demoList.find(d => d.key === demoKey);
                if (item) {
                    html += `
                        <button type="button"
                            class="lobby-level-btn lobby-demo-btn"
                            data-stage="${item.key}"
                            title="Panggung Demo ${item.code}: ${item.title} (Pelataran 6×6 Bebas)"
                        >
                            <span class="lobby-level-num demo-num">${item.code}</span>
                            <span class="lobby-demo-label">${item.icon} ${item.shortLabel}</span>
                        </button>
                    `;
                }
            }

            const isDone   = this.gameState.isLevelCompleted(i);
            const stars    = this.gameState.starsEarned[i] || 0;
            const isCurr   = i === currentIdx;

            let badgeHtml = '·';
            if (isDone) {
                badgeHtml = '⭐'.repeat(Math.max(1, stars));
            }

            html += `
                <button type="button"
                    class="lobby-level-btn${isDone ? ' done' : ''}${isCurr ? ' current' : ''}"
                    data-idx="${i}"
                    title="Level ${lvl.id}: ${lvl.name}"
                >
                    <span class="lobby-level-num">${lvl.id}</span>
                    <span class="lobby-level-stars">${badgeHtml}</span>
                </button>
            `;
        });

        return html;
    }

    renderLevelGrid(levels, currentIdx) {
        return this.renderUnifiedGrid(levels, currentIdx);
    }
}

window.LobbyScreen = LobbyScreen;
