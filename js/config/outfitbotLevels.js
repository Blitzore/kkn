/**
 * OUTFIT-BOT — 5 Level Master Curriculum
 * File: js/config/outfitbotLevels.js
 */

const OUTFITBOT_LEVELS = [
    {
        id: 1,
        name: 'Level 1: Parameter Pertama',
        headline: 'Senin: Upacara Bendera',
        desc: 'Panggil fungsi <code>siapkanSeragam(...)</code> agar robot menyiapkan atasan putih untuk upacara bendera hari Senin.',
        fnName: 'siapkanSeragam',
        params: ['atasan'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara Bendera',
                promptText: 'Panggil fungsi agar siswa memakai atasan putih di hari Senin!',
                expectedArgs: ['PUTIH'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
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
                promptText: 'Panggil fungsi agar siswa memakai atasan putih di hari Senin!',
                expectedArgs: ['PUTIH'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
            },
            {
                day: 'RABU',
                label: 'Batik Sekolah',
                promptText: 'Panggil fungsi agar siswa memakai atasan batik di hari Rabu!',
                expectedArgs: ['BATIK'],
                req: { shirt: 'BATIK', pants: 'MERAH', acc: 'SABUK' }
            }
        ]
    },
    {
        id: 3,
        name: 'Level 3: 2 Parameter (Atasan & Bawahan)',
        headline: 'Selasa & Jumat: 2 Parameter',
        desc: 'Fungsi menerima 2 parameter: <code>siapkanSeragam(atasan, bawahan)</code>. Ketik pemanggilan dengan kedua warna!',
        fnName: 'siapkanSeragam',
        params: ['atasan', 'bawahan'],
        scheduleDays: [
            {
                day: 'SELASA',
                label: 'Seragam Nasional',
                promptText: 'Panggil fungsi dengan 2 parameter: atasan putih dan bawahan merah hari Selasa!',
                expectedArgs: ['PUTIH', 'MERAH'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'DASI' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka Siaga',
                promptText: 'Panggil fungsi dengan 2 parameter: atasan pramuka dan bawahan cokelat hari Jumat!',
                expectedArgs: ['PRAMUKA', 'COKELAT_TUA'],
                req: { shirt: 'PRAMUKA', pants: 'COKELAT_TUA', acc: 'KACU_HASDUK' }
            }
        ]
    },
    {
        id: 4,
        name: 'Level 4: 3 Parameter Lengkap',
        headline: 'Senin, Kamis, Jumat: 3 Parameter',
        desc: 'Fungsi menerima 3 parameter: <code>siapkanSeragam(atasan, bawahan, atribut)</code>.',
        fnName: 'siapkanSeragam',
        params: ['atasan', 'bawahan', 'atribut'],
        scheduleDays: [
            {
                day: 'SENIN',
                label: 'Upacara Bendera',
                promptText: 'Panggil fungsi dengan 3 parameter: atasan putih, bawahan merah, dan atribut topi_dasi!',
                expectedArgs: ['PUTIH', 'MERAH', 'TOPI_DASI'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
            },
            {
                day: 'KAMIS',
                label: 'Seragam Khusus',
                promptText: 'Panggil fungsi dengan 3 parameter: atasan kotak, bawahan hitam, dan atribut sabuk!',
                expectedArgs: ['KOTAK', 'HITAM', 'SABUK'],
                req: { shirt: 'KOTAK', pants: 'HITAM', acc: 'SABUK' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka Wajib',
                promptText: 'Panggil fungsi dengan 3 parameter: atasan pramuka, bawahan cokelat, dan atribut kacu!',
                expectedArgs: ['PRAMUKA', 'COKELAT_TUA', 'KACU_HASDUK'],
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
                promptText: 'Senin Upacara: Atasan putih, bawahan merah, atribut topi_dasi!',
                expectedArgs: ['PUTIH', 'MERAH', 'TOPI_DASI'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'TOPI_DASI' }
            },
            {
                day: 'SELASA',
                label: 'Nasional',
                promptText: 'Selasa Nasional: Atasan putih, bawahan merah, atribut dasi!',
                expectedArgs: ['PUTIH', 'MERAH', 'DASI'],
                req: { shirt: 'PUTIH', pants: 'MERAH', acc: 'DASI' }
            },
            {
                day: 'RABU',
                label: 'Batik',
                promptText: 'Rabu Batik: Atasan batik, bawahan putih, atribut sabuk!',
                expectedArgs: ['BATIK', 'PUTIH', 'SABUK'],
                req: { shirt: 'BATIK', pants: 'PUTIH', acc: 'SABUK' }
            },
            {
                day: 'KAMIS',
                label: 'Kotak',
                promptText: 'Kamis Khusus: Atasan kotak, bawahan hitam, atribut sabuk!',
                expectedArgs: ['KOTAK', 'HITAM', 'SABUK'],
                req: { shirt: 'KOTAK', pants: 'HITAM', acc: 'SABUK' }
            },
            {
                day: 'JUMAT',
                label: 'Pramuka',
                promptText: 'Jumat Pramuka: Atasan pramuka, bawahan cokelat, atribut kacu!',
                expectedArgs: ['PRAMUKA', 'COKELAT_TUA', 'KACU_HASDUK'],
                req: { shirt: 'PRAMUKA', pants: 'COKELAT_TUA', acc: 'KACU_HASDUK' }
            }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.OUTFITBOT_LEVELS = OUTFITBOT_LEVELS;
}
