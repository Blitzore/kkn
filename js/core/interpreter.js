/**
 * interpreter.js - Mesin Eksekutor Kode Komputasional ALGO-BOT
 * Mampu mengeksekusi runtutan instruksi (Sequence), aksi rintangan (Lompat & Tunduk),
 * Blok Penjepit Percabangan Kondisi (IF-ELSE Gaya Code.org),
 * Blok Penjepit Perulangan (LOOP Gaya Code.org dengan custom X),
 * dan pemanggilan fungsi modular (F1).
 */

class CodeInterpreter {
    constructor(canvasEngine, soundSystem) {
        this.engine = canvasEngine;
        this.audio = soundSystem;
        this.isExecuting = false;
        this.currentStepIdx = 0;
        this.currentLocation = 'main'; // 'main' atau 'function'
    }

    /** Mendeteksi rintangan 1 langkah di depan robot */
    detectFrontHazard() {
        const deltas = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];
        const step = deltas[this.engine.robot.dir];
        const front1X = this.engine.robot.gridX + step.dx;
        const front1Y = this.engine.robot.gridY + step.dy;
        const front1Tile = this.engine.mapData.tiles.find(t => t.x === front1X && t.y === front1Y);

        const front2X = this.engine.robot.gridX + step.dx * 2;
        const front2Y = this.engine.robot.gridY + step.dy * 2;
        const front2Tile = this.engine.mapData.tiles.find(t => t.x === front2X && t.y === front2Y);

        let isGap = (!front1Tile && front2Tile) || (front1Tile && front1Tile.hazardType === 'gap');
        let isLaser = (front1Tile && front1Tile.hasLaser && !front1Tile.laserDisabled) || (front1Tile && front1Tile.hazardType === 'laser');

        const curTile = this.engine.mapData.tiles.find(
            t => t.x === this.engine.robot.gridX && t.y === this.engine.robot.gridY
        );
        const sensor = (front1Tile && (front1Tile.type === 'sensor_mystery' || front1Tile.type === 'sensor_dynamic')) ? front1Tile :
                       (curTile && (curTile.type === 'sensor_mystery' || curTile.type === 'sensor_dynamic') ? curTile : null);

        if (sensor) {
            if (sensor.hazardType === 'laser' || sensor.currentColor === 'red') {
                return 'laser';
            } else if (sensor.hazardType === 'gap' || sensor.currentColor === 'blue') {
                return 'gap';
            }
        }

        if (isGap) return 'gap';
        if (isLaser) return 'laser';
        return 'none';
    }

    async executeSingleCommand(cmdId, functionSequence = [], onLog = () => {}) {
        if (!cmdId) return { success: true };

        // 1. Eksekusi Dasar: Maju
        if (cmdId === 'FORWARD') {
            this.audio.playStep();
            return await this.engine.moveForward();
        }

        // 2. Eksekusi Dasar: Belok
        if (cmdId === 'TURN_LEFT') {
            this.audio.playTurn();
            return await this.engine.turnLeft();
        }
        if (cmdId === 'TURN_RIGHT') {
            this.audio.playTurn();
            return await this.engine.turnRight();
        }

        // 3. Halangan 1: Melompati Celah Jurang
        if (cmdId === 'JUMP') {
            this.audio.playJump();
            const res = await this.engine.jump();
            if (res.inPlace && onLog) {
                onLog('🦘 Robot melompat di tempat — jalan di depan datar, gunakan MAJU!', 'running');
            }
            return res;
        }

        // 4. Halangan 2: Merunduk Meluncur di Bawah Laser
        if (cmdId === 'DUCK') {
            if (this.audio && this.audio.playDuck) this.audio.playDuck();
            return await this.engine.duck();
        }

        // 5. Eksekusi Dasar: Ambil Kristal / Saklar
        if (cmdId === 'ACTIVATE') {
            this.audio.playCrystal();
            const res = await this.engine.activateCurrentTile();
            if (res.success && res.item === 'switch') {
                const laserTile = this.engine.mapData.tiles.find(t => t.hasLaser);
                if (laserTile) laserTile.laserDisabled = true;
            }
            return res;
        }

        // 6. Konsep Modularitas: FUNCTION F1
        if (cmdId === 'CALL_F1') {
            if (!functionSequence || functionSequence.length === 0) {
                onLog('⚠️ Kotak F1 masih kosong! Masukkan balok ke dalam Kotak F1.', 'error');
                return { success: false, reason: 'Kotak Fungsi F1 belum diisi balok!' };
            }

            onLog('📦 Menjalankan sub-rutin Kotak F1...', 'running');
            for (let f = 0; f < functionSequence.length; f++) {
                const fCmd = functionSequence[f];
                const res = await this.executeSingleCommand(fCmd, [], onLog);
                if (!res.success) return res;
                await this.engine.waitAnim(160);
            }
            return { success: true };
        }

        return { success: true };
    }

    /** Eksekusi rekursif untuk balok tunggal maupun balok penjepit (Loop & If-Else) */
    async executeBlockItem(item, functionSequence, callbacks = {}, path = '0') {
        if (!item) return { success: true };
        const { onStepActive = () => {}, onLog = () => {} } = callbacks;

        // A. Perintah Tunggal (String atau Objek Standar)
        if (typeof item === 'string') {
            onStepActive(path, 'main');
            return await this.executeSingleCommand(item, functionSequence, onLog);
        }

        // B. Blok Penjepit: LOOP (Ulangi X Kali)
        if (item.type === 'loop') {
            if (typeof item.count !== 'number' || item.count <= 0) {
                onLog('⚠️ Jumlah perulangan X pada balok ULANGI belum diatur! Tentukan angkanya (+/-).', 'error');
                return { success: false, reason: 'Jumlah perulangan X pada balok ULANGI belum ditentukan!' };
            }
            const count = item.count;
            const body = Array.isArray(item.body) ? item.body : [];

            if (body.length === 0) {
                onLog('⚠️ Balok ULANGI masih kosong! Masukkan balok ke dalamnya.', 'error');
                return { success: true };
            }

            onLog(`🔁 Memulai Loop [${count}x]: mengulang ${body.length} instruksi`, 'running');
            for (let r = 0; r < count; r++) {
                onLog(`🔁 Putaran loop ke-${r + 1} dari ${count}`, 'running');
                for (let b = 0; b < body.length; b++) {
                    const subPath = `${path}.body.${b}`;
                    onStepActive(subPath, 'main');
                    const res = await this.executeBlockItem(body[b], functionSequence, callbacks, subPath);
                    if (!res.success) return res;
                    await this.engine.waitAnim(160);
                }
            }
            return { success: true };
        }

        // C. Blok Penjepit: IF-ELSE (Jika - Lainnya)
        if (item.type === 'if_else') {
            const hazard = this.detectFrontHazard();
            const ifBody = Array.isArray(item.ifBody) ? item.ifBody : [];
            const elseBody = Array.isArray(item.elseBody) ? item.elseBody : [];

            if (hazard === 'gap') {
                onLog('🔀 Terdeteksi [CELAH JURANG]! Cabang JIKA dieksekusi ➔', 'running');
                if (ifBody.length === 0) {
                    onLog('⚠️ Cabang JIKA masih kosong!', 'error');
                }
                for (let b = 0; b < ifBody.length; b++) {
                    const subPath = `${path}.if.${b}`;
                    onStepActive(subPath, 'main');
                    const res = await this.executeBlockItem(ifBody[b], functionSequence, callbacks, subPath);
                    if (!res.success) return res;
                    await this.engine.waitAnim(160);
                }
                return { success: true };
            } else if (hazard === 'laser') {
                onLog('🔀 Terdeteksi [SINAR LASER]! Cabang LAINNYA dieksekusi ➔', 'running');
                if (elseBody.length === 0) {
                    onLog('⚠️ Cabang LAINNYA masih kosong!', 'error');
                }
                for (let b = 0; b < elseBody.length; b++) {
                    const subPath = `${path}.else.${b}`;
                    onStepActive(subPath, 'main');
                    const res = await this.executeBlockItem(elseBody[b], functionSequence, callbacks, subPath);
                    if (!res.success) return res;
                    await this.engine.waitAnim(160);
                }
                return { success: true };
            } else {
                onLog('🔀 Jalur depan aman! Melangkah ➔ [MAJU]', 'running');
                this.audio.playStep();
                return await this.engine.moveForward();
            }
        }

        // Fallback untuk objek biasa
        if (item.id) {
            onStepActive(path, 'main');
            return await this.executeSingleCommand(item.id, functionSequence, onLog);
        }

        return { success: true };
    }

    async runProgram(mainSequence, functionSequence, callbacks = {}) {
        if (this.isExecuting) return;
        this.isExecuting = true;

        const {
            onStepActive = () => {},
            onLog = () => {},
            onComplete = () => {}
        } = callbacks;

        for (let i = 0; i < mainSequence.length; i++) {
            const item = mainSequence[i];
            const res = await this.executeBlockItem(item, functionSequence, callbacks, `${i}`);
            if (!res.success) {
                this.isExecuting = false;
                onComplete(res);
                return;
            }
            await this.engine.waitAnim(180);
        }

        this.isExecuting = false;
        onStepActive(-1, 'main');
        onComplete({ success: true, finished: true });
    }
}

window.CodeInterpreter = CodeInterpreter;
