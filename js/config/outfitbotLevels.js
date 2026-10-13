/**
 * OUTFIT-BOT — 5 Level Master Curriculum
 * File: js/config/outfitbotLevels.js
 */

const OUTFITBOT_LEVELS = [
    {
        id: 1,
        name: 'Level 1: Parameter Pertama',
        headline: 'Senin: Upacara Bendera',
        desc: 'Panggil fungsi <code>siapkanSeragam(...)</code> agar robot menyiapkan baju putih untuk upacara bendera hari Senin.',
        fnName: 'siapkanSeragam',
        params: ['atasan'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara Bendera',
                promptText: 'Panggil fungsi agar siswa memakai baju putih di hari Senin!',
                expectedArgs: ['putih'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'NONE' }
            }
        ]
    },
    {
        id: 2,
        name: 'Level 2: 1 Fungsi untuk 2 Hari',
        headline: 'Senin & Rabu',
        desc: 'Gunakan 1 fungsi yang sama dua kali. Isi pemanggilan fungsi untuk hari Senin dan hari Rabu.',
        fnName: 'siapkanSeragam',
        params: ['atasan'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara Bendera',
                promptText: 'Panggil fungsi agar siswa memakai baju putih di hari Senin!',
                expectedArgs: ['putih'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'NONE' }
            },
            {
                day: 'RABU',
                label: 'Batik Sekolah',
                promptText: 'Panggil fungsi agar siswa memakai baju batik di hari Rabu!',
                expectedArgs: ['batik'],
                req: { shirt: 'BATIK', pants: 'MERAH', acc: 'NONE' }
            }
        ]
    },
    {
        id: 3,
        name: 'Level 3: 2 Parameter (Atasan & Bawahan)',
        headline: 'Selasa & Jumat: 2 Parameter',
        desc: 'Fungsi menerima 2 parameter: <code>siapkanSeragam(atasan, bawahan)</code>. Masukkan baju dan celana yang tepat!',
        fnName: 'siapkanSeragam',
        params: ['atasan', 'bawahan'],
        scheduleDays: [
            {
                day: 'SELASA',
                label: 'Seragam Nasional',
                promptText: 'Panggil fungsi dengan 2 parameter: baju putih dan celana merah di hari Selasa!',
                expectedArgs: ['putih', 'merah'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'NONE' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka Siaga',
                promptText: 'Panggil fungsi dengan 2 parameter: baju pramuka dan celana cokelat di hari Jumat!',
                expectedArgs: ['pramuka', 'cokelat'],
                req: { shirt: 'PRAMUKA', pants: 'COKELAT_TUA', acc: 'NONE' }
            }
        ]
    },
    {
        id: 4,
        name: 'Level 4: 3 Parameter Lengkap',
        headline: 'Senin, Kamis, Jumat: 3 Parameter',
        desc: 'Fungsi menerima 3 parameter: <code>siapkanSeragam(atasan, bawahan, atribut)</code>. Siapkan setelan seragam lengkap!',
        fnName: 'siapkanSeragam',
        params: ['atasan', 'bawahan', 'atribut'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara Bendera',
                promptText: 'Panggil fungsi dengan 3 parameter: baju putih, celana merah, dan atribut topi & dasi!',
                expectedArgs: ['putih', 'merah', 'topi & dasi'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
            },
            {
                day: 'KAMIS',
                label: 'Seragam Khusus',
                promptText: 'Panggil fungsi dengan 3 parameter: baju kotak, celana hitam, dan atribut sabuk!',
                expectedArgs: ['kotak', 'hitam', 'sabuk'],
                req: { shirt: 'KOTAK', pants: 'HITAM', acc: 'SABUK' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka Wajib',
                promptText: 'Panggil fungsi dengan 3 parameter: baju pramuka, celana cokelat, dan atribut kacu!',
                expectedArgs: ['pramuka', 'cokelat', 'kacu'],
                req: { shirt: 'PRAMUKA', pants: 'COKELAT_TUA', acc: 'KACU_HASDUK' }
            }
        ]
    },
    {
        id: 5,
        name: 'Level 5: Jadwal Seminggu Penuh',
        headline: 'Senin s/d Jumat: 5 Hari Sekolah',
        desc: 'Otomatiskan seluruh 5 hari sekolah dengan memanggil fungsi 1 baris per hari!',
        fnName: 'siapkanSeragam',
        params: ['atasan', 'bawahan', 'atribut'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara',
                promptText: 'Senin Upacara: Baju putih, celana merah, dan atribut topi & dasi!',
                expectedArgs: ['putih', 'merah', 'topi & dasi'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
            },
            {
                day: 'SELASA',
                label: 'Nasional',
                promptText: 'Selasa Nasional: Baju putih, celana merah, dan atribut dasi!',
                expectedArgs: ['putih', 'merah', 'dasi'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'DASI' }
            },
            {
                day: 'RABU',
                label: 'Batik',
                promptText: 'Rabu Batik: Baju batik, celana putih, dan atribut sabuk!',
                expectedArgs: ['batik', 'putih', 'sabuk'],
                req: { shirt: 'BATIK', pants: 'PUTIH', acc: 'SABUK' }
            },
            {
                day: 'KAMIS',
                label: 'Kotak',
                promptText: 'Kamis Khusus: Baju kotak, celana hitam, dan atribut sabuk!',
                expectedArgs: ['kotak', 'hitam', 'sabuk'],
                req: { shirt: 'KOTAK', pants: 'HITAM', acc: 'SABUK' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka',
                promptText: 'Jumat Pramuka: Baju pramuka, celana cokelat, dan atribut kacu!',
                expectedArgs: ['pramuka', 'cokelat', 'kacu'],
                req: { shirt: 'PRAMUKA', pants: 'COKELAT_TUA', acc: 'KACU_HASDUK' }
            }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.OUTFITBOT_LEVELS = OUTFITBOT_LEVELS;
}
