/**
 * demoStages.js — Konfigurasi Panggung Demo Balok (Live Sandbox)
 * Pelataran luas 6x6 di Arena Utama untuk didemonstrasikan langsung oleh
 * pengajar di layar proyektor kelas (bebas dicoba, bergerak, & diulang).
 * Sama sekali tidak membocorkan teka-teki peta soal pada lembar fisik siswa.
 */

// Helper untuk membangun pelataran 6x6 persegi (36 ubin)
function createSquareGrid(size = 6, startX = 1, startY = 2, targetX = 4, targetY = 2, laserCols = []) {
    const tiles = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const isStart  = (x === startX && y === startY);
            const isTarget = (x === targetX && y === targetY);
            const hasLaser = laserCols.some(l => l.x === x && l.y === y);

            tiles.push({
                x, y, z: 0,
                type: isStart ? 'start' : 'normal',
                hasTarget: isTarget,
                targetNum: isTarget ? 1 : undefined,
                hasLaser: hasLaser ? true : undefined
            });
        }
    }
    return tiles;
}

const DEMO_STAGES = {
    // 1. Modul 1 / Level 1-2: MAJU & AMBIL (Pelataran Luas 6x6 Persegi)
    forward_grab: {
        id: 'demo-forward-grab',
        isDemoStage: true,
        mechanicKey: 'forward_grab',
        code: 'D1',
        name: 'Panggung Demo: MAJU & AMBIL (Arena 6×6)',
        conceptTitle: 'Peragaan: MAJU & AMBIL',
        conceptIcon: '🟢',
        tagTitle: 'PANGGUNG DEMO · GERAK DASAR',
        hint: 'Pelataran Luas 6×6: Bebas pasang balok MAJU & AMBIL di arena terbuka untuk peragaan ke siswa.',
        unlockedCommands: ['FORWARD', 'ACTIVATE'],
        maxBlocks: 12,
        introBriefing: {
            explanation: 'Pelataran luas 6×6 terbuka tanpa rintangan. Sangat cocok untuk memperagakan cara meletakkan balok MAJU dan AMBIL kristal di depan kelas.',
            realLifeAnalogy: '💡 Cara Peragaan: Setiap balok yang dijalankan akan melangkahkan robot. Robot akan tetap berada di posisinya agar guru bisa memasang balok lanjutan tanpa harus mengulang dari awal.',
            newUnlock: { icon: '⬆️', label: 'MAJU & AMBIL', desc: 'Melangkah lurus 1 petak dan mengaktifkan ubin kristal.' }
        },
        map: {
            startX: 1, startY: 2, startZ: 0, startDir: 1, // Hadap Timur ↘
            tiles: createSquareGrid(6, 1, 2, 4, 2)
        }
    },

    // 2. Modul 1 / Level 3-5: PUTAR KIRI / KANAN (Pelataran Luas 6x6 Persegi)
    turn: {
        id: 'demo-turn',
        isDemoStage: true,
        mechanicKey: 'turn',
        code: 'D2',
        name: 'Panggung Demo: PUTAR HALUAN (Arena 6×6)',
        conceptTitle: 'Peragaan: PUTAR HALUAN',
        conceptIcon: '🔄',
        tagTitle: 'PANGGUNG DEMO · ROTASI 90°',
        hint: 'Pelataran Luas 6×6: Peragakan balok PUTAR untuk mengubah haluan hadap robot 90° di tempat.',
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        maxBlocks: 14,
        introBriefing: {
            explanation: 'Pelataran luas 6×6 untuk memperagakan orientasi sudut pandang. Balok PUTAR KIRI atau KANAN memutar arah hadap robot 90° di tempat tanpa berpindah petak.',
            realLifeAnalogy: '💡 Cara Peragaan: Arah hadap robot menentukan ke mana robot melangkah saat balok MAJU berikutnya dijalankan.',
            newUnlock: { icon: '🔄', label: 'PUTAR KIRI & KANAN', desc: 'Memutar arah hadap robot 90 derajat searah atau berlawanan jarum jam.' }
        },
        map: {
            startX: 1, startY: 1, startZ: 0, startDir: 1, // Hadap Timur ↘
            tiles: createSquareGrid(6, 1, 1, 3, 3)
        }
    },

    // 3. Modul 2 / Level 6-7: LOMPAT JURANG (Arena 6x6 dengan Celah Jurang)
    jump: {
        id: 'demo-jump',
        isDemoStage: true,
        mechanicKey: 'jump',
        code: 'D3',
        name: 'Panggung Demo: LOMPAT JURANG (Arena 6×6)',
        conceptTitle: 'Peragaan: LOMPAT JURANG',
        conceptIcon: '🦘',
        tagTitle: 'PANGGUNG DEMO · LOMPAT SPASIAL',
        hint: 'Pelataran Celah Jurang 6×6: Peragakan lompatan menyeberangi celah jurang kosong langsung ke seberang.',
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        maxBlocks: 12,
        introBriefing: {
            explanation: 'Pelataran 6×6 yang dibelah oleh celah jurang kosong selebar 1 petak. Peragakan ke siswa bahwa balok MAJU biasa akan jatuh, sedangkan balok LOMPAT dapat melompati celah jurang langsung ke seberang.',
            realLifeAnalogy: '💡 Cara Peragaan: Balok LOMPAT melompati tepat 1 petak celah kosong atau naik ke undakan yang lebih tinggi.',
            newUnlock: { icon: '🦘', label: 'LOMPAT', desc: 'Melompati 1 petak celah jurang kosong ke seberang.' }
        },
        map: {
            startX: 1, startY: 2, startZ: 0, startDir: 1, // Hadap Timur ↘
            tiles: (() => {
                const tiles = [];
                for (let x = 0; x <= 1; x++) {
                    for (let y = 0; y < 6; y++) {
                        tiles.push({ x, y, z: 0, type: (x === 1 && y === 2) ? 'start' : 'normal' });
                    }
                }
                for (let x = 3; x < 6; x++) {
                    for (let y = 0; y < 6; y++) {
                        const isTarget = (x === 3 && y === 2);
                        tiles.push({
                            x, y, z: 0,
                            type: 'normal',
                            hasTarget: isTarget,
                            targetNum: isTarget ? 1 : undefined
                        });
                    }
                }
                return tiles;
            })()
        }
    },

    // 4. Modul 2 / Level 8-10: TUNDUK DI BAWAH LASER (Arena 6x6 dengan Tiang Laser)
    duck: {
        id: 'demo-duck',
        isDemoStage: true,
        mechanicKey: 'duck',
        code: 'D4',
        name: 'Panggung Demo: TUNDUK DI BAWAH LASER (Arena 6×6)',
        conceptTitle: 'Peragaan: TUNDUK LASER',
        conceptIcon: '⚡',
        tagTitle: 'PANGGUNG DEMO · RINTANGAN LASER',
        hint: 'Pelataran Gapura Laser 6×6: Peragakan robot merunduk & meluncur aman di bawah tiang sinar laser.',
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'ACTIVATE'],
        maxBlocks: 12,
        introBriefing: {
            explanation: 'Pelataran 6×6 dengan barisan tiang gapura sinar laser aktif. Tunjukkan ke siswa bahwa berjalan biasa akan membentur sensor laser, tetapi dengan balok TUNDUK, robot akan merunduk meluncur mulus di bawah sinar laser.',
            realLifeAnalogy: '💡 Cara Peragaan: Balok TUNDUK meluncurkan robot melewati petak yang memiliki laser aktif tanpa menyentuh sensor.',
            newUnlock: { icon: '🛡️', label: 'TUNDUK / SLIDE', desc: 'Merunduk meluncur aman di bawah sorotan sinar laser.' }
        },
        map: {
            startX: 1, startY: 2, startZ: 0, startDir: 1, // Hadap Timur ↘
            tiles: createSquareGrid(6, 1, 2, 3, 2, [
                { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }
            ])
        }
    },

    // 5. Modul 3 / Level 11-20: LOOP (Arena 6x6 Koridor Runway)
    loop: {
        id: 'demo-loop',
        isDemoStage: true,
        mechanicKey: 'loop',
        code: 'D5',
        name: 'Panggung Demo: PERULANGAN LOOP (Arena 6×6)',
        conceptTitle: 'Peragaan: PERULANGAN LOOP',
        conceptIcon: '🔁',
        tagTitle: 'PANGGUNG DEMO · C-CLAMP LOOP',
        hint: 'Pelataran Luas 6×6: Peragakan balok apitan ULANGI untuk menempuh petak lurus secara otomatis.',
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        maxBlocks: 12,
        introBriefing: {
            explanation: 'Pelataran 6×6 koridor lurus panjang. Peragakan ke siswa betapa hematnya menggunakan balok apitan ULANGI daripada menaruh balok MAJU berkali-kali secara manual.',
            realLifeAnalogy: '💡 Cara Peragaan: Masukkan balok aksi ke dalam badan ULANGI dan atur angka putaran X (+/-) untuk otomatisasi langkah.',
            newUnlock: { icon: '🔁', label: 'ULANGI X KALI', desc: 'Mengeksekusi semua balok di dalam jepitannya sebanyak angka putaran.' }
        },
        map: {
            startX: 0, startY: 2, startZ: 0, startDir: 1, // Hadap Timur ↘
            tiles: createSquareGrid(6, 0, 2, 5, 2)
        }
    }
};

/**
 * Mencari stage demo yang sesuai berdasarkan Level ID saat ini.
 */
function getDemoStageForLevel(levelId) {
    if (levelId === 1 || levelId === 2) return DEMO_STAGES.forward_grab;
    if (levelId >= 3 && levelId <= 5)   return DEMO_STAGES.turn;
    if (levelId === 6 || levelId === 7) return DEMO_STAGES.jump;
    if (levelId >= 8 && levelId <= 10)  return DEMO_STAGES.duck;
    if (levelId >= 11)                  return DEMO_STAGES.loop;
    return null;
}

const DEMO_STAGE_LIST = [
    {
        key: 'forward_grab',
        code: 'D1',
        icon: '🟢',
        title: 'Maju & Ambil',
        shortLabel: 'Maju',
        tag: 'Gerak Dasar'
    },
    {
        key: 'turn',
        code: 'D2',
        icon: '🔄',
        title: 'Putar Haluan',
        shortLabel: 'Putar',
        tag: 'Rotasi 90°'
    },
    {
        key: 'jump',
        code: 'D3',
        icon: '🦘',
        title: 'Lompat Jurang',
        shortLabel: 'Lompat',
        tag: 'Celah Jurang'
    },
    {
        key: 'duck',
        code: 'D4',
        icon: '⚡',
        title: 'Tunduk Laser',
        shortLabel: 'Laser',
        tag: 'Tiang Laser'
    },
    {
        key: 'loop',
        code: 'D5',
        icon: '🔁',
        title: 'Perulangan Loop',
        shortLabel: 'Loop',
        tag: 'Balok Ulangi'
    }
];

window.DEMO_STAGES = DEMO_STAGES;
window.DEMO_STAGE_LIST = DEMO_STAGE_LIST;
window.getDemoStageForLevel = getDemoStageForLevel;
