/**
 * GATE-BOT — 5 Level Master Curriculum (Operator Logika: AND, OR, NOT & Nilai TRUE / FALSE)
 * File: js/config/gatebotLevels.js
 */

const GATEBOT_LEVELS = [
    {
        id: 1,
        name: 'Level 1: Operator AND (DAN)',
        headline: 'Gerbang Kolam Renang',
        desc: 'Robot hanya membuka gerbang jika pengunjung membawa <strong>tiket</strong> (TRUE) DAN memakai <strong>bajuRenang</strong> (TRUE).',
        operatorFocus: 'AND',
        logicExpression: 'tiket AND bajuRenang',
        conceptSummary: 'Operator AND hanya bernilai TRUE jika KEDUA syarat sama-sama bernilai TRUE.',
        blueprintCode: `JIKA (tiket AND bajuRenang) MAKA
    Buka Gerbang ➔ TRUE 🟢
SELAIN ITU
    Kunci Gerbang ➔ FALSE 🔴`,
        allowedAttributes: [
            { key: 'tiket', label: 'Tiket Masuk', icon: '🎟️' },
            { key: 'bajuRenang', label: 'Baju Renang', icon: '🩱' }
        ],
        targetExplanation: 'Apakah pengunjung lolos gerbang (TRUE) atau ditolak (FALSE)?',
        visitors: [
            {
                id: 'v1',
                name: 'Budi',
                avatar: '👦',
                attributes: { tiket: true, bajuRenang: true },
                expectedOpen: true,
                reason: 'tiket=TRUE dan bajuRenang=TRUE ➔ TRUE AND TRUE = TRUE (Buka Gerbang).'
            },
            {
                id: 'v2',
                name: 'Siti',
                avatar: '👧',
                attributes: { tiket: true, bajuRenang: false },
                expectedOpen: false,
                reason: 'tiket=TRUE tapi bajuRenang=FALSE ➔ TRUE AND FALSE = FALSE (Ditolak).'
            },
            {
                id: 'v3',
                name: 'Edo',
                avatar: '🧒',
                attributes: { tiket: false, bajuRenang: true },
                expectedOpen: false,
                reason: 'tiket=FALSE dan bajuRenang=TRUE ➔ FALSE AND TRUE = FALSE (Ditolak).'
            },
            {
                id: 'v4',
                name: 'Rani',
                avatar: '👧',
                attributes: { tiket: false, bajuRenang: false },
                expectedOpen: false,
                reason: 'Kedua syarat bernilai FALSE ➔ FALSE AND FALSE = FALSE (Ditolak).'
            }
        ]
    },
    {
        id: 2,
        name: 'Level 2: Operator OR (ATAU)',
        headline: 'Gerbang Perpustakaan Digital',
        desc: 'Pengunjung boleh masuk jika membawa <strong>kartuPelajar</strong> (TRUE) ATAU membawa <strong>izinGuru</strong> (TRUE). Cukup salah satu syarat terpenuhi!',
        operatorFocus: 'OR',
        logicExpression: 'kartuPelajar OR izinGuru',
        conceptSummary: 'Operator OR bernilai TRUE jika SALAH SATU atau KEDUA syarat bernilai TRUE.',
        blueprintCode: `JIKA (kartuPelajar OR izinGuru) MAKA
    Buka Gerbang ➔ TRUE 🟢
SELAIN ITU
    Kunci Gerbang ➔ FALSE 🔴`,
        allowedAttributes: [
            { key: 'kartuPelajar', label: 'Kartu Pelajar', icon: '🪪' },
            { key: 'izinGuru', label: 'Surat Izin Guru', icon: '📜' }
        ],
        targetExplanation: 'Apakah pengunjung lolos gerbang (TRUE) atau ditolak (FALSE)?',
        visitors: [
            {
                id: 'v1',
                name: 'Dimas',
                avatar: '👦',
                attributes: { kartuPelajar: true, izinGuru: false },
                expectedOpen: true,
                reason: 'kartuPelajar=TRUE dan izinGuru=FALSE ➔ TRUE OR FALSE = TRUE (Buka Gerbang).'
            },
            {
                id: 'v2',
                name: 'Ayu',
                avatar: '👧',
                attributes: { kartuPelajar: false, izinGuru: true },
                expectedOpen: true,
                reason: 'kartuPelajar=FALSE dan izinGuru=TRUE ➔ FALSE OR TRUE = TRUE (Buka Gerbang).'
            },
            {
                id: 'v3',
                name: 'Doni',
                avatar: '🧒',
                attributes: { kartuPelajar: true, izinGuru: true },
                expectedOpen: true,
                reason: 'Kedua syarat bernilai TRUE ➔ TRUE OR TRUE = TRUE (Buka Gerbang).'
            },
            {
                id: 'v4',
                name: 'Fajar',
                avatar: '👦',
                attributes: { kartuPelajar: false, izinGuru: false },
                expectedOpen: false,
                reason: 'Kedua syarat bernilai FALSE ➔ FALSE OR FALSE = FALSE (Ditolak).'
            }
        ]
    },
    {
        id: 3,
        name: 'Level 3: Operator NOT (TIDAK / PANTANGAN)',
        headline: 'Pintu Masuk Lab Komputer Bersih',
        desc: 'Siswa sekolah boleh masuk lab, asalkan <strong>TIDAK membawa makanan</strong> (pantangan kotor)!',
        operatorFocus: 'NOT',
        logicExpression: 'siswaSekolah AND NOT bawaMakanan',
        conceptSummary: 'Operator NOT membalikkan nilai: NOT FALSE bernilai TRUE, sedangkan NOT TRUE bernilai FALSE.',
        blueprintCode: `JIKA (siswaSekolah AND NOT bawaMakanan) MAKA
    Buka Gerbang ➔ TRUE 🟢
SELAIN ITU
    Kunci Gerbang ➔ FALSE 🔴`,
        allowedAttributes: [
            { key: 'siswaSekolah', label: 'Siswa Sekolah', icon: '🎒' },
            { key: 'bawaMakanan', label: 'Bawa Makanan/Minuman', icon: '🍔' }
        ],
        targetExplanation: 'Apakah pengunjung lolos gerbang (TRUE) atau ditolak (FALSE)?',
        visitors: [
            {
                id: 'v1',
                name: 'Rian',
                avatar: '👦',
                attributes: { siswaSekolah: true, bawaMakanan: false },
                expectedOpen: true,
                reason: 'siswaSekolah=TRUE, bawaMakanan=FALSE ➔ NOT FALSE bernilai TRUE ➔ TRUE AND TRUE = TRUE (Buka).'
            },
            {
                id: 'v2',
                name: 'Tia',
                avatar: '👧',
                attributes: { siswaSekolah: true, bawaMakanan: true },
                expectedOpen: false,
                reason: 'siswaSekolah=TRUE, bawaMakanan=TRUE ➔ NOT TRUE bernilai FALSE ➔ TRUE AND FALSE = FALSE (Ditolak).'
            },
            {
                id: 'v3',
                name: 'Bayu',
                avatar: '🧑',
                attributes: { siswaSekolah: false, bawaMakanan: false },
                expectedOpen: false,
                reason: 'Bukan siswa sekolah (siswaSekolah=FALSE) ➔ FALSE AND TRUE = FALSE (Ditolak).'
            },
            {
                id: 'v4',
                name: 'Maya',
                avatar: '👧',
                attributes: { siswaSekolah: false, bawaMakanan: true },
                expectedOpen: false,
                reason: 'siswaSekolah=FALSE dan bawaMakanan=TRUE ➔ FALSE AND FALSE = FALSE (Ditolak).'
            }
        ]
    },
    {
        id: 4,
        name: 'Level 4: Kombinasi (OR) AND',
        headline: 'Wahana Eksperimen Sains',
        desc: 'Pengunjung harus memiliki akses (punya <strong>tiket</strong> ATAU <strong>kartuVIP</strong>) DAN wajib memakai <strong>kacamataPelindung</strong> demi keselamatan!',
        operatorFocus: 'COMBINED',
        logicExpression: '(tiket OR kartuVIP) AND kacamataPelindung',
        conceptSummary: 'Hitung operasi di dalam kurung (tiket OR kartuVIP) lebih dulu, baru gabungkan dengan AND.',
        blueprintCode: `JIKA ((tiket OR kartuVIP) AND kacamataPelindung) MAKA
    Buka Gerbang ➔ TRUE 🟢
SELAIN ITU
    Kunci Gerbang ➔ FALSE 🔴`,
        allowedAttributes: [
            { key: 'tiket', label: 'Tiket Reguler', icon: '🎟️' },
            { key: 'kartuVIP', label: 'Kartu Akses VIP', icon: '⭐' },
            { key: 'kacamataPelindung', label: 'Kacamata Lab', icon: '🥽' }
        ],
        targetExplanation: 'Apakah pengunjung lolos gerbang (TRUE) atau ditolak (FALSE)?',
        visitors: [
            {
                id: 'v1',
                name: 'Andi',
                avatar: '👦',
                attributes: { tiket: true, kartuVIP: false, kacamataPelindung: true },
                expectedOpen: true,
                reason: '(TRUE OR FALSE) = TRUE, lalu TRUE AND kacamataPelindung(TRUE) = TRUE (Buka).'
            },
            {
                id: 'v2',
                name: 'Cika',
                avatar: '👧',
                attributes: { tiket: false, kartuVIP: true, kacamataPelindung: true },
                expectedOpen: true,
                reason: '(FALSE OR TRUE) = TRUE, lalu TRUE AND kacamataPelindung(TRUE) = TRUE (Buka).'
            },
            {
                id: 'v3',
                name: 'Bagus',
                avatar: '👦',
                attributes: { tiket: true, kartuVIP: false, kacamataPelindung: false },
                expectedOpen: false,
                reason: 'Punya akses (TRUE), tetapi kacamataPelindung=FALSE ➔ TRUE AND FALSE = FALSE (Ditolak).'
            },
            {
                id: 'v4',
                name: 'Sita',
                avatar: '👧',
                attributes: { tiket: false, kartuVIP: false, kacamataPelindung: true },
                expectedOpen: false,
                reason: 'Tidak punya akses tiket maupun VIP (FALSE) ➔ FALSE AND TRUE = FALSE (Ditolak).'
            }
        ]
    },
    {
        id: 5,
        name: 'Level 5: Tantangan Penuh (AND, OR, NOT)',
        headline: 'Ruang Final Kejuaraan Robotik',
        desc: 'Hanya yang terdaftar (sebagai <strong>peserta</strong> ATAU <strong>panitia</strong>), membawa <strong>kartuIdentitas</strong>, DAN <strong>TIDAK membawa barangTerlarang</strong> yang diizinkan masuk!',
        operatorFocus: 'MASTER',
        logicExpression: '(peserta OR panitia) AND kartuIdentitas AND NOT barangTerlarang',
        conceptSummary: 'Gabungkan ketiga operator: alternatif (OR), syarat wajib (AND), dan pantangan (NOT).',
        blueprintCode: `JIKA ((peserta OR panitia) AND kartuIdentitas AND NOT barangTerlarang) MAKA
    Buka Gerbang ➔ TRUE 🟢
SELAIN ITU
    Kunci Gerbang ➔ FALSE 🔴`,
        allowedAttributes: [
            { key: 'peserta', label: 'Peserta Lomba', icon: '🤖' },
            { key: 'panitia', label: 'Panitia Acara', icon: '👔' },
            { key: 'kartuIdentitas', label: 'Kartu Identitas', icon: '🪪' },
            { key: 'barangTerlarang', label: 'Barang Terlarang', icon: '⚠️' }
        ],
        targetExplanation: 'Apakah pengunjung lolos gerbang (TRUE) atau ditolak (FALSE)?',
        visitors: [
            {
                id: 'v1',
                name: 'Gilang',
                avatar: '👦',
                attributes: { peserta: true, panitia: false, kartuIdentitas: true, barangTerlarang: false },
                expectedOpen: true,
                reason: 'Terdaftar (TRUE), kartuIdentitas=TRUE, dan NOT barangTerlarang=TRUE ➔ TRUE (Buka).'
            },
            {
                id: 'v2',
                name: 'Lestari',
                avatar: '👧',
                attributes: { peserta: false, panitia: true, kartuIdentitas: true, barangTerlarang: false },
                expectedOpen: true,
                reason: 'Panitia (TRUE), kartuIdentitas=TRUE, dan bebas barang terlarang ➔ TRUE (Buka).'
            },
            {
                id: 'v3',
                name: 'Rian',
                avatar: '👦',
                attributes: { peserta: true, panitia: false, kartuIdentitas: false, barangTerlarang: false },
                expectedOpen: false,
                reason: 'Peserta resmi tetapi kartuIdentitas=FALSE ➔ Ada syarat AND yang bernilai FALSE ➔ FALSE (Ditolak).'
            },
            {
                id: 'v4',
                name: 'Kevin',
                avatar: '🧒',
                attributes: { peserta: true, panitia: false, kartuIdentitas: true, barangTerlarang: true },
                expectedOpen: false,
                reason: 'Membawa barang terlarang (TRUE) ➔ NOT TRUE bernilai FALSE ➔ FALSE (Ditolak).'
            }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.GATEBOT_LEVELS = GATEBOT_LEVELS;
}
