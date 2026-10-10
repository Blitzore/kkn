/**
 * levels.js - Data Lengkap 20 Level Petualangan Koding ALGO-BOT
 * Kurikulum Progresif Berjenjang Murni (Strictly Progressive Difficulty):
 * - Setiap naik level, ARENA SEMAKIN LUAS dan JUMLAH LANTAI SEMAKIN BANYAK!
 * - Modul 1: Algoritma Runtutan & Orientasi Arah (Level 1 - 5: 3 s/d 13 Ubin)
 * - Modul 2: Dinamika Halangan Spasial (Level 6 - 10: 15 s/d 25 Ubin)
 * - Modul 3: Perulangan Loop Berapit C-Clamp (Level 11 - 15: 22 s/d 34 Ubin)
 * - Modul 4: Master Debugging & Grand Championship (Level 16 - 20: 28 s/d 42 Ubin)
 *
 * *Sistem Ambang Bintang Efisiensi (Unified 3-Star Tiers):
 * - ⭐ 1 Bintang: LULUS (Semua kristal terambil & robot selamat)
 * - ⭐⭐ 2 Bintang: CERDAS (Kode efisien <= star2Blocks)
 * - ⭐⭐⭐ 3 Bintang: MASTER (Rekor optimal terhemat <= star3Blocks)
 */

const GAME_LEVELS = [
    // ==========================================
    // MODUL 1: RUNTUTAN & ORIENTASI ARAH (LEVEL 1 - 5)
    // ==========================================
    {
        id: 1,
        moduleId: 1,
        moduleName: 'Modul 1: Runtutan & Orientasi',
        name: 'Langkah Pertama',
        conceptTitle: 'Apa itu Algoritma?',
        conceptIcon: '🧩',
        introBriefing: {
            headline: 'Komputer Berpikir Secara Berurutan!',
            explanation: 'Komputer menjalankan instruksi dari atas ke bawah secara berurutan. Pandu robot melangkah menuju kristal energi dan kumpulkan kristal tersebut!',
            realLifeAnalogy: '💡 Seperti resep masak: urutan langkah tidak boleh tertukar.',
            newUnlock: { label: 'MAJU & AMBIL', icon: '⬆️ ⭐', desc: 'Perintah melangkah lurus dan mengambil kristal.' }
        },
        hint: 'Capai dan kumpulkan kristal energi di ujung lintasan.',
        maxStars: 3,
        star3Blocks: 3,
        star2Blocks: 4,
        optimalBlocks: 3,
        maxBlocks: 6,
        unlockedCommands: ['FORWARD', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1, // East ↘
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 1 }
            ]
        }
    },
    {
        id: 2,
        moduleId: 1,
        moduleName: 'Modul 1: Runtutan & Orientasi',
        name: 'Jejak Dua Kristal',
        conceptTitle: 'Runtutan Langkah & Multi-Objek',
        conceptIcon: '📏',
        introBriefing: {
            headline: 'Mengambil Kristal di Sepanjang Jalan',
            explanation: 'Ada dua kristal energi di lintasan yang semakin panjang. Hitung langkah robot dengan cermat agar semua kristal berhasil diambil!',
            realLifeAnalogy: '💡 Seperti memetik buah: petik buah pertama, melangkah lagi, lalu petik buah kedua.'
        },
        hint: 'Kumpulkan seluruh kristal energi di lintasan lurus.',
        maxStars: 3,
        star3Blocks: 6,
        star2Blocks: 7,
        optimalBlocks: 6,
        maxBlocks: 8,
        unlockedCommands: ['FORWARD', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 2 }
            ]
        }
    },
    {
        id: 3,
        moduleId: 1,
        moduleName: 'Modul 1: Runtutan & Orientasi',
        name: 'Simpang Belok Presisi',
        conceptTitle: 'Sudut & Orientasi Spasial 90°',
        conceptIcon: '🧭',
        introBriefing: {
            headline: 'Kemudikan Robot: Kiri atau Kanan?',
            explanation: 'Robot bergerak relatif terhadap arah hadapnya. Gunakan balok putar untuk mengubah haluan robot menavigasi tikungan tajam 90°!',
            realLifeAnalogy: '💡 Seperti mengemudi: belok kiri ke arah kiri robot, belok kanan ke arah kanan robot!',
            newUnlock: { label: 'PUTAR KIRI & PUTAR KANAN', icon: '↩️ ↪️', desc: 'Mengubah arah hadap robot 90° ke kiri atau ke kanan.' }
        },
        hint: 'Arahkan robot melewati tikungan menuju kristal energi.',
        maxStars: 3,
        star3Blocks: 7,
        star2Blocks: 8,
        optimalBlocks: 7,
        maxBlocks: 12,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Ubin pelataran samping
                { x: 3, y: 0, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 4,
        moduleId: 1,
        moduleName: 'Modul 1: Runtutan & Orientasi',
        name: 'Simpang Dua Cabang',
        conceptTitle: 'Analisis Jalur Alternatif',
        conceptIcon: '🔀',
        introBriefing: {
            headline: 'Dua Pilihan Jalan Menuju Kristal!',
            explanation: 'Di persimpangan jalan, robot bisa memilih rute pendek langsung atau rute memutar yang panjang. Pilihlah rute yang paling hemat balok!',
            realLifeAnalogy: '💡 Seperti memilih jalan pulang: jalan pintas lebih cepat sampai daripada jalan memutar.'
        },
        hint: 'Pilih jalur paling efisien untuk menjangkau kristal.',
        maxStars: 3,
        star3Blocks: 9,
        star2Blocks: 11,
        optimalBlocks: 9,
        maxBlocks: 14,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        map: {
            startX: 0, startY: 2, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 2, z: 0, type: 'start' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                // Cabang Pendek (Atas): butuh 9 balok
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Cabang Memutar (Bawah): butuh 11 balok
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 4, z: 0, type: 'normal' },
                { x: 2, y: 4, z: 0, type: 'normal' },
                { x: 3, y: 4, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 5,
        moduleId: 1,
        moduleName: 'Modul 1: Runtutan & Orientasi',
        name: 'Labirin Zig-Zag',
        conceptTitle: 'Rangkaian Tikungan Beruntun (Ujian Modul 1)',
        conceptIcon: '⚡',
        introBriefing: {
            headline: 'Manuver Sirkuit Berliku',
            explanation: 'Lintasan berliku membutuhkan ketelitian arah belok yang tinggi. Kumpulkan kedua kristal di ujung tikungan tanpa salah arah!',
            realLifeAnalogy: '💡 Seperti mengemudikan mobil di sirkuit balap zig-zag.'
        },
        hint: 'Koleksi seluruh kristal pada rute zig-zag.',
        maxStars: 3,
        star3Blocks: 14,
        star2Blocks: 16,
        optimalBlocks: 14,
        maxBlocks: 20,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Ubin lantai sirkuit
                { x: 0, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' }
            ]
        }
    },

    // ==========================================
    // MODUL 2: DINAMIKA HALANGAN SPASIAL (LEVEL 6 - 10)
    // ==========================================
    {
        id: 6,
        moduleId: 2,
        moduleName: 'Modul 2: Dinamika Halangan Spasial',
        name: 'Jembatan Celah Jurang Berkelok',
        conceptTitle: 'Halangan 1: Melompati Celah Jurang Spasial',
        conceptIcon: '🦘',
        introBriefing: {
            headline: 'Jembatan Megah Terputus Celah Jurang!',
            explanation: 'Arena semakin luas! Jembatan di depan terputus oleh celah jurang kosong dan berbelok menuju platform seberang. Gunakan balok LOMPAT untuk melompati celah 1 petak!',
            realLifeAnalogy: '💡 Seperti melangkah lalu melompati celah jembatan kayu.',
            newUnlock: { label: 'LOMPAT', icon: '🦘', desc: 'Melompati celah kosong 1 petak atau menaiki ubin tinggi.' }
        },
        hint: 'Seberangi celah jurang untuk mencapai kristal.',
        maxStars: 3,
        star3Blocks: 10,
        star2Blocks: 12,
        optimalBlocks: 10,
        maxBlocks: 16,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                // Jurang 1 di x:3 -> lompat ke x:4
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                // Jurang 2 di y:3 -> lompat ke y:4
                { x: 4, y: 4, z: 0, type: 'normal' },
                { x: 5, y: 4, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Ubin penyangga dermaga & tepi jembatan (total 15 ubin)
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 4, z: 0, type: 'normal' },
                { x: 4, y: 5, z: 0, type: 'normal' },
                { x: 5, y: 5, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 7,
        moduleId: 2,
        moduleName: 'Modul 2: Dinamika Halangan Spasial',
        name: 'Taktik Potong Jurang Danau',
        conceptTitle: 'Lompat Pintas vs Jalur Keliling Darat',
        conceptIcon: '🌉',
        introBriefing: {
            headline: 'Lompat Pintas Menghemat Banyak Balok!',
            explanation: 'Arena danau jurang yang luas! Kamu bisa berjalan memutar lewat jalan darat keliling yang panjang (13 balok), atau melompat langsung menyeberangi celah jurang di dermaga (hanya 3 balok)!',
            realLifeAnalogy: '💡 Melompati jembatan putus langsung sampai ke seberang tanpa harus keliling danau.'
        },
        hint: 'Temukan jalur terefisien melintasi area rintangan.',
        maxStars: 3,
        star3Blocks: 3,
        star2Blocks: 8,
        optimalBlocks: 3,
        maxBlocks: 18,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                // Rute Memutar Darat Keliling
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                // Target seberang jurang (dari (0,0) arah selatan ada celah jurang di (0,1))
                { x: 0, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Dermaga danau ekstra lantai (total 18 ubin)
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 3, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 0, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 8,
        moduleId: 2,
        moduleName: 'Modul 2: Dinamika Halangan Spasial',
        name: 'Koridor Laser & Tikungan Ganda',
        conceptTitle: 'Halangan 2: Sinar Laser Aktif',
        conceptIcon: '🧎',
        introBriefing: {
            headline: 'Waspada Sinar Laser Pengaman!',
            explanation: 'Sinar laser menyala setinggi badan robot di beberapa pos koridor. Gunakan balok TUNDUK untuk merunduk dan meluncur di bawah sinar laser, lalu belok kumpulkan 2 kristal!',
            realLifeAnalogy: '💡 Seperti merunduk di bawah palang pintu gerbang kereta yang turun.',
            newUnlock: { label: 'TUNDUK', icon: '🧎', desc: 'Merunduk dan meluncur di bawah sinar laser pengaman.' }
        },
        hint: 'Waspadai dinding laser pengaman di sepanjang koridor.',
        maxStars: 3,
        star3Blocks: 17,
        star2Blocks: 19,
        optimalBlocks: 17,
        maxBlocks: 24,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal', hasLaser: true },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal', hasLaser: true },
                { x: 4, y: 3, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 3, y: 3, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Lantai pendukung perimeter (total 20 ubin)
                { x: 0, y: 1, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 0, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 9,
        moduleId: 2,
        moduleName: 'Modul 2: Dinamika Halangan Spasial',
        name: 'Kombinasi Jurang & Laser Terpadu',
        conceptTitle: 'Koordinasi Dua Halangan Berbeda',
        conceptIcon: '⚔️',
        introBriefing: {
            headline: 'Menghadapi Jurang dan Laser Bersamaan',
            explanation: 'Lintasan luas memiliki celah jurang kosong DAN sinar laser pengaman. Ingat: jurang dihadapi dengan LOMPAT, laser dihadapi dengan TUNDUK!',
            realLifeAnalogy: '💡 Seperti rintangan halang rintang: lompat pagar lalu merayap di bawah jaring!'
        },
        hint: 'Navigasikan kombinasi jurang dan laser pengaman.',
        maxStars: 3,
        star3Blocks: 15,
        star2Blocks: 17,
        optimalBlocks: 15,
        maxBlocks: 22,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                // Jurang 1 di x:2 -> lompat ke x:3
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal', hasLaser: true },
                { x: 3, y: 3, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 4, y: 3, z: 0, type: 'normal' },
                // Jurang 2 di x:5 -> lompat ke x:6
                { x: 6, y: 3, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 6, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Ubin lantai pelataran (total 22 ubin)
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 10,
        moduleId: 2,
        moduleName: 'Modul 2: Dinamika Halangan Spasial',
        name: 'Benteng Rintangan Ganda',
        conceptTitle: 'Sirkuit Dua Halangan (Ujian Modul 2)',
        conceptIcon: '🏰',
        introBriefing: {
            headline: 'Benteng Rintangan Tiga Kristal!',
            explanation: 'Benteng besar memiliki 3 kristal energi yang dijaga oleh 2 jurang dan 2 dinding laser. Rencanakan seluruh koordinasi gerak sebelum melangkah!',
            realLifeAnalogy: '💡 Menganalisis peta benteng secara menyeluruh untuk menemukan rute terbaik.'
        },
        hint: 'Kumpulkan ketiga kristal di antara kombinasi rintangan.',
        maxStars: 3,
        star3Blocks: 14,
        star2Blocks: 16,
        optimalBlocks: 14,
        maxBlocks: 24,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'ACTIVATE'],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 1, z: 0, type: 'start' },
                { x: 1, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 2, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Jurang 1 di (2,2) -> lompat ke (2,3)
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                { x: 4, y: 3, z: 0, type: 'normal', hasLaser: true },
                { x: 5, y: 3, z: 0, type: 'normal' },
                // Jurang 2 di (5,2) -> lompat ke (5,1)
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                // Ubin labirin benteng (total 25 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 0, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 5, y: 4, z: 0, type: 'normal' },
                { x: 4, y: 4, z: 0, type: 'normal' },
                { x: 3, y: 4, z: 0, type: 'normal' }
            ]
        }
    },

    // ==========================================
    // MODUL 3: PERULANGAN LOOP BERAPIT (LEVEL 11 - 15)
    // ==========================================
    {
        id: 11,
        moduleId: 3,
        moduleName: 'Modul 3: Perulangan Loop Berapit',
        name: 'Koridor Panjang: Cari Angka X',
        conceptTitle: 'Efisiensi Angka Perulangan',
        conceptIcon: '🔁',
        introBriefing: {
            headline: 'Tulis Sekali, Ulangi Berkali-kali!',
            explanation: 'Arena koridor membentang sepanjang 6 petak! Gunakan balok kontainer ULANGI gaya Code.org yang mengapit balok MAJU. Atur jumlah putaran X sendiri dengan tombol [+] atau [-]!',
            realLifeAnalogy: '💡 Seperti mengetuk pintu: daripada bilang "ketuk 6 kali secara terpisah", cukup pakai perulangan 6x.',
            newUnlock: { label: 'ULANGI', icon: '🔁', desc: 'Mengapit instruksi di dalamnya dan mengulanginya sebanyak X kali.' }
        },
        hint: 'Gunakan balok perulangan untuk menempuh koridor panjang.',
        maxStars: 3,
        star3Blocks: 3,
        star2Blocks: 5,
        optimalBlocks: 3,
        maxBlocks: 10,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                // Runway utama (7 ubin)
                { x: 0, y: 1, z: 0, type: 'start' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Pelataran megah di sekeliling koridor (total 22 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 1, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 12,
        moduleId: 3,
        moduleName: 'Modul 3: Perulangan Loop Berapit',
        name: 'Loop Multi-Aksi: Ritme Halangan',
        conceptTitle: 'Loop Mengulang Gerak + Lompat',
        conceptIcon: '🦘',
        introBriefing: {
            headline: 'Mengapit Lebih dari Satu Perintah!',
            explanation: 'Lintasan panjang kepulauan jurang menantimu! Masukkan balok MAJU dan LOMPAT ke dalam loop untuk melompati deretan 3 celah jurang berirama secara elegan!',
            realLifeAnalogy: '💡 Seperti irama tari: [Langkah - Lompat] diulang 3 kali berturut-turut.'
        },
        hint: 'Temukan pola berulang untuk melompati deretan jurang.',
        maxStars: 3,
        star3Blocks: 4,
        star2Blocks: 6,
        optimalBlocks: 4,
        maxBlocks: 14,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                // Celah 1 di x:2 -> mendarat di x:3
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                // Celah 2 di x:5 -> mendarat di x:6
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 7, y: 0, z: 0, type: 'normal' },
                // Celah 3 di x:8 -> mendarat di x:9
                { x: 9, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Pelataran kepulauan danau (total 25 ubin)
                { x: 0, y: 1, z: 0, type: 'normal' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal' },
                { x: 7, y: 1, z: 0, type: 'normal' },
                { x: 9, y: 1, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 2, z: 0, type: 'normal' },
                { x: 9, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 8, y: 2, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 13,
        moduleId: 3,
        moduleName: 'Modul 3: Perulangan Loop Berapit',
        name: 'Loop Persegi Mengelilingi Taman',
        conceptTitle: 'Loop Mengelilingi 4 Sisi Persegi',
        conceptIcon: '🔄',
        introBriefing: {
            headline: 'Sirkuit Persegi Empat Kristal!',
            explanation: 'Sirkuit besar mengelilingi taman kristal. Setiap sudut memiliki kristal energi. Manfaatkan pola perulangan untuk mengitari area taman dengan hemat balok!',
            realLifeAnalogy: '💡 Berlari mengitari lapangan 4 sisi dengan ritme yang sama.'
        },
        hint: 'Identifikasi pola putaran untuk mengitari area taman.',
        maxStars: 3,
        star3Blocks: 5,
        star2Blocks: 8,
        optimalBlocks: 5,
        maxBlocks: 18,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                // Sisi 1 (Utara)
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Sisi 2 (Timur)
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Sisi 3 (Selatan)
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                // Sisi 4 (Barat)
                { x: 0, y: 1, z: 0, type: 'normal' },
                // Lantai taman di dalam & perimeter luar (total 28 ubin)
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 0, y: -1, z: 0, type: 'normal' },
                { x: 1, y: -1, z: 0, type: 'normal' },
                { x: 2, y: -1, z: 0, type: 'normal' },
                { x: 0, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: -1, y: -1, z: 0, type: 'normal' },
                { x: 3, y: -1, z: 0, type: 'normal' },
                { x: -1, y: 3, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal' },
                { x: 1, y: -2, z: 0, type: 'normal' },
                { x: 1, y: 4, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 14,
        moduleId: 3,
        moduleName: 'Modul 3: Perulangan Loop Berapit',
        name: 'Sirkuit Maraton Laser Berirama',
        conceptTitle: 'Loop Mengulang Halangan Laser 4 Pos',
        conceptIcon: '⚡',
        introBriefing: {
            headline: 'Tantangan Loop Penjelajah Laser!',
            explanation: 'Empat pos laser menjaga kristal energi di koridor panjang. Temukan ritme gerakan berulang untuk menembus semua pos rintangan!',
            realLifeAnalogy: '💡 Seperti atlet senam: melakukan rangkaian gerak meluncur dan meraih sasaran secara berirama.'
        },
        hint: 'Gunakan perulangan untuk menembus deretan pos laser.',
        maxStars: 3,
        star3Blocks: 4,
        star2Blocks: 7,
        optimalBlocks: 4,
        maxBlocks: 16,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                // Jalur Utama Laser Runway (9 ubin)
                { x: 0, y: 1, z: 0, type: 'start' },
                { x: 1, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 2, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 3, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 4, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                { x: 5, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 6, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                { x: 7, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 8, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 4 },
                // Pelataran laboratorium perimeter (total 30 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 7, y: 0, z: 0, type: 'normal' },
                { x: 8, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 2, z: 0, type: 'normal' },
                { x: 8, y: 2, z: 0, type: 'normal' },
                { x: 9, y: 1, z: 0, type: 'normal' },
                { x: 9, y: 0, z: 0, type: 'normal' },
                { x: 9, y: 2, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 15,
        moduleId: 3,
        moduleName: 'Modul 3: Perulangan Loop Berapit',
        name: 'Marathon Rintangan Silang Akbar',
        conceptTitle: 'Kombo Loop Jurang & Laser (Ujian Modul 3)',
        conceptIcon: '👑',
        introBriefing: {
            headline: 'Ujian Puncak Loop: Tiga Benteng Rintangan!',
            explanation: 'Tiga benteng rintangan kembar menjaga kristal energi. Analisis kombinasi gerakan yang terulang lalu satukan dalam satu loop!',
            realLifeAnalogy: '💡 Menjalankan kombo gerak berulang dengan irama yang konsisten.'
        },
        hint: 'Kombinasikan aksi dalam perulangan untuk rintangan majemuk.',
        maxStars: 3,
        star3Blocks: 5,
        star2Blocks: 8,
        optimalBlocks: 5,
        maxBlocks: 18,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 1, z: 0, type: 'start' },
                // Benteng 1: Jurang di x:1 -> mendarat di x:2, laser di x:3, kristal di x:4
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 4, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Benteng 2: Jurang di x:5 -> mendarat di x:6, laser di x:7, kristal di x:8
                { x: 6, y: 1, z: 0, type: 'normal' },
                { x: 7, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 8, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Benteng 3: Jurang di x:9 -> mendarat di x:10, laser di x:11, kristal di x:12
                { x: 10, y: 1, z: 0, type: 'normal' },
                { x: 11, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 12, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                // Pelataran benteng megah (total 34 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 7, y: 0, z: 0, type: 'normal' },
                { x: 8, y: 0, z: 0, type: 'normal' },
                { x: 10, y: 0, z: 0, type: 'normal' },
                { x: 11, y: 0, z: 0, type: 'normal' },
                { x: 12, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 2, z: 0, type: 'normal' },
                { x: 8, y: 2, z: 0, type: 'normal' },
                { x: 10, y: 2, z: 0, type: 'normal' },
                { x: 11, y: 2, z: 0, type: 'normal' },
                { x: 12, y: 2, z: 0, type: 'normal' },
                { x: 13, y: 1, z: 0, type: 'normal' },
                { x: 13, y: 0, z: 0, type: 'normal' },
                { x: 13, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' }
            ]
        }
    },

    // ==========================================
    // MODUL 4: MASTER DEBUGGING (LEVEL 16 - 20)
    // ==========================================
    {
        id: 16,
        moduleId: 4,
        moduleName: 'Modul 4: Master Debugging',
        name: 'Debug 1: Jurang Tersembunyi di Jembatan',
        conceptTitle: 'Pelacakan Bug Off-by-One',
        conceptIcon: '🐞',
        introBriefing: {
            headline: 'Misi Detektif Kode: Robot Terperosok!',
            explanation: 'Program bawaan memiliki kesalahan langkah. Robot melangkah terlalu jauh sehingga jatuh ke jurang. Gunakan tombol DEBUG (⏭️) untuk melacak eksekusi dan perbaiki kodenya!',
            realLifeAnalogy: '💡 Memeriksa jejak langkah untuk memastikan berhenti tepat di sasaran.'
        },
        hint: 'Lacak langkah robot dan perbaiki instruksi yang berlebih.',
        maxStars: 3,
        star3Blocks: 8,
        star2Blocks: 9,
        optimalBlocks: 8,
        maxBlocks: 14,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        // Bug: Ruas 2 maju 4x (harus 3x) lalu AMBIL, menyebabkan robot jatuh di x:7
        initialSequence: [
            'FORWARD', 'FORWARD', 'FORWARD', 'ACTIVATE',
            'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD', 'ACTIVATE'
        ],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                // Jembatan utama
                { x: 0, y: 1, z: 0, type: 'start' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Di x:7 tidak ada ubin (jurang maut!)
                // Pelataran megah pendukung (total 28 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: -1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: -1, z: 0, type: 'normal' },
                { x: 4, y: -1, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 4, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 17,
        moduleId: 4,
        moduleName: 'Modul 4: Master Debugging',
        name: 'Debug 2: Tersesat di Labirin Laser',
        conceptTitle: 'Pelacakan Bug Orientasi Belok',
        conceptIcon: '🧭',
        introBriefing: {
            headline: 'Robot Salah Belok Masuk Perangkap Laser!',
            explanation: 'Di persimpangan labirin, program robot salah memilih arah belokan sehingga menuju bahaya. Telusuri dengan tombol DEBUG (⏭️) dan arahkan robot ke jalur yang benar!',
            realLifeAnalogy: '💡 Seperti mengoreksi arah kompas: pastikan belokan mengarah ke tujuan.'
        },
        hint: 'Perbaiki arah belokan yang keliru dalam susunan program.',
        maxStars: 3,
        star3Blocks: 7,
        star2Blocks: 8,
        optimalBlocks: 7,
        maxBlocks: 14,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        // Bug: Salah belok ke kanan (masuk laser di (2,1)) padahal kristal ke kiri (2,-1)
        initialSequence: [
            'FORWARD', 'FORWARD', 'TURN_RIGHT', 'FORWARD', 'ACTIVATE', 'FORWARD', 'ACTIVATE'
        ],
        map: {
            startX: 0, startY: 0, startZ: 0, startDir: 1,
            tiles: [
                { x: 0, y: 0, z: 0, type: 'start' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                // Lorong salah ke kanan (South) -> dinding laser maut
                { x: 2, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 2, y: 2, z: 0, type: 'normal', hasLaser: true },
                // Lorong benar ke kiri (North) -> 2 kristal
                { x: 2, y: -1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 2, y: -2, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Pelataran labirin megah (total 30 ubin)
                { x: 0, y: -1, z: 0, type: 'normal' },
                { x: 1, y: -1, z: 0, type: 'normal' },
                { x: 3, y: -1, z: 0, type: 'normal' },
                { x: 0, y: -2, z: 0, type: 'normal' },
                { x: 1, y: -2, z: 0, type: 'normal' },
                { x: 3, y: -2, z: 0, type: 'normal' },
                { x: 0, y: 1, z: 0, type: 'normal' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 4, y: -1, z: 0, type: 'normal' },
                { x: 4, y: -2, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: -1, y: -1, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: -3, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 18,
        moduleId: 4,
        moduleName: 'Modul 4: Master Debugging',
        name: 'Debug 3: Stepper Loop Mogok di Runway',
        conceptTitle: 'Pelacakan Bug Loop Stepper X',
        conceptIcon: '🔁',
        introBriefing: {
            headline: 'Perulangan Kurang dan Mogok di Tengah Jalan!',
            explanation: 'Robot berhenti sebelum mencapai kristal terakhir karena putaran loop belum cukup. Gunakan tombol DEBUG (⏭️) lalu sesuaikan angka pengulangan!',
            realLifeAnalogy: '💡 Menyetel durasi putaran mesin agar bekerja sampai pekerjaan tuntas.'
        },
        hint: 'Sesuaikan jumlah putaran loop agar robot mencapai tujuan.',
        maxStars: 3,
        star3Blocks: 4,
        star2Blocks: 6,
        optimalBlocks: 4,
        maxBlocks: 10,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        // Bug: Loop hanya diset 2x (kurang) sehingga mogok sebelum kristal ke-3
        initialSequence: [
            { type: 'loop', count: 2, body: ['FORWARD', 'FORWARD', 'ACTIVATE'] }
        ],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                // Runway utama 3 pos (7 ubin)
                { x: 0, y: 1, z: 0, type: 'start' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 2, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 4, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                // Pelataran megah di sekeliling runway (total 32 ubin)
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 1, z: 0, type: 'normal' },
                { x: 7, y: 0, z: 0, type: 'normal' },
                { x: 7, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: -1, y: 2, z: 0, type: 'normal' },
                { x: 3, y: -1, z: 0, type: 'normal' },
                { x: 4, y: -1, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal' },
                { x: 4, y: 3, z: 0, type: 'normal' },
                { x: 8, y: 1, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 19,
        moduleId: 4,
        moduleName: 'Modul 4: Master Debugging',
        name: 'Debug 4: Ritme Kombo Terbalik di Halangan',
        conceptTitle: 'Pelacakan Bug Urutan Aksi dalam Loop',
        conceptIcon: '🔄',
        introBriefing: {
            headline: 'Urutan Aksi di Dalam Loop Terbalik!',
            explanation: 'Urutan aksi di dalam loop tidak sesuai dengan susunan rintangan, sehingga robot gagal bermanuver. Telusuri dengan tombol DEBUG (⏭️) lalu perbaiki urutan perintahnya!',
            realLifeAnalogy: '💡 Memakai perlengkapan dalam urutan yang benar sebelum beraksi.'
        },
        hint: 'Tata ulang urutan aksi yang tertukar di dalam perulangan.',
        maxStars: 3,
        star3Blocks: 5,
        star2Blocks: 7,
        optimalBlocks: 5,
        maxBlocks: 12,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        // Bug: Terbalik aksi [DUCK, JUMP, FORWARD, ACTIVATE] -> robot merunduk di tepi jurang dan jatuh!
        initialSequence: [
            { type: 'loop', count: 2, body: ['DUCK', 'JUMP', 'FORWARD', 'ACTIVATE'] }
        ],
        map: {
            startX: 0, startY: 1, startZ: 0, startDir: 1,
            tiles: [
                // Runway Utama (Celah Jurang di x:1 dan x:5, Pendaratan Aman di x:2 dan x:6, Laser di x:3 dan x:7)
                { x: 0, y: 1, z: 0, type: 'start' },
                // Jurang 1 di x:1 (kosong) -> pendaratan lompat di x:2
                { x: 2, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 4, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Jurang 2 di x:5 (kosong) -> pendaratan lompat di x:6
                { x: 6, y: 1, z: 0, type: 'normal' },
                { x: 7, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 8, y: 1, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Pelataran sirkuit megah (total 35 ubin)
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: 9, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 2, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 0, z: 0, type: 'normal' },
                { x: 4, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 7, y: 0, z: 0, type: 'normal' },
                { x: 8, y: 0, z: 0, type: 'normal' },
                { x: 9, y: 0, z: 0, type: 'normal' },
                { x: 10, y: 0, z: 0, type: 'normal' },
                { x: -1, y: 2, z: 0, type: 'normal' },
                { x: 0, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: 4, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 7, y: 2, z: 0, type: 'normal' },
                { x: 8, y: 2, z: 0, type: 'normal' },
                { x: 9, y: 2, z: 0, type: 'normal' },
                { x: 10, y: 2, z: 0, type: 'normal' },
                { x: 2, y: -1, z: 0, type: 'normal' },
                { x: 4, y: -1, z: 0, type: 'normal' },
                { x: 6, y: -1, z: 0, type: 'normal' },
                { x: 8, y: -1, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 4, y: 3, z: 0, type: 'normal' },
                { x: 6, y: 3, z: 0, type: 'normal' }
            ]
        }
    },
    {
        id: 20,
        moduleId: 4,
        moduleName: 'Modul 4: Master Debugging',
        name: 'GRAND CHAMPIONSHIP ULTIMATE',
        conceptTitle: 'Ujian Kelulusan Master Pemrograman (Level 20)',
        conceptIcon: '🏆',
        introBriefing: {
            headline: 'Puncak Gelar Master Koding: Grand Champion!',
            explanation: 'Ujian puncak kejuaraan! Lintasan kolosal ini memadukan loop, arah belok, jurang, dan laser. Gunakan tombol DEBUG (⏭️) untuk mengaudit program dan raih gelar juara!',
            realLifeAnalogy: '💡 Menguji seluruh sistem perangkat lunak secara teliti sebelum rilis resmi.'
        },
        hint: 'Audit kode secara menyeluruh dan raih seluruh kristal juara!',
        maxStars: 3,
        star3Blocks: 13,
        star2Blocks: 16,
        optimalBlocks: 13,
        maxBlocks: 20,
        unlockedCommands: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'JUMP', 'DUCK', 'LOOP', 'ACTIVATE'],
        // Bug: Loop 2x maju lalu salah belok ke kanan (masuk jurang) padahal jalur ke kiri menuju 3 kristal
        initialSequence: [
            { type: 'loop', count: 2, body: ['FORWARD'] },
            'TURN_RIGHT',
            'DUCK',
            'FORWARD',
            'ACTIVATE'
        ],
        map: {
            startX: 0, startY: 2, startZ: 0, startDir: 1,
            tiles: [
                // Koridor Start (Loop 2x maju ke (2,2))
                { x: 0, y: 2, z: 0, type: 'start' },
                { x: 1, y: 2, z: 0, type: 'normal' },
                { x: 2, y: 2, z: 0, type: 'normal' },
                // Belok Kiri (North) ke (2,1 hasLaser) -> Kristal 1 di (2,0)
                { x: 2, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 2, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 1 },
                // Belok Kanan (East): Jurang di (3,0) -> lompat ke (4,0, kristal 2)
                { x: 4, y: 0, z: 0, type: 'normal', hasTarget: true, targetNum: 2 },
                // Belok Kanan (South): Laser di (4,1) -> Kristal Mahkota 3 di (4,2)
                { x: 4, y: 1, z: 0, type: 'normal', hasLaser: true },
                { x: 4, y: 2, z: 0, type: 'normal', hasTarget: true, targetNum: 3 },
                // Arena Kolosal Stadion Megah (total 42 ubin)
                { x: 0, y: 1, z: 0, type: 'normal' },
                { x: 1, y: 1, z: 0, type: 'normal' },
                { x: 0, y: 0, z: 0, type: 'normal' },
                { x: 1, y: 0, z: 0, type: 'normal' },
                { x: 0, y: 3, z: 0, type: 'normal' },
                { x: 1, y: 3, z: 0, type: 'normal' },
                { x: 2, y: 3, z: 0, type: 'normal' },
                { x: 3, y: 3, z: 0, type: 'normal' },
                { x: 4, y: 3, z: 0, type: 'normal' },
                { x: 5, y: 3, z: 0, type: 'normal' },
                { x: 5, y: 2, z: 0, type: 'normal' },
                { x: 5, y: 1, z: 0, type: 'normal' },
                { x: 5, y: 0, z: 0, type: 'normal' },
                { x: 3, y: 1, z: 0, type: 'normal' },
                { x: 3, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 2, z: 0, type: 'normal' },
                { x: -1, y: 1, z: 0, type: 'normal' },
                { x: -1, y: 0, z: 0, type: 'normal' },
                { x: -1, y: 3, z: 0, type: 'normal' },
                { x: 2, y: -1, z: 0, type: 'normal' },
                { x: 3, y: -1, z: 0, type: 'normal' },
                { x: 4, y: -1, z: 0, type: 'normal' },
                { x: 1, y: -1, z: 0, type: 'normal' },
                { x: 5, y: -1, z: 0, type: 'normal' },
                { x: 6, y: 0, z: 0, type: 'normal' },
                { x: 6, y: 1, z: 0, type: 'normal' },
                { x: 6, y: 2, z: 0, type: 'normal' },
                { x: 6, y: 3, z: 0, type: 'normal' },
                { x: 0, y: 4, z: 0, type: 'normal' },
                { x: 1, y: 4, z: 0, type: 'normal' },
                { x: 2, y: 4, z: 0, type: 'normal' },
                { x: 3, y: 4, z: 0, type: 'normal' },
                { x: 4, y: 4, z: 0, type: 'normal' },
                { x: 5, y: 4, z: 0, type: 'normal' }
            ]
        }
    }
];

window.GAME_LEVELS = GAME_LEVELS;
