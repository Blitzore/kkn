/**
 * tileRenderer.js - Visualisasi Blok Ubin 3D, Tebing, Kristal & Sensor Acak
 * Menggambar seluruh geometri ubin isometrik dan objek statis/dinamis di arena.
 */

class TileRenderer {
    static drawTile(ctx, tile, engine) {
        const s = 0.44;   // Jeda batas ubin yang presisi (grid separation)

        // 4 Titik Sudut Atas Ubin Datar (Top Face murni, tanpa kaki gantung)
        const p0 = engine.gridToScreen(tile.x - s, tile.y - s, tile.z); // NW
        const p1 = engine.gridToScreen(tile.x + s, tile.y - s, tile.z); // NE
        const p2 = engine.gridToScreen(tile.x + s, tile.y + s, tile.z); // SE
        const p3 = engine.gridToScreen(tile.x - s, tile.y + s, tile.z); // SW

        let topColor = '#0f172a';
        let strokeColor = '#38bdf8';

        if (tile.type === 'start') {
            topColor = '#0369a1';
            strokeColor = '#38bdf8';
        } else if (tile.hasLaser) {
            topColor = '#1c1917';
            strokeColor = '#f43f5e';
        } else if (tile.type === 'sensor_dynamic' || tile.type === 'sensor_mystery') {
            if (tile.hazardType === 'laser' || tile.currentColor === 'red') {
                topColor = '#881337';
                strokeColor = '#f43f5e';
            } else if (tile.hazardType === 'gap' || tile.currentColor === 'blue') {
                topColor = '#7c2d12';
                strokeColor = '#fb923c';
            } else {
                topColor = '#581c87';
                strokeColor = '#c084fc';
            }
        } else if (tile.type === 'active_switch') {
            topColor = tile.activated ? '#14532d' : '#334155';
            strokeColor = tile.activated ? '#4ade80' : '#94a3b8';
        }

        // 1. Permukaan Ubin Datar (Top Face) - Bersih tanpa kaki/dinding gantung
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();

        // 2. Garis Batas Neon Tegas Berketebalan 2px (Pemisah Antar Petak)
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Garis Aksen Inset di Dalam Ubin (Memperjelas bentuk petak terpisah)
        const inS = s * 0.72;
        const ip0 = engine.gridToScreen(tile.x - inS, tile.y - inS, tile.z);
        const ip1 = engine.gridToScreen(tile.x + inS, tile.y - inS, tile.z);
        const ip2 = engine.gridToScreen(tile.x + inS, tile.y + inS, tile.z);
        const ip3 = engine.gridToScreen(tile.x - inS, tile.y + inS, tile.z);

        ctx.strokeStyle = strokeColor === '#38bdf8' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(244, 63, 94, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ip0.x, ip0.y);
        ctx.lineTo(ip1.x, ip1.y);
        ctx.lineTo(ip2.x, ip2.y);
        ctx.lineTo(ip3.x, ip3.y);
        ctx.closePath();
        ctx.stroke();

        const centerPos = engine.gridToScreen(tile.x, tile.y, tile.z);

        // Ornamen Khusus Ubin Start
        if (tile.type === 'start') {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('START', centerPos.x, centerPos.y);
        }

        // Ornamen Sensor Dinamis / Misteri (Simbol Sensor Berpendar)
        if (tile.type === 'sensor_dynamic' || tile.type === 'sensor_mystery') {
            const isLaser = (tile.hazardType === 'laser' || tile.currentColor === 'red');
            const isGap = (tile.hazardType === 'gap' || tile.currentColor === 'blue');
            const label = isLaser ? '⚡ LASER' : (isGap ? '🕳️ JURANG' : '❓ MISTERI');
            const auraColor = isLaser ? 'rgba(244, 63, 94, ' : (isGap ? 'rgba(251, 146, 60, ' : 'rgba(192, 132, 252, ');

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, centerPos.x, centerPos.y);

            // Garis pendaran sensor
            const pulse = 0.5 + Math.sin(engine.tick * 0.15) * 0.4;
            ctx.strokeStyle = `${auraColor}${pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerPos.x, centerPos.y, 14, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Ornamen Saklar
        if (tile.type === 'active_switch') {
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(tile.activated ? '⚡' : '🔘', centerPos.x, centerPos.y);
        }
    }

    static drawTarget(ctx, tile, engine) {
        const centerPos = engine.gridToScreen(tile.x, tile.y, tile.z);
        const floatZ = tile.z + 0.35 + Math.sin(engine.tick * 0.08) * 0.08;
        const crystalPos = engine.gridToScreen(tile.x, tile.y, floatZ);

        const isTarget2 = tile.targetNum === 2;
        const mainColor = isTarget2 ? '#38bdf8' : '#fde047';
        const auraColor = isTarget2 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(250, 204, 21, 0.6)';

        if (tile.collected) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
            ctx.beginPath();
            ctx.arc(centerPos.x, centerPos.y, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✓', centerPos.x, centerPos.y);
            return;
        }

        // 1. Pedestal Cincin Target di Lantai Ubin
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerPos.x, centerPos.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isTarget2 ? 'rgba(56, 189, 248, 0.22)' : 'rgba(250, 204, 21, 0.22)';
        ctx.fill();

        // 2. Bayangan Kristal di Lantai
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(centerPos.x, centerPos.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // 3. Glowing Aura Berpendar di Sekitar Kristal
        const glow = ctx.createRadialGradient(crystalPos.x, crystalPos.y, 2, crystalPos.x, crystalPos.y, 22);
        glow.addColorStop(0, mainColor);
        glow.addColorStop(0.5, auraColor);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(crystalPos.x, crystalPos.y, 22, 0, Math.PI * 2);
        ctx.fill();

        // 4. Poligon Kristal 3D
        const crystalWidth = 16;
        const crystalHeight = 24;

        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.moveTo(crystalPos.x, crystalPos.y - crystalHeight / 2);
        ctx.lineTo(crystalPos.x + crystalWidth / 2, crystalPos.y);
        ctx.lineTo(crystalPos.x, crystalPos.y + crystalHeight / 2);
        ctx.lineTo(crystalPos.x - crystalWidth / 2, crystalPos.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(crystalPos.x - 2, crystalPos.y - 4, 4, 4);

        // 5. Badge Label Nomor Kristal di Atasnya
        const allTargets = (engine.mapData && engine.mapData.tiles) ? engine.mapData.tiles.filter(t => t.hasTarget) : [];
        if (allTargets.length > 1 || tile.targetNum) {
            ctx.save();
            const labelText = allTargets.length > 1 ? `${isTarget2 ? '💎' : '⭐'} KRISTAL #${tile.targetNum || 1}` : '⭐ KRISTAL';
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.beginPath();
            ctx.roundRect(crystalPos.x - 30, crystalPos.y - 24, 60, 15, 4);
            ctx.fill();
            ctx.strokeStyle = mainColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labelText, crystalPos.x, crystalPos.y - 16);
            ctx.restore();
        }
    }

    static drawLaser(ctx, tile, engine) {
        // Posisi Proyeksi Layar Berdasarkan Ketinggian Grid
        const centerPos = engine.gridToScreen(tile.x, tile.y, tile.z);        // Lantai
        const laserPos  = engine.gridToScreen(tile.x, tile.y, tile.z + 0.38); // Ketinggian Sinar Laser
        const archPos   = engine.gridToScreen(tile.x, tile.y, tile.z + 0.60); // Ketinggian Palang Atap

        // Lebar setengah petak ubin di layar (dijamin 100% selalu melintang horizontal)
        const hw = (engine.zoomScale || 60) * 0.44;

        const baseL   = { x: centerPos.x - hw, y: centerPos.y };
        const baseR   = { x: centerPos.x + hw, y: centerPos.y };
        const beamL   = { x: laserPos.x - hw,  y: laserPos.y };
        const beamR   = { x: laserPos.x + hw,  y: laserPos.y };
        const archL   = { x: archPos.x - hw,   y: archPos.y };
        const archR   = { x: archPos.x + hw,   y: archPos.y };
        const archMid = { x: archPos.x,        y: archPos.y };

        ctx.save();

        // 1. Garis Peringatan Bahaya di Lantai (Caution Line di Kolong Gapura)
        ctx.strokeStyle = tile.laserDisabled ? 'rgba(34, 197, 94, 0.35)' : 'rgba(255, 0, 85, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(baseL.x, baseL.y);
        ctx.lineTo(baseR.x, baseR.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Dudukan Kaki Tiang Metalik di Lantai (Base Pedestals)
        [baseL, baseR].forEach(base => {
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(base.x, base.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(base.x, base.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 3. Tiang Penyangga Kiri & Kanan (Bright Titanium Cyber Posts - Super Terang & Kontras!)
        // Tiang Kiri
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(baseL.x, baseL.y);
        ctx.lineTo(archL.x, archL.y);
        ctx.stroke();

        ctx.strokeStyle = '#e2e8f0'; // Chrome/Silver terang kontras tinggi
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(baseL.x, baseL.y);
        ctx.lineTo(archL.x, archL.y);
        ctx.stroke();

        // Tiang Kanan
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(baseR.x, baseR.y);
        ctx.lineTo(archR.x, archR.y);
        ctx.stroke();

        ctx.strokeStyle = '#e2e8f0'; // Chrome/Silver terang kontras tinggi
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(baseR.x, baseR.y);
        ctx.lineTo(archR.x, archR.y);
        ctx.stroke();

        // 4. Palang Atap Gapura (Gantry Top Arch Header)
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(archL.x, archL.y);
        ctx.lineTo(archR.x, archR.y);
        ctx.stroke();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(archL.x, archL.y);
        ctx.lineTo(archR.x, archR.y);
        ctx.stroke();

        // Lampu Indikator Status di Tengah Atap Gapura
        const isBlink = Math.sin(engine.tick * 0.25) > 0;
        const ledColor = tile.laserDisabled ? '#22c55e' : (isBlink ? '#ff0055' : '#fbbf24');
        ctx.fillStyle = ledColor;
        ctx.beginPath();
        ctx.arc(archMid.x, archMid.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 5. Node Pemancar Laser (Emitter Bulbs) di Tiang
        const emitterColor = tile.laserDisabled ? '#64748b' : '#ff0055';
        [beamL, beamR].forEach(node => {
            ctx.fillStyle = emitterColor;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // 6. Sinar Laser Merah Neon Super Terang (High-Visibility Horizontal Neon Beam)
        if (!tile.laserDisabled) {
            const alpha = 0.85 + Math.sin(engine.tick * 0.25) * 0.15;
            ctx.globalAlpha = alpha;

            // Lapisan 1: Pendaran Luar Lebar (Outer Glow Bloom)
            ctx.strokeStyle = 'rgba(255, 0, 85, 0.45)';
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(beamL.x, beamL.y);
            ctx.lineTo(beamR.x, beamR.y);
            ctx.stroke();

            // Lapisan 2: Sinar Merah Neon Pekat
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 5.5;
            ctx.beginPath();
            ctx.moveTo(beamL.x, beamL.y);
            ctx.lineTo(beamR.x, beamR.y);
            ctx.stroke();

            // Lapisan 3: Inti Putih Panas Laser (Hot White Laser Core)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(beamL.x, beamL.y);
            ctx.lineTo(beamR.x, beamR.y);
            ctx.stroke();
        }

        ctx.restore();
    }
}

window.TileRenderer = TileRenderer;
