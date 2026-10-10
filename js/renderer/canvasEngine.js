/**
 * canvasEngine.js - Core Engine Kanvas Isometrik 2.5D
 * Mengatur kanvas, proyeksi isometrik, loop render, gerakan robot, dan sistem partikel.
 */

class CanvasEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        // Parameter Kamera Orbit 3D
        // cameraTheta: Rotasi Horizontal (Azimuth seputar sumbu vertikal Z, 0 s.d. 2*PI)
        this.cameraTheta = Math.PI / 4; // Bawaan: 45° (Sudut Isometrik)
        this.targetTheta = this.cameraTheta;

        // cameraPhi: Sudut Kemiringan Vertikal (Pitch Elevation, 0.18 rad [samping] s.d. 1.50 rad [atas])
        this.cameraPhi = 0.62; // Bawaan: ~35.5° (Tampak 3D Isometrik)
        this.targetPhi = this.cameraPhi;

        // Skala Zoom Kamera
        this.baseZoom = 52;
        this.zoomScale = 52;
        this.targetZoom = 52;

        // Titik Pusat Bounding Box Arena
        this.centerX = 0;
        this.centerY = 0;
        this.centerZ = 0;

        this.originX = 0;
        this.originY = 0;
        this.vWidth = 0;
        this.vHeight = 0;

        this.activePreset = 'iso';
        this.tick = 0;
        this.isRunning = false;
        this.particles = [];

        this.robot = {
            gridX: 0,
            gridY: 0,
            gridZ: 0,
            dir: 1, // 0: North, 1: East, 2: South, 3: West
            animX: 0,
            animY: 0,
            animZ: 0,
            bobOffset: 0,
            isJumping: false,
            jumpProgress: 0,
            faceExpression: 'normal'
        };

        this.mapData = null;
        this.speedMultiplier = 1;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        if (typeof ResizeObserver !== 'undefined' && this.canvas && this.canvas.parentElement) {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(this.canvas.parentElement);
        }
        this.setupInteraction();
    }

    setupInteraction() {
        if (!this.canvas) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startTheta = 0;
        let startPhi = 0;
        let hasMoved = false;

        const onStart = (clientX, clientY) => {
            isDragging = true;
            startX = clientX;
            startY = clientY;
            startTheta = this.targetTheta;
            startPhi = this.targetPhi;
            hasMoved = false;
        };

        const onMove = (clientX, clientY) => {
            if (!isDragging) return;
            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
                this.hideHintBadge();
            }

            // Putar 360° Horizontal (Azimuth)
            this.targetTheta = startTheta + dx * 0.009;
            this.cameraTheta = this.targetTheta;

            // Miringkan Vertikal (Pitch: Dari samping 12° hingga tampak atas 86°)
            this.targetPhi = Math.max(0.20, Math.min(1.50, startPhi - dy * 0.007));
            this.cameraPhi = this.targetPhi;

            this.setActivePresetUI('custom');
        };

        const onEnd = () => {
            isDragging = false;
        };

        // Mouse Drag di Desktop
        this.canvas.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);

        // Touch Drag di Tablet / Smartphone
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                onStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', onEnd);

        // Zoom dengan Scroll Roda Mouse
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY > 0 ? 0.93 : 1.07;
            this.targetZoom = Math.max(this.baseZoom * 0.55, Math.min(this.baseZoom * 1.9, this.targetZoom * zoomDelta));
            this.hideHintBadge();
        }, { passive: false });
    }

    hideHintBadge() {
        const badge = document.getElementById('drag-hint') || document.getElementById('arena-cam-hint');
        if (badge) {
            badge.style.opacity = '0';
            setTimeout(() => { badge.style.display = 'none'; }, 500);
        }
    }

    setCameraPreset(presetName) {
        this.activePreset = presetName;
        this.hideHintBadge();

        if (presetName === 'iso') {
            // Sudut 3D Isometrik Bawaan
            this.targetTheta = Math.PI / 4; // 45°
            this.targetPhi = 0.62;          // ~35.5°
            this.targetZoom = this.baseZoom;
        } else if (presetName === 'top') {
            // Tampak Atas (Bird's Eye View - Langsung terlihat arah & runtutan grid 2D)
            this.targetTheta = Math.PI / 4;
            this.targetPhi = 1.48;          // ~85°
            this.targetZoom = this.baseZoom * 1.05;
        } else if (presetName === 'side') {
            // Tampak Samping (Side Elevation - Memperlihatkan perbedaan tinggi, tebing & lompatan jurang)
            this.targetPhi = 0.24;          // ~14°
            this.targetZoom = this.baseZoom * 1.08;
        } else if (presetName === 'reset') {
            this.targetTheta = Math.PI / 4;
            this.targetPhi = 0.62;
            this.targetZoom = this.baseZoom;
            this.activePreset = 'iso';
        }

        this.setActivePresetUI(this.activePreset);
    }

    setActivePresetUI(name) {
        const btnIso = document.getElementById('btn-cam-iso');
        const btnTop = document.getElementById('btn-cam-top');
        const btnSide = document.getElementById('btn-cam-side');

        if (btnIso) btnIso.classList.toggle('active', name === 'iso');
        if (btnTop) btnTop.classList.toggle('active', name === 'top');
        if (btnSide) btnSide.classList.toggle('active', name === 'side');
    }

    resize() {
        if (!this.canvas || !this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.vWidth = Math.floor(rect.width);
        this.vHeight = Math.floor(rect.height);

        this.canvas.width = this.vWidth * dpr;
        this.canvas.height = this.vHeight * dpr;
        this.canvas.style.width = `${this.vWidth}px`;
        this.canvas.style.height = `${this.vHeight}px`;

        if (this.ctx) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(dpr, dpr);
            this.ctx.imageSmoothingEnabled = false;
        }

        this.recalculateOrigin();
    }

    recalculateOrigin() {
        const w = this.vWidth || 800;
        const h = this.vHeight || 600;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = 0, maxZ = 0;

        if (this.mapData && this.mapData.tiles && this.mapData.tiles.length > 0) {
            this.mapData.tiles.forEach(t => {
                if (t.x < minX) minX = t.x;
                if (t.x > maxX) maxX = t.x;
                if (t.y < minY) minY = t.y;
                if (t.y > maxY) maxY = t.y;
                if (t.z < minZ) minZ = t.z;
                if (t.z > maxZ) maxZ = t.z;
            });
            this.centerX = (minX + maxX) / 2;
            this.centerY = (minY + maxY) / 2;
            this.centerZ = (minZ + maxZ) / 2;
        } else {
            this.centerX = 0;
            this.centerY = 0;
            this.centerZ = 0;
            minX = 0; maxX = 3;
            minY = 0; maxY = 3;
        }

        const mapSpanX = Math.max(1, maxX - minX + 2.2);
        const mapSpanY = Math.max(1, maxY - minY + 2.2);
        const maxSpan = Math.max(mapSpanX, mapSpanY, 4.2);

        // Skala zoom otomatis agar arena selalu berada tepat di tengah layar dengan margin estetis
        const fitW = (w * 0.72) / (maxSpan * 1.35);
        const fitH = (h * 0.68) / (maxSpan * 0.95);
        this.baseZoom = Math.max(34, Math.min(68, Math.min(fitW, fitH)));
        this.targetZoom = this.baseZoom;
        this.zoomScale = this.baseZoom;

        this.originX = Math.floor(w / 2);
        this.originY = Math.floor(h * 0.52);
    }

    setSpeed(multiplier = 1) {
        this.speedMultiplier = Math.max(0.5, multiplier);
    }

    setMap(mapData) {
        if (!mapData) return;
        this.resize();
        this.mapData = JSON.parse(JSON.stringify(mapData));

        // Acak warna untuk sensor dinamis setiap kali peta dimuat
        if (this.mapData.tiles) {
            this.mapData.tiles.forEach(t => {
                if (t.type === 'sensor_dynamic') {
                    t.currentColor = Math.random() > 0.5 ? 'red' : 'blue';
                }
            });
        }

        this.robot.gridX = this.mapData.startX || 0;
        this.robot.gridY = this.mapData.startY || 0;
        this.robot.gridZ = this.mapData.startZ || 0;
        this.robot.dir = (typeof this.mapData.startDir === 'number') ? this.mapData.startDir : 1;

        this.robot.animX = this.robot.gridX;
        this.robot.animY = this.robot.gridY;
        this.robot.animZ = this.robot.gridZ;
        this.robot.faceExpression = 'normal';
        this.robot.isJumping = false;
        this.particles = [];

        this.recalculateOrigin();
    }

    gridToScreen(gx, gy, gz = 0) {
        const dx = gx - this.centerX;
        const dy = gy - this.centerY;
        const dz = gz - this.centerZ;

        const cosT = Math.cos(this.cameraTheta);
        const sinT = Math.sin(this.cameraTheta);
        const cosP = Math.cos(this.cameraPhi);
        const sinP = Math.sin(this.cameraPhi);

        // 1. Rotasi Horizontal (Azimuth seputar sumbu Z)
        const x1 = dx * cosT - dy * sinT;
        const y1 = dx * sinT + dy * cosT;
        const z1 = dz;

        // 2. Proyeksi Layar 2D (Elevasi/Pitch)
        const screenX = this.originX + x1 * this.zoomScale;
        const screenY = this.originY + (y1 * sinP - z1 * cosP) * this.zoomScale;

        return { x: screenX, y: screenY };
    }

    getCameraPosition() {
        const R = 300;
        const cosT = Math.cos(this.cameraTheta);
        const sinT = Math.sin(this.cameraTheta);
        const cosP = Math.cos(this.cameraPhi);
        const sinP = Math.sin(this.cameraPhi);

        return {
            x: this.centerX - R * sinT * cosP,
            y: this.centerY - R * cosT * cosP,
            z: this.centerZ + R * sinP
        };
    }

    addParticle(gx, gy, gz, color = '#38bdf8', count = 6, speed = 1.8) {
        const pos = this.gridToScreen(gx, gy, gz);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = (Math.random() * speed + 0.6);
            this.particles.push({
                x: pos.x,
                y: pos.y - 10,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 0.8,
                alpha: 1,
                color: color,
                size: Math.random() * 3 + 2,
                decay: 0.03 + Math.random() * 0.02
            });
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const renderLoop = () => {
            if (!this.isRunning) return;
            this.update();
            this.render();
            requestAnimationFrame(renderLoop);
        };
        requestAnimationFrame(renderLoop);
    }

    stop() {
        this.isRunning = false;
    }

    update() {
        this.tick++;
        this.robot.bobOffset = Math.sin(this.tick * 0.08) * 2;

        // Easing Sudut Kamera & Zoom
        const camLerp = 0.18;
        this.cameraTheta += (this.targetTheta - this.cameraTheta) * camLerp;
        this.cameraPhi += (this.targetPhi - this.cameraPhi) * camLerp;
        this.zoomScale += (this.targetZoom - this.zoomScale) * camLerp;

        const lerpSpeed = Math.min(0.5, 0.22 * (this.speedMultiplier || 1));
        this.robot.animX += (this.robot.gridX - this.robot.animX) * lerpSpeed;
        this.robot.animY += (this.robot.gridY - this.robot.animY) * lerpSpeed;
        this.robot.animZ += (this.robot.gridZ - this.robot.animZ) * lerpSpeed;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        const ctx = this.ctx;
        if (!ctx || !this.vWidth) return;

        this.drawBackground();
        if (!this.mapData) return;

        // ── Depth Sorting tiles (Painter's Algorithm) ──────────────────────
        // PENTING: Robot TIDAK dimasukkan ke dalam queue.
        // Robot selalu digambar setelah semua tile, sehingga tidak pernah
        // tertimpa oleh tile apapun pada sudut kamera manapun.
        const cam = this.getCameraPosition();
        const getDistSq = (gx, gy, gz) => {
            const dx = gx - cam.x;
            const dy = gy - cam.y;
            const dz = gz - cam.z;
            return dx * dx + dy * dy + dz * dz;
        };

        const renderQueue = [];
        this.mapData.tiles.forEach(tile => {
            renderQueue.push({
                type: 'tile',
                distSq: getDistSq(tile.x, tile.y, tile.z),
                tile: tile
            });

            if (tile.hasTarget) {
                renderQueue.push({
                    type: 'target',
                    distSq: getDistSq(tile.x, tile.y, tile.z + 0.35),
                    tile: tile
                });
            }

            if (tile.hasLaser && !tile.laserDisabled) {
                renderQueue.push({
                    type: 'laser',
                    distSq: getDistSq(tile.x, tile.y, tile.z + 0.35),
                    tile: tile
                });
            }
        });

        // Urutkan dari objek terjauh hingga terdekat
        renderQueue.sort((a, b) => b.distSq - a.distSq);

        // Gambar semua tile
        renderQueue.forEach(item => {
            if (item.type === 'tile')   TileRenderer.drawTile(ctx, item.tile, this);
            else if (item.type === 'target') TileRenderer.drawTarget(ctx, item.tile, this);
            else if (item.type === 'laser')  TileRenderer.drawLaser(ctx, item.tile, this);
        });

        // ── Robot selalu digambar TERAKHIR di atas semua tile ──────────────
        RobotRenderer.drawRobot(ctx, this);

        // Highlight/peringatan jurang dihilangkan: indikator panah arah robot & kompas sudah cukup jelas
        // HeadlightOverlay.draw(ctx, this);

        // Partikel
        this.drawParticles();

        // Kompas
        this.drawCompass(ctx);
    }

    drawCompass(ctx) {
        const cx = 36;
        const cy = 40;
        const radius = 20;

        ctx.save();
        // Lingkaran Piringan Kompas
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Jarum Kompas Berputar Sesuai Sudut Kamera
        const needleAngle = this.cameraTheta - Math.PI / 4;
        ctx.translate(cx, cy);
        ctx.rotate(-needleAngle);

        // Ujung Utara (Merah)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0, -radius + 4);
        ctx.lineTo(4, 0);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();

        // Ujung Selatan (Cyan)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, radius - 4);
        ctx.lineTo(4, 0);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();

        // Huruf U (Utara)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('U', 0, -radius + 3);

        ctx.restore();

        // Teks Mode Kamera di Bawah Kompas
        ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        let modeText = '3D';
        if (this.cameraPhi > 1.25) modeText = 'ATAS';
        else if (this.cameraPhi < 0.35) modeText = 'SAMPING';
        ctx.fillText(modeText, cx, cy + radius + 11);
    }

    drawBackground() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.vWidth, this.vHeight);

        const bgGrad = ctx.createRadialGradient(
            this.vWidth / 2, this.vHeight / 2, 50,
            this.vWidth / 2, this.vHeight / 2, this.vWidth * 0.8
        );
        bgGrad.addColorStop(0, '#111827');
        bgGrad.addColorStop(0.6, '#090d16');
        bgGrad.addColorStop(1, '#030712');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.vWidth, this.vHeight);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.vWidth; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.vHeight);
            ctx.stroke();
        }
        for (let y = 0; y < this.vHeight; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.vWidth, y);
            ctx.stroke();
        }
    }

    drawParticles() {
        const ctx = this.ctx;
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    waitAnim(ms) {
        const scaled = Math.max(16, ms / (this.speedMultiplier || 1));
        return new Promise(resolve => setTimeout(resolve, scaled));
    }

    // --- KONTROL GERAKAN ROBOT ---

    async moveForward() {
        const deltas = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        const step = deltas[this.robot.dir];
        const nextX = this.robot.gridX + step.dx;
        const nextY = this.robot.gridY + step.dy;

        const targetTile = this.mapData.tiles.find(t => t.x === nextX && t.y === nextY);
        if (!targetTile) {
            return await RobotRenderer.animateFall(this, nextX, nextY);
        }

        if (targetTile.z > this.robot.gridZ) {
            this.robot.faceExpression = 'dead';
            this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#ef4444', 8);
            return { success: false, reason: 'Ubin di depan terlalu tinggi! Gunakan balok LOMPAT untuk naik.' };
        }

        if (targetTile.hasLaser && !targetTile.laserDisabled) {
            this.robot.faceExpression = 'dead';
            this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#f43f5e', 12);
            return { success: false, reason: 'Koinbot menabrak Laser Pengaman aktif! Gunakan balok TUNDUK untuk meluncur lewat bawah laser.' };
        }

        this.robot.gridX = nextX;
        this.robot.gridY = nextY;
        this.robot.gridZ = targetTile.z;
        this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#38bdf8', 4);

        await this.waitAnim(280);
        return { success: true, tile: targetTile };
    }

    async duck() {
        const deltas = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        const step = deltas[this.robot.dir];
        const nextX = this.robot.gridX + step.dx;
        const nextY = this.robot.gridY + step.dy;

        const targetTile = this.mapData.tiles.find(t => t.x === nextX && t.y === nextY);
        if (!targetTile) {
            // Merunduk ke jurang kosong -> jatuh
            return await RobotRenderer.animateFall(this, nextX, nextY);
        }

        if (targetTile.z > this.robot.gridZ) {
            this.robot.faceExpression = 'dead';
            this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#ef4444', 8);
            return { success: false, reason: 'Ubin di depan terlalu tinggi! Tidak bisa merunduk menaiki tebing.' };
        }

        // Animasi merunduk & meluncur di bawah laser
        this.robot.isDucking = true;
        const startX = this.robot.gridX;
        const startY = this.robot.gridY;
        const startZ = this.robot.gridZ;
        const endZ = targetTile.z;

        this.robot.gridX = nextX;
        this.robot.gridY = nextY;
        this.robot.gridZ = endZ;

        const startTime = Date.now();
        const duration = 300 / (this.speedMultiplier || 1);

        await new Promise(resolve => {
            const slideInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const p = Math.min(1, elapsed / duration);

                this.robot.animX = startX + (nextX - startX) * p;
                this.robot.animY = startY + (nextY - startY) * p;
                this.robot.animZ = startZ + (endZ - startZ) * p;

                if (Math.random() > 0.4) {
                    this.addParticle(this.robot.animX, this.robot.animY, this.robot.animZ, '#06b6d4', 3, 0.8);
                }

                if (p >= 1) {
                    clearInterval(slideInterval);
                    this.robot.isDucking = false;
                    this.robot.animX = nextX;
                    this.robot.animY = nextY;
                    this.robot.animZ = endZ;
                    this.addParticle(nextX, nextY, endZ, '#38bdf8', 6);
                    resolve();
                }
            }, 16);
        });

        await this.waitAnim(60);
        return { success: true, tile: targetTile };
    }

    async turnLeft() {
        this.robot.dir = (this.robot.dir + 3) % 4;
        this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#facc15', 3);
        await this.waitAnim(180);
        return { success: true };
    }

    async turnRight() {
        this.robot.dir = (this.robot.dir + 1) % 4;
        this.addParticle(this.robot.gridX, this.robot.gridY, this.robot.gridZ, '#facc15', 3);
        await this.waitAnim(180);
        return { success: true };
    }

    async jump() {
        const deltas = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        const step = deltas[this.robot.dir];

        // 1. Cek ubin 1 langkah di depan (naik tebing atau ubin datar)
        const step1X = this.robot.gridX + step.dx;
        const step1Y = this.robot.gridY + step.dy;
        const tile1 = this.mapData.tiles.find(t => t.x === step1X && t.y === step1Y);

        // 2. Cek ubin 2 langkah di depan (melompati celah jurang 1 petak)
        const step2X = this.robot.gridX + step.dx * 2;
        const step2Y = this.robot.gridY + step.dy * 2;
        const tile2 = (!tile1) ? this.mapData.tiles.find(t => t.x === step2X && t.y === step2Y) : null;

        // 3. Khusus: Jika jalan di depan datar biasa (tidak ada tebing naik/turun dan bukan celah jurang),
        // robot hanya melompat di tempat (jump in place) agar ada perbedaan fungsi yang tegas dengan balok MAJU!
        if (tile1 && tile1.z === this.robot.gridZ) {
            this.robot.isJumping = true;
            this.robot.jumpProgress = 0;
            const startTime = Date.now();
            const duration = 380 / (this.speedMultiplier || 1);

            await new Promise(resolve => {
                const jumpInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const p = Math.min(1, elapsed / duration);
                    this.robot.jumpProgress = p;
                    if (p >= 1) {
                        clearInterval(jumpInterval);
                        this.robot.isJumping = false;
                        resolve();
                    }
                }, 16);
            });
            await this.waitAnim(60);
            return {
                success: true,
                inPlace: true,
                message: 'Robot melompat di tempat karena jalan di depan datar. Gunakan [MAJU] untuk jalan datar!'
            };
        }

        // Tentukan target pendaratan
        let targetTile = tile1;
        let targetX = step1X;
        let targetY = step1Y;
        let isGapJump = false;

        if (!tile1 && tile2) {
            targetTile = tile2;
            targetX = step2X;
            targetY = step2Y;
            isGapJump = true;
        }

        if (!targetTile) {
            // Benar-benar jurang tanpa dasar: jatuh!
            this.robot.isJumping = true;
            this.robot.jumpProgress = 0.5;
            await this.waitAnim(200);
            this.robot.isJumping = false;
            return await RobotRenderer.animateFall(this, step1X, step1Y);
        }

        if (targetTile.hasLaser && !targetTile.laserDisabled) {
            this.robot.faceExpression = 'dead';
            this.addParticle(targetX, targetY, targetTile.z, '#f43f5e', 12);
            return { success: false, reason: 'Koinbot melompat ke arah Laser Pengaman aktif! Gunakan balok TUNDUK untuk meluncur lewat bawah laser.' };
        }

        this.robot.isJumping = true;
        this.robot.jumpProgress = 0;
        const startX = this.robot.gridX;
        const startY = this.robot.gridY;
        const startZ = this.robot.gridZ;
        const endZ = targetTile.z;

        this.robot.gridX = targetX;
        this.robot.gridY = targetY;
        this.robot.gridZ = endZ;

        const startTime = Date.now();
        const duration = (isGapJump ? 480 : 380) / (this.speedMultiplier || 1);

        await new Promise(resolve => {
            const jumpInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const p = Math.min(1, elapsed / duration);
                this.robot.jumpProgress = p;

                this.robot.animX = startX + (targetX - startX) * p;
                this.robot.animY = startY + (targetY - startY) * p;
                this.robot.animZ = startZ + (endZ - startZ) * p;

                if (p >= 1) {
                    clearInterval(jumpInterval);
                    this.robot.isJumping = false;
                    this.robot.animX = targetX;
                    this.robot.animY = targetY;
                    this.robot.animZ = endZ;
                    this.addParticle(targetX, targetY, endZ, '#a855f7', 10);
                    resolve();
                }
            }, 16);
        });

        return { success: true, tile: targetTile };
    }

    async activateCurrentTile() {
        const curTile = this.mapData.tiles.find(
            t => t.x === this.robot.gridX && t.y === this.robot.gridY
        );

        if (!curTile) return { success: false };

        if (curTile.hasTarget && !curTile.collected) {
            curTile.collected = true;
            this.robot.faceExpression = 'happy';
            this.addParticle(curTile.x, curTile.y, curTile.z, '#fde047', 18, 3);
            await this.waitAnim(250);
            return { success: true, item: 'crystal' };
        }

        if (curTile.type === 'active_switch') {
            curTile.activated = !curTile.activated;
            this.addParticle(curTile.x, curTile.y, curTile.z, '#22c55e', 12, 2);
            await this.waitAnim(200);
            return { success: true, item: 'switch', activated: curTile.activated };
        }

        return { success: true };
    }
}

window.CanvasEngine = CanvasEngine;
