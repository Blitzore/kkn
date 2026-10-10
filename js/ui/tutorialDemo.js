/**
 * tutorialDemo.js — Visual Tutorial & Animasi Singkat di Modal Briefing
 * Menampilkan simulasi langsung gerakan robot sesuai perintah level
 * (misal: MAJU melangkah dan AMBIL kristal) untuk memperjelas konsep bagi siswa.
 */

class TutorialDemo {
    constructor(canvasId = 'demo-canvas', badgeId = 'demo-badge') {
        this.canvas = document.getElementById(canvasId);
        this.badge  = document.getElementById(badgeId);
        this.ctx    = this.canvas ? this.canvas.getContext('2d') : null;
        this.animId = null;
        this.startTime = 0;
        this.levelId = 1;
        this.isRunning = false;
        this.tick = 0;
    }

    start(levelId = 1, levelData = null) {
        if (!this.canvas) {
            this.canvas = document.getElementById('demo-canvas');
            this.badge  = document.getElementById('demo-badge');
            if (this.canvas) this.ctx = this.canvas.getContext('2d');
        }
        if (!this.canvas || !this.ctx) return;

        this.stop();
        this.levelId = levelId;
        this.levelData = levelData;
        this.isRunning = true;
        this.startTime = performance.now();
        this.tick = 0;

        // Auto-scale canvas resolution for crisp rendering (HiDPI / Retina)
        const rect = this.canvas.getBoundingClientRect();
        const dpr  = window.devicePixelRatio || 1;
        const w    = Math.floor(rect.width || 460);
        const h    = Math.floor(rect.height || 135);
        this.canvas.width  = w * dpr;
        this.canvas.height = h * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
        this.w = w;
        this.h = h;

        const loop = (now) => {
            if (!this.isRunning) return;
            this.render(now - this.startTime);
            this.animId = requestAnimationFrame(loop);
        };
        this.animId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }

    updateBadge(text, bg = '#0284c7') {
        if (!this.badge) return;
        if (this.badge.textContent !== text) {
            this.badge.textContent = text;
            this.badge.style.backgroundColor = bg;
        }
    }

    render(elapsed) {
        const ctx = this.ctx;
        const w   = this.w;
        const h   = this.h;
        this.tick++;

        ctx.clearRect(0, 0, w, h);

        // Pilih tipe demo berdasarkan materi level
        const lvl = this.levelId;
        if (lvl === 3 || lvl === 4 || lvl === 5) {
            this.renderTurnDemo(ctx, w, h, elapsed);
        } else if (lvl === 6 || lvl === 7) {
            this.renderJumpDemo(ctx, w, h, elapsed);
        } else {
            // Default & Level 1-2: MAJU dan AMBIL benda
            this.renderForwardGrabDemo(ctx, w, h, elapsed);
        }
    }

    /* ══════════════════════════════════════════════════════════
       DEMO UTAMA (LEVEL 1): MAJU ➔ MAJU ➔ AMBIL KRISTAL
       ══════════════════════════════════════════════════════════ */
    renderForwardGrabDemo(ctx, w, h, elapsed) {
        const cx = w * 0.50;
        const cy = h * 0.58;

        const stepX = 64;
        const stepY = 28;

        // 3 Ubin berurutan (Start -> Ubin 1 -> Ubin 2 dengan Target)
        const p0 = { x: cx - stepX,     y: cy - stepY };
        const p1 = { x: cx,             y: cy };
        const p2 = { x: cx + stepX,     y: cy + stepY };

        const totalCycle = 5200; // 5.2 detik per loop
        const t = (elapsed % totalCycle) / 1000;

        let robotX = p0.x;
        let robotY = p0.y;
        let robotBob = 0;
        let crystalCollected = false;
        let crystalScale = 1;
        let crystalFloatY = 0;
        let robotHappy = false;

        const crystalX = p2.x + 8;
        const crystalY = p2.y - 4;
        const robotStopX = p2.x - 8;
        const robotStopY = p2.y + 2;

        if (t < 1.4) {
            // FASE 1: Langkah Pertama [MAJU]
            const p = Math.min(1, t / 1.2);
            const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
            robotX = p0.x + (p1.x - p0.x) * ease;
            robotY = p0.y + (p1.y - p0.y) * ease;
            robotBob = -Math.sin(p * Math.PI) * 4;
            this.updateBadge('1. [ ⬆️ MAJU ]', '#0284c7');
        } else if (t < 2.8) {
            // FASE 2: Langkah Kedua [MAJU] Menuju Ubin Target
            const p = Math.min(1, (t - 1.4) / 1.2);
            const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
            robotX = p1.x + (robotStopX - p1.x) * ease;
            robotY = p1.y + (robotStopY - p1.y) * ease;
            robotBob = -Math.sin(p * Math.PI) * 4;
            this.updateBadge('2. [ ⬆️ MAJU ]', '#0284c7');
        } else if (t < 4.0) {
            // FASE 3: Mengambil Benda [AMBIL]
            robotX = robotStopX;
            robotY = robotStopY;
            const p = Math.min(1, (t - 2.8) / 0.9);
            // Kristal melayang ke arah robot lalu terserap
            crystalFloatY = p * 18;
            crystalScale = Math.max(0, 1 - p * 1.15);
            if (p > 0.4) {
                crystalCollected = true;
                robotHappy = true;
            }
            this.updateBadge('3. [ ⭐ AMBIL ]', '#eab308');
        } else {
            // FASE 4: Berhasil & Jeda Ulang
            robotX = robotStopX;
            robotY = robotStopY;
            crystalCollected = true;
            robotHappy = true;
            robotBob = Math.sin(this.tick * 0.15) * 2;
            this.updateBadge('✨ Kristal Terambil!', '#16a34a');
        }

        // Gambar 3 Ubin Isometrik dari belakang ke depan
        this.drawIsometricTile(ctx, p0.x, p0.y, true, 'START');
        this.drawIsometricTile(ctx, p1.x, p1.y, false);
        this.drawIsometricTile(ctx, p2.x, p2.y, false, crystalCollected ? 'SELESAI' : 'KRISTAL');

        // Target Pedestal di Ubin 2
        this.drawTargetPedestal(ctx, crystalX, crystalY, crystalCollected);

        // Kristal Target (jika belum habis diambil)
        if (!crystalCollected || crystalScale > 0.05) {
            this.drawCrystal(ctx, crystalX - (crystalFloatY * 0.4), crystalY - 10 - crystalFloatY, crystalScale);
        }

        // Gambar Robot ALGO-BOT
        this.drawRobotFigure(ctx, robotX, robotY + robotBob, robotHappy);
    }

    /* ══════════════════════════════════════════════════════════
       DEMO ROTASI: MAJU ➔ PUTAR ➔ MAJU
       ══════════════════════════════════════════════════════════ */
    renderTurnDemo(ctx, w, h, elapsed) {
        const cx = w * 0.46;
        const cy = h * 0.56;
        const step = 56;

        const p0 = { x: cx - step,     y: cy - step * 0.45 };
        const p1 = { x: cx,             y: cy };
        const p2 = { x: cx - step * 0.9, y: cy + step * 0.55 };

        const t = (elapsed % 4800) / 1000;
        let rx = p0.x, ry = p0.y, facing = 1, happy = false;

        if (t < 1.4) {
            const p = Math.min(1, t / 1.2);
            const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
            rx = p0.x + (p1.x - p0.x) * ease;
            ry = p0.y + (p1.y - p0.y) * ease;
            facing = 1;
            this.updateBadge('1. [ ⬆️ MAJU ]', '#0284c7');
        } else if (t < 2.6) {
            rx = p1.x; ry = p1.y;
            facing = 2; // Berputar
            this.updateBadge('2. [ ↪️ PUTAR ]', '#8b5cf6');
        } else if (t < 3.8) {
            const p = Math.min(1, (t - 2.6) / 1.1);
            const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
            rx = p1.x + (p2.x - p1.x) * ease;
            ry = p1.y + (p2.y - p1.y) * ease;
            facing = 2;
            this.updateBadge('3. [ ⬆️ MAJU ]', '#0284c7');
        } else {
            rx = p2.x; ry = p2.y;
            facing = 2;
            happy = true;
            this.updateBadge('✨ Arah Berhasil Belok!', '#16a34a');
        }

        this.drawIsometricTile(ctx, p0.x, p0.y, true, 'START');
        this.drawIsometricTile(ctx, p1.x, p1.y, false);
        this.drawIsometricTile(ctx, p2.x, p2.y, false, 'TUJUAN');
        this.drawRobotFigure(ctx, rx, ry, happy);
    }

    /* ══════════════════════════════════════════════════════════
       DEMO LOMPAT: MAJU ➔ LOMPAT TEBING/JURANG
       ══════════════════════════════════════════════════════════ */
    renderJumpDemo(ctx, w, h, elapsed) {
        const cx = w * 0.48;
        const cy = h * 0.62;
        const stepX = 64;
        const stepY = 28;

        const p0 = { x: cx - stepX, y: cy - stepY };
        const p1 = { x: cx + stepX, y: cy + stepY - 20 }; // Tebing lebih tinggi (Z naik)

        const t = (elapsed % 4500) / 1000;
        let rx = p0.x, ry = p0.y, happy = false;

        if (t < 1.5) {
            rx = p0.x; ry = p0.y;
            this.updateBadge('Siap di depan celah tebing...', '#0284c7');
        } else if (t < 3.0) {
            const p = Math.min(1, (t - 1.5) / 1.3);
            const ease = 0.5 - 0.5 * Math.cos(p * Math.PI);
            rx = p0.x + (p1.x - p0.x) * ease;
            const jumpArc = -Math.sin(p * Math.PI) * 26; // Lengkungan lompat
            ry = p0.y + (p1.y - p0.y) * ease + jumpArc;
            this.updateBadge('Balok [ 🦘 LOMPAT ]', '#f43f5e');
        } else {
            rx = p1.x; ry = p1.y;
            happy = true;
            this.updateBadge('✨ Berhasil Melompati Tebing!', '#16a34a');
        }

        this.drawIsometricTile(ctx, p0.x, p0.y, true, 'START');
        this.drawIsometricTile(ctx, p1.x, p1.y, false, 'TEBING', 24);
        this.drawRobotFigure(ctx, rx, ry, happy);
    }

    /* ── Utility: Gambar Ubin 3D Isometrik ───────────── */
    drawIsometricTile(ctx, x, y, isStart = false, label = null, elevation = 14) {
        const tw = 58;
        const th = 28;
        const skirt = elevation;

        // Dinding bawah (Skirt kiri & kanan)
        ctx.fillStyle = isStart ? '#0369a1' : '#0f172a';
        ctx.beginPath();
        ctx.moveTo(x - tw / 2, y);
        ctx.lineTo(x, y + th / 2);
        ctx.lineTo(x, y + th / 2 + skirt);
        ctx.lineTo(x - tw / 2, y + skirt);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isStart ? '#075985' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(x, y + th / 2);
        ctx.lineTo(x + tw / 2, y);
        ctx.lineTo(x + tw / 2, y + skirt);
        ctx.lineTo(x, y + th / 2 + skirt);
        ctx.closePath();
        ctx.fill();

        // Permukaan atas (Top Face)
        ctx.fillStyle = isStart ? '#0284c7' : '#1e293b';
        ctx.strokeStyle = isStart ? '#38bdf8' : '#33486c';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(x, y - th / 2);
        ctx.lineTo(x + tw / 2, y);
        ctx.lineTo(x, y + th / 2);
        ctx.lineTo(x - tw / 2, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Label teks di atas ubin
        if (label) {
            ctx.fillStyle = isStart ? '#ffffff' : '#94a3b8';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, y);
        }
    }

    /* ── Utility: Pedestal Cincin Target ─────────────── */
    drawTargetPedestal(ctx, x, y, isCollected) {
        ctx.save();
        ctx.translate(x, y);

        ctx.strokeStyle = isCollected ? '#22c55e' : '#facc15';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isCollected ? 'rgba(34, 197, 94, 0.25)' : 'rgba(250, 204, 21, 0.2)';
        ctx.fill();

        if (isCollected) {
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✓', 0, 0);
        }
        ctx.restore();
    }

    /* ── Utility: Kristal Bintang 3D ─────────────────── */
    drawCrystal(ctx, x, y, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Glow aura
        const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
        glow.addColorStop(0, '#fde047');
        glow.addColorStop(0.5, 'rgba(250, 204, 21, 0.5)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Berlian kristal (Atas & Bawah)
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(8, -2);
        ctx.lineTo(0, 7);
        ctx.lineTo(-8, -2);
        ctx.closePath();
        ctx.fill();

        // Shading sisi kanan
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(8, -2);
        ctx.lineTo(0, 7);
        ctx.closePath();
        ctx.fill();

        // Kilau bintang
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-2, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    /* ── Utility: Karakter Robot ALGO-BOT ────────────── */
    drawRobotFigure(ctx, x, y, isHappy = false) {
        ctx.save();
        ctx.translate(x, y - 10);

        // Bayangan di lantai
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 14, 13, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Booster wheels di bawah
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-8, 9, 6, 5);
        ctx.fillRect(2, 9, 6, 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-6, 12, 3, 2);
        ctx.fillRect(4, 12, 3, 2);

        // Badan Robot (Chassis Putih)
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(-12, -4, 24, 16, 4);
        ctx.fill();
        ctx.stroke();

        // Core reactor di dada
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(2, 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(2, 4, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Kepala Robot
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(-14, -22, 28, 17, 5);
        ctx.fill();
        ctx.stroke();

        // Tiang & Bola Antena
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(0, -30);
        ctx.stroke();

        ctx.fillStyle = isHappy ? '#22c55e' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -31, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Visor Layar Wajah
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.roundRect(-10, -19, 20, 12, 3);
        ctx.fill();

        // Mata LED Robot
        ctx.fillStyle = isHappy ? '#4ade80' : '#38bdf8';
        if (isHappy) {
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('^ ^', 0, -13);
        } else {
            ctx.fillRect(-5, -16, 3.5, 4.5);
            ctx.fillRect(2, -16, 3.5, 4.5);
        }

        ctx.restore();
    }
}

window.TutorialDemo = TutorialDemo;
