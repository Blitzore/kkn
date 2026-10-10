/**
 * tileRenderer.js - Visualisasi Blok Ubin 3D, Tebing, Kristal & Sensor Acak
 * Menggambar seluruh geometri ubin isometrik dan objek statis/dinamis di arena.
 */

class TileRenderer {
    static drawTile(ctx, tile, engine) {
        const s = 0.47;   // Separuh ukuran ubin dalam unit grid
        const bH = 0.42;  // Tinggi dinding blok 3D

        // 4 Titik Sudut Atas (Top Face)
        const p0 = engine.gridToScreen(tile.x - s, tile.y - s, tile.z); // NW
        const p1 = engine.gridToScreen(tile.x + s, tile.y - s, tile.z); // NE
        const p2 = engine.gridToScreen(tile.x + s, tile.y + s, tile.z); // SE
        const p3 = engine.gridToScreen(tile.x - s, tile.y + s, tile.z); // SW

        // 4 Titik Sudut Bawah (Skirt / Bottom Face)
        const b0 = engine.gridToScreen(tile.x - s, tile.y - s, tile.z - bH);
        const b1 = engine.gridToScreen(tile.x + s, tile.y - s, tile.z - bH);
        const b2 = engine.gridToScreen(tile.x + s, tile.y + s, tile.z - bH);
        const b3 = engine.gridToScreen(tile.x - s, tile.y + s, tile.z - bH);

        let topColor = '#1e293b';
        let strokeColor = '#38bdf8';
        let wallDark = '#090d16';
        let wallMid = '#0f172a';
        let wallLight = '#1e293b';

        if (tile.type === 'start') {
            topColor = '#0284c7';
            strokeColor = '#38bdf8';
            wallDark = '#0369a1';
            wallMid = '#075985';
            wallLight = '#0c4a6e';
        } else if (tile.type === 'sensor_dynamic' || tile.type === 'sensor_mystery') {
            // Sensor Misteri / Dinamis untuk materi IF-ELSE (Jurang vs Laser)
            if (tile.hazardType === 'laser' || tile.currentColor === 'red') {
                topColor = '#be123c';
                strokeColor = '#f43f5e';
                wallDark = '#881337';
                wallMid = '#9f1239';
                wallLight = '#be123c';
            } else if (tile.hazardType === 'gap' || tile.currentColor === 'blue') {
                topColor = '#c2410c';
                strokeColor = '#fb923c';
                wallDark = '#7c2d12';
                wallMid = '#9a3412';
                wallLight = '#c2410c';
            } else {
                // Misteri Berpendar Ungu / Cyber
                topColor = '#7e22ce';
                strokeColor = '#c084fc';
                wallDark = '#581c87';
                wallMid = '#6b21a8';
                wallLight = '#7e22ce';
            }
        } else if (tile.type === 'active_switch') {
            topColor = tile.activated ? '#16a34a' : '#475569';
            strokeColor = tile.activated ? '#4ade80' : '#94a3b8';
            wallDark = tile.activated ? '#14532d' : '#1e293b';
            wallMid = tile.activated ? '#15803d' : '#334155';
            wallLight = tile.activated ? '#16a34a' : '#475569';
        }

        // 4 Dinding Vertikal (Wall 0: N, Wall 1: E, Wall 2: S, Wall 3: W)
        const walls = [
            { pA: p0, pB: p1, bB: b1, bA: b0, color: wallDark },
            { pA: p1, pB: p2, bB: b2, bA: b1, color: wallMid },
            { pA: p2, pB: p3, bB: b3, bA: b2, color: wallLight },
            { pA: p3, pB: p0, bB: b0, bA: b3, color: wallMid }
        ];

        // Gambar hanya dinding yang menghadap kamera (Backface Culling)
        walls.forEach(w => {
            const cross = (w.pB.x - w.pA.x) * (w.bA.y - w.pA.y) - (w.pB.y - w.pA.y) * (w.bA.x - w.pA.x);
            if (cross > 0) {
                ctx.beginPath();
                ctx.moveTo(w.pA.x, w.pA.y);
                ctx.lineTo(w.pB.x, w.pB.y);
                ctx.lineTo(w.bB.x, w.bB.y);
                ctx.lineTo(w.bA.x, w.bA.y);
                ctx.closePath();
                ctx.fillStyle = w.color;
                ctx.fill();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // Permukaan Atas Blok (Top Face)
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = topColor;
        ctx.fill();

        // Garis Tepi Neon
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
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
        const baseL = engine.gridToScreen(tile.x - 0.35, tile.y, tile.z);
        const baseR = engine.gridToScreen(tile.x + 0.35, tile.y, tile.z);
        const topL = engine.gridToScreen(tile.x - 0.35, tile.y, tile.z + 0.35);
        const topR = engine.gridToScreen(tile.x + 0.35, tile.y, tile.z + 0.35);

        const alpha = 0.7 + Math.sin(engine.tick * 0.2) * 0.3;

        // Tiang Pemancar Laser Kiri & Kanan
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(baseL.x, baseL.y);
        ctx.lineTo(topL.x, topL.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(baseR.x, baseR.y);
        ctx.lineTo(topR.x, topR.y);
        ctx.stroke();

        // Sinar Laser Merah Neon
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(topL.x, topL.y);
        ctx.lineTo(topR.x, topR.y);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(topL.x, topL.y);
        ctx.lineTo(topR.x, topR.y);
        ctx.stroke();
        ctx.restore();
    }
}

window.TileRenderer = TileRenderer;
