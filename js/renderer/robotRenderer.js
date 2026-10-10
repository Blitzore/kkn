/**
 * robotRenderer.js - Visualisasi Robot Koinbot 3D & Fisika Jatuh
 * Menggambar robot ALGO-BOT dengan chassis logam, roda booster, antena, dan ekspresi mata LED.
 */

class RobotRenderer {
    static drawRobot(ctx, engine) {
        const robot = engine.robot;

        // Ketinggian lompat 3D dalam koordinat Z
        const jumpZ = robot.isJumping ? Math.sin(robot.jumpProgress * Math.PI) * 0.9 : 0;
        const pos = engine.gridToScreen(robot.animX, robot.animY, robot.animZ + jumpZ);
        const groundPos = engine.gridToScreen(robot.animX, robot.animY, robot.animZ);

        const rX = pos.x;
        const rY = pos.y + robot.bobOffset;

        // Vektor arah di koordinat layar
        const deltas = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        const curDir = deltas[robot.dir];
        const fwdPos = engine.gridToScreen(robot.animX + curDir.dx * 0.35, robot.animY + curDir.dy * 0.35, robot.animZ + jumpZ);
        const screenDx = fwdPos.x - pos.x;
        const screenDy = fwdPos.y - pos.y;
        const headingAngle = Math.atan2(screenDy, screenDx);

        // 1. Bayangan Robot di Permukaan Lantai
        const shadowScale = robot.isJumping ? Math.max(0.35, 1 - (jumpZ * 0.7)) : 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(groundPos.x, groundPos.y, 14 * shadowScale, 0, Math.PI * 2);
        ctx.fill();

        // 2. Jika Sedang Tampak Atas (Top-Down Bird's Eye View)
        if (engine.cameraPhi > 1.18) {
            ctx.save();
            ctx.translate(rX, rY);

            // Helm Robot Bulat dari Atas
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Kubah Kepala
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.fill();

            // Antena Tengah Glowing
            ctx.fillStyle = robot.faceExpression === 'dead' ? '#ef4444' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
            ctx.fill();

            // Panah Arah Hadap Neon (Sangat Jelas & Terlihat dari Atas)
            ctx.rotate(headingAngle);
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(18, 0);
            ctx.lineTo(8, -7);
            ctx.lineTo(10, -2.5);
            ctx.lineTo(-4, -2.5);
            ctx.lineTo(-4, 2.5);
            ctx.lineTo(10, 2.5);
            ctx.lineTo(8, 7);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.restore();
            return;
        }

        // 3. Tampak 3D Isometrik & Tampak Samping (Side View)
        const isFacingBack = (screenDy <= 0);
        const isFacingRight = (screenDx >= 0);

        ctx.save();
        ctx.translate(rX, rY - 14);
        if (robot.isDucking) {
            ctx.translate(0, 10);
            ctx.scale(1.25, 0.45);
        }

        // Kaki Booster / Roda Bawah
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-10, 10, 7, 6);
        ctx.fillRect(3, 10, 7, 6);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-8, 14, 3, 2);
        ctx.fillRect(5, 14, 3, 2);

        // Badan Robot (Chassis Putih Metalik)
        ctx.fillStyle = isFacingBack ? '#cbd5e1' : '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(-14, -6, 28, 18, 5);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (!isFacingBack) {
            // Tampak Depan: Core Reactor di Dada
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.arc(isFacingRight ? 3 : -3, 3, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(isFacingRight ? 3 : -3, 3, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Tampak Belakang: Modul Baterai & Ventilasi
            ctx.fillStyle = '#334155';
            ctx.fillRect(-8, -2, 16, 10);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(-6, 0, 12, 3);
        }

        // Kepala Robot
        ctx.fillStyle = isFacingBack ? '#94a3b8' : '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(-16, -26, 32, 19, 6);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tiang Antena
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.lineTo(0, -35);
        ctx.stroke();

        // Bola Antena Glowing
        ctx.fillStyle = robot.faceExpression === 'dead' ? '#ef4444' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -36, 4, 0, Math.PI * 2);
        ctx.fill();

        // Layar Visor Wajah / Belakang Helm
        if (!isFacingBack) {
            const visorOffset = isFacingRight ? 3 : -3;
            ctx.fillStyle = '#090d16';
            ctx.beginPath();
            ctx.roundRect(-11 + visorOffset, -23, 22, 13, 4);
            ctx.fill();

            // Lampu Sorot Samping (Headlight Lens)
            ctx.fillStyle = '#fde047';
            if (isFacingRight) {
                ctx.fillRect(11, -19, 3, 6);
            } else {
                ctx.fillRect(-14, -19, 3, 6);
            }

            // Mata LED Robot
            ctx.fillStyle = robot.faceExpression === 'dead' ? '#ef4444' : '#38bdf8';
            if (robot.faceExpression === 'happy') {
                ctx.font = 'bold 9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('^ ^', visorOffset, -14);
            } else if (robot.faceExpression === 'dead') {
                ctx.font = 'bold 9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('X X', visorOffset, -14);
            } else {
                ctx.fillRect(-5 + visorOffset, -19, 4, 5);
                ctx.fillRect(2 + visorOffset, -19, 4, 5);
            }
        } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-10, -22, 20, 6);
            ctx.fillStyle = '#fde047';
            if (isFacingRight) {
                ctx.fillRect(11, -22, 3, 6);
            } else {
                ctx.fillRect(-14, -22, 3, 6);
            }
        }

        ctx.restore();
    }

    static async animateFall(engine, targetX, targetY) {
        if (window.soundSystem) window.soundSystem.playFall();
        engine.robot.faceExpression = 'dead';
        engine.robot.gridX = targetX;
        engine.robot.gridY = targetY;

        const startTime = Date.now();
        const duration = 650;
        const startZ = engine.robot.gridZ;

        await new Promise(resolve => {
            const fallTimer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / duration);
                engine.robot.animZ = startZ - Math.pow(progress * 3.2, 2);

                if (Math.random() > 0.4) {
                    engine.addParticle(engine.robot.animX, engine.robot.animY, engine.robot.animZ, '#f43f5e', 3, 1.2);
                }

                if (progress >= 1) {
                    clearInterval(fallTimer);
                    resolve();
                }
            }, 16);
        });

        return { success: false, reason: 'Koinbot melangkah ke luar arena dan terjatuh ke jurang!', fell: true };
    }
}

window.RobotRenderer = RobotRenderer;
