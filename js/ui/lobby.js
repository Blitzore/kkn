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
    constructor(gameState, onEnter) {
        this.gameState = gameState;
        this.onEnter   = onEnter;          // onEnter(levelIndex)

        this.$lobby    = document.getElementById('screen-lobby');
        this.$game     = document.getElementById('screen-game');
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

                <!-- Level grid -->
                <div class="lobby-level-section">
                    <div class="lobby-section-label">Pilih Level</div>
                    <div class="lobby-level-grid" id="lobby-level-grid">
                        ${this.renderLevelGrid(levels, safeIdx)}
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

    renderLevelGrid(levels, currentIdx) {
        return levels.map((lvl, i) => {
            const isDone   = this.gameState.isLevelCompleted(i);
            const stars    = this.gameState.starsEarned[i] || 0;
            const isCurr   = i === currentIdx;
            const isLocked = false;

            let badgeHtml = '·';
            if (isDone) {
                badgeHtml = '⭐'.repeat(Math.max(1, stars));
            }

            return `
                <button type="button"
                    class="lobby-level-btn${isDone ? ' done' : ''}${isCurr ? ' current' : ''}"
                    data-idx="${i}"
                    title="Level ${lvl.id}: ${lvl.name}"
                    ${isLocked ? 'disabled' : ''}
                >
                    ${isLocked
                        ? `<span class="lock-icon">🔒</span>`
                        : `<span class="lobby-level-num">${lvl.id}</span>
                           <span class="lobby-level-stars">${badgeHtml}</span>`
                    }
                </button>
            `;
        }).join('');
    }
}

window.LobbyScreen = LobbyScreen;
