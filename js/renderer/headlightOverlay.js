/**
 * headlightOverlay.js - Sorotan Lampu Depan Robot & Penanda Sasaran (Top Pass)
 * Digambar di lapisan render paling atas agar tidak pernah tertimpa oleh ubin atau objek apa pun.
 */

class HeadlightOverlay {
    static draw(ctx, engine) {
        if (!engine.mapData || engine.robot.faceExpression === 'dead') return;

        const deltas = [
            { gx: 0, gy: -1 }, // North
            { gx: 1, gy: 0 },  // East
            { gx: 0, gy: 1 },  // South
            { gx: -1, gy: 0 }  // West
        ];
        const curDir = deltas[engine.robot.dir];
        const targetGridX = Math.round(engine.robot.gridX + curDir.gx);
        const targetGridY = Math.round(engine.robot.gridY + curDir.gy);
        const targetTile = engine.mapData.tiles.find(t => t.x === targetGridX && t.y === targetGridY);

        ctx.save();

        if (targetTile) {
            // Target adalah ubin arena valid
            const s = 0.47;
            const p0 = engine.gridToScreen(targetTile.x - s, targetTile.y - s, targetTile.z);
            const p1 = engine.gridToScreen(targetTile.x + s, targetTile.y - s, targetTile.z);
            const p2 = engine.gridToScreen(targetTile.x + s, targetTile.y + s, targetTile.z);
            const p3 = engine.gridToScreen(targetTile.x - s, targetTile.y + s, targetTile.z);
            const centerPos = engine.gridToScreen(targetTile.x, targetTile.y, targetTile.z);

            // 1. Highlight Neon Halus pada Permukaan Ubin Target
            const pulse = 0.5 + Math.sin(engine.tick * 0.12) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = `rgba(56, 189, 248, ${0.12 + pulse * 0.1})`;
            ctx.fill();

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 2. Titik Indikator Langkah Berikutnya
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerPos.x, centerPos.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // 3. Jika Ubin Target Lebih Tinggi (Tebing Naik)
            if (targetTile.z > engine.robot.gridZ) {
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.roundRect(centerPos.x - 32, centerPos.y - 24, 64, 16, 4);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('▲ TEBING', centerPos.x, centerPos.y - 16);
            }
        } else {
            // Cek apakah di seberang jurang (2 langkah) ada ubin pendaratan
            const step2GridX = Math.round(targetGridX + curDir.gx);
            const step2GridY = Math.round(targetGridY + curDir.gy);
            const step2Tile = engine.mapData.tiles.find(t => t.x === step2GridX && t.y === step2GridY);

            if (step2Tile) {
                // Ada celah jurang 1 petak, tapi ada ubin pendaratan di seberangnya!
                const s = 0.47;
                const lp0 = engine.gridToScreen(step2Tile.x - s, step2Tile.y - s, step2Tile.z);
                const lp1 = engine.gridToScreen(step2Tile.x + s, step2Tile.y - s, step2Tile.z);
                const lp2 = engine.gridToScreen(step2Tile.x + s, step2Tile.y + s, step2Tile.z);
                const lp3 = engine.gridToScreen(step2Tile.x - s, step2Tile.y + s, step2Tile.z);
                const landCenter = engine.gridToScreen(step2Tile.x, step2Tile.y, step2Tile.z);

                // Highlight Ubin Pendaratan di Seberang Jurang
                ctx.beginPath();
                ctx.moveTo(lp0.x, lp0.y);
                ctx.lineTo(lp1.x, lp1.y);
                ctx.lineTo(lp2.x, lp2.y);
                ctx.lineTo(lp3.x, lp3.y);
                ctx.closePath();
                ctx.fillStyle = 'rgba(168, 85, 247, 0.22)';
                ctx.fill();
                ctx.strokeStyle = '#c084fc';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Badge Indikator Lompat Seberang Jurang
                ctx.fillStyle = 'rgba(147, 51, 234, 0.9)';
                ctx.beginPath();
                ctx.roundRect(landCenter.x - 48, landCenter.y - 12, 96, 22, 6);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 9px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🦘 LOMPAT SEBERANG', landCenter.x, landCenter.y);
            } else {
                // Target adalah JURANG KOSONG (Void) tanpa dasar
                const s = 0.45;
                const vp0 = engine.gridToScreen(targetGridX - s, targetGridY - s, engine.robot.gridZ);
                const vp1 = engine.gridToScreen(targetGridX + s, targetGridY - s, engine.robot.gridZ);
                const vp2 = engine.gridToScreen(targetGridX + s, targetGridY + s, engine.robot.gridZ);
                const vp3 = engine.gridToScreen(targetGridX - s, targetGridY + s, engine.robot.gridZ);
                const voidCenter = engine.gridToScreen(targetGridX, targetGridY, engine.robot.gridZ);

                // Garis Putus-putus Jurang
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(vp0.x, vp0.y);
                ctx.lineTo(vp1.x, vp1.y);
                ctx.lineTo(vp2.x, vp2.y);
                ctx.lineTo(vp3.x, vp3.y);
                ctx.closePath();
                ctx.stroke();
                ctx.setLineDash([]);

                // Badge Peringatan Jurang
                ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
                ctx.beginPath();
                ctx.roundRect(voidCenter.x - 36, voidCenter.y - 10, 72, 20, 6);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 9px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('⚠️ JURANG', voidCenter.x, voidCenter.y);
            }
        }

        ctx.restore();
    }
}

window.HeadlightOverlay = HeadlightOverlay;
