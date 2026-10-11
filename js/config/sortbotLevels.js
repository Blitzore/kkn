/**
 * SORT-BOT — 5 Level Master Curriculum
 * File: js/config/sortbotLevels.js
 */

const SORTBOT_LEVELS = [
    {
        id: 1,
        name: 'Level 1',
        headline: 'Level 1: Pemilahan Khusus Plastik',
        puzzleGoal: 'Masukkan sampah <strong>PLASTIK</strong> ke <strong>Tong Kuning</strong>. Buang <strong>semua jenis sampah lainnya</strong> ke <strong>Tong Hijau</strong>!',
        clues: [
            { text: '🧴 PLASTIK ➔ 🟡 Tong Kuning', isElse: false },
            { text: '📦 Semua Sampah Lainnya ➔ 🟢 Tong Hijau', isElse: true }
        ],
        availableBins: ['KUNING', 'HIJAU'],
        items: [
            { type: 'PLASTIK', name: 'Botol Plastik', icon: '🧴', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Kulit Pisang', icon: '🍌', targetBin: 'HIJAU' },
            { type: 'KERTAS',  name: 'Kardus Paket', icon: '📦', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Kaleng Minuman', icon: '🥫', targetBin: 'HIJAU' },
            { type: 'PLASTIK', name: 'Gelas Plastik', icon: '🥤', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Apel Busuk',   icon: '🍎', targetBin: 'HIJAU' }
        ]
    },
    {
        id: 2,
        name: 'Level 2',
        headline: 'Level 2: Pemilahan Khusus Organik',
        puzzleGoal: 'Masukkan sampah <strong>ORGANIK</strong> ke <strong>Tong Hijau</strong>. Buang <strong>semua jenis sampah lainnya</strong> ke <strong>Tong Kuning</strong>!',
        clues: [
            { text: '🍏 ORGANIK ➔ 🟢 Tong Hijau', isElse: false },
            { text: '📦 Semua Sampah Lainnya ➔ 🟡 Tong Kuning', isElse: true }
        ],
        availableBins: ['HIJAU', 'KUNING'],
        items: [
            { type: 'ORGANIK', name: 'Sisa Sayur',     icon: '🥬', targetBin: 'HIJAU' },
            { type: 'PLASTIK', name: 'Kantong Kresek', icon: '🛍️', targetBin: 'KUNING' },
            { type: 'KERTAS',  name: 'Koran Bekas',    icon: '📄', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Kulit Jeruk',    icon: '🍊', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Baut Besi',       icon: '🔩', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Daun Kering',    icon: '🍂', targetBin: 'HIJAU' },
            { type: 'PLASTIK', name: 'Wadah Mika',     icon: '🥡', targetBin: 'KUNING' }
        ]
    },
    {
        id: 3,
        name: 'Level 3',
        headline: 'Level 3: Logam, Plastik, & Sisa Lainnya',
        puzzleGoal: 'Masukkan <strong>LOGAM</strong> ke <strong>Tong Merah</strong>, <strong>PLASTIK</strong> ke <strong>Tong Kuning</strong>, dan <strong>semua sampah lainnya</strong> ke <strong>Tong Hijau</strong>!',
        clues: [
            { text: '🥫 LOGAM ➔ 🔴 Tong Merah', isElse: false },
            { text: '🧴 PLASTIK ➔ 🟡 Tong Kuning', isElse: false },
            { text: '📦 Semua Sampah Lainnya ➔ 🟢 Tong Hijau', isElse: true }
        ],
        availableBins: ['MERAH', 'KUNING', 'HIJAU'],
        items: [
            { type: 'LOGAM',   name: 'Kaleng Soda',    icon: '🥫', targetBin: 'MERAH' },
            { type: 'PLASTIK', name: 'Botol Shampo',   icon: '🧴', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Sisa Apel',      icon: '🍎', targetBin: 'HIJAU' },
            { type: 'KERTAS',  name: 'Kardus Susu',    icon: '📦', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Kunci Pas',      icon: '🔧', targetBin: 'MERAH' },
            { type: 'PLASTIK', name: 'Sedotan Cup',    icon: '🥤', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Kulit Semangka', icon: '🍉', targetBin: 'HIJAU' },
            { type: 'KERTAS',  name: 'Buku Bekas',    icon: '📚', targetBin: 'HIJAU' }
        ]
    },
    {
        id: 4,
        name: 'Level 4',
        headline: 'Level 4: Logam, Kertas, Plastik, & Lainnya',
        puzzleGoal: 'Masukkan <strong>LOGAM</strong> ke <strong>Tong Merah</strong>, <strong>KERTAS</strong> ke <strong>Tong Biru</strong>, <strong>PLASTIK</strong> ke <strong>Tong Kuning</strong>, dan <strong>sampah lainnya</strong> ke <strong>Tong Hijau</strong>!',
        clues: [
            { text: '🥫 LOGAM ➔ 🔴 Tong Merah', isElse: false },
            { text: '📦 KERTAS ➔ 🔵 Tong Biru', isElse: false },
            { text: '🧴 PLASTIK ➔ 🟡 Tong Kuning', isElse: false },
            { text: '🍏 Semua Sampah Lainnya ➔ 🟢 Tong Hijau', isElse: true }
        ],
        availableBins: ['MERAH', 'BIRU', 'KUNING', 'HIJAU'],
        items: [
            { type: 'ORGANIK', name: 'Sisa Jagung',    icon: '🌽', targetBin: 'HIJAU' },
            { type: 'KERTAS',  name: 'Kardus Paket',   icon: '📦', targetBin: 'BIRU' },
            { type: 'LOGAM',   name: 'Baterai Bekas',  icon: '🔋', targetBin: 'MERAH' },
            { type: 'PLASTIK', name: 'Gelas Cup',      icon: '🥤', targetBin: 'KUNING' },
            { type: 'KERTAS',  name: 'Koran Bekas',    icon: '📄', targetBin: 'BIRU' },
            { type: 'ORGANIK', name: 'Wortel Busuk',   icon: '🥕', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Kaleng Biskuit', icon: '🥫', targetBin: 'MERAH' },
            { type: 'PLASTIK', name: 'Botol Deterjen', icon: '🧴', targetBin: 'KUNING' }
        ]
    },
    {
        id: 5,
        name: 'Level 5',
        headline: 'Level 5: Master Pemilah Sampah',
        puzzleGoal: 'Pisahkan <strong>ORGANIK</strong> ke <strong>Tong Hijau</strong>, <strong>PLASTIK</strong> ke <strong>Tong Kuning</strong>, <strong>LOGAM</strong> ke <strong>Tong Merah</strong>, dan <strong>KERTAS</strong> ke <strong>Tong Biru</strong>!',
        clues: [
            { text: '🍏 ORGANIK ➔ 🟢 Tong Hijau', isElse: false },
            { text: '🧴 PLASTIK ➔ 🟡 Tong Kuning', isElse: false },
            { text: '🥫 LOGAM ➔ 🔴 Tong Merah', isElse: false },
            { text: '📦 KERTAS / Lainnya ➔ 🔵 Tong Biru', isElse: true }
        ],
        availableBins: ['HIJAU', 'KUNING', 'MERAH', 'BIRU'],
        items: [
            { type: 'PLASTIK', name: 'Botol Minyak',     icon: '🧴', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Sisa Nasi',        icon: '🍚', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Kaleng Soda',      icon: '🥫', targetBin: 'MERAH' },
            { type: 'KERTAS',  name: 'Buku Bekas',       icon: '📚', targetBin: 'BIRU' },
            { type: 'PLASTIK', name: 'Sedotan Es',       icon: '🥤', targetBin: 'KUNING' },
            { type: 'ORGANIK', name: 'Kulit Durian',     icon: '🍈', targetBin: 'HIJAU' },
            { type: 'LOGAM',   name: 'Kawat Kabel',      icon: '📎', targetBin: 'MERAH' },
            { type: 'KERTAS',  name: 'Karton Susu',      icon: '📦', targetBin: 'BIRU' },
            { type: 'ORGANIK', name: 'Sisa Timun',       icon: '🥒', targetBin: 'HIJAU' },
            { type: 'PLASTIK', name: 'Kantong Plastik',  icon: '🛍️', targetBin: 'KUNING' }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.SORTBOT_LEVELS = SORTBOT_LEVELS;
}
