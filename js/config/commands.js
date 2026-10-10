/**
 * commands.js - Master Registry Perintah Koding ALGO-BOT
 * Mendefinisikan seluruh jenis balok perintah, ikon, warna, dan deskripsi edukatifnya.
 * Mendukung konsep: Runtutan, Orientasi, Halangan (Lompat & Tunduk),
 * Blok Berapit Penjepit Code.org: JIKA-LAINNYA (IF-ELSE) & ULANGI (LOOP),
 * serta Pemanggilan Fungsi Modular (F1).
 */

const COMMAND_DEFINITIONS = {
    FORWARD: {
        id: 'FORWARD',
        label: 'MAJU',
        icon: '⬆️',
        type: 'movement',
        color: '#0284c7',
        desc: 'Maju 1 petak ke arah robot menghadap'
    },
    TURN_LEFT: {
        id: 'TURN_LEFT',
        label: 'PUTAR KIRI',
        icon: '↩️',
        type: 'turning',
        color: '#6366f1',
        desc: 'Belok 90 derajat ke arah kiri robot'
    },
    TURN_RIGHT: {
        id: 'TURN_RIGHT',
        label: 'PUTAR KANAN',
        icon: '↪️',
        type: 'turning',
        color: '#8b5cf6',
        desc: 'Belok 90 derajat ke arah kanan robot'
    },
    JUMP: {
        id: 'JUMP',
        label: 'LOMPAT',
        icon: '🦘',
        type: 'movement',
        color: '#ec4899',
        desc: 'Melompati ubin tinggi atau celah jurang kosong 1 petak'
    },
    DUCK: {
        id: 'DUCK',
        label: 'TUNDUK',
        icon: '🧎',
        type: 'movement',
        color: '#06b6d4',
        desc: 'Merunduk dan meluncur 1 petak di bawah sinar laser pengaman'
    },
    ACTIVATE: {
        id: 'ACTIVATE',
        label: 'AMBIL',
        icon: '⭐',
        type: 'action',
        color: '#eab308',
        desc: 'Mengambil kristal bintang atau mengaktifkan saklar'
    },
    // Konsep IF-ELSE: Blok Penjepit Percabangan Kondisi (Gaya Code.org)
    IF_ELSE: {
        id: 'IF_ELSE',
        label: 'JIKA - LAINNYA',
        icon: '🔀',
        type: 'container_if_else',
        color: '#f97316',
        desc: 'Apit aksi: JIKA ada jurang lakukan aksi 1, LAINNYA (laser) lakukan aksi 2'
    },
    // Konsep LOOP: Blok Penjepit Perulangan (Gaya Code.org)
    LOOP: {
        id: 'LOOP',
        label: 'ULANGI',
        icon: '🔁',
        type: 'container_loop',
        color: '#10b981',
        desc: 'Apit instruksi di dalamnya dan ulangi sebanyak X kali'
    },
    // Konsep FUNCTION F1: Dekomposisi & Modularitas
    CALL_F1: {
        id: 'CALL_F1',
        label: 'FUNGSI (F1)',
        icon: '📦',
        type: 'function',
        color: '#d946ef',
        desc: 'Menjalankan serangkaian balok yang ada di dalam Kotak F1'
    }
};

// Alias kompatibilitas
COMMAND_DEFINITIONS.LOOP_START = COMMAND_DEFINITIONS.LOOP;
COMMAND_DEFINITIONS.IF_ELSE_MYSTERY = COMMAND_DEFINITIONS.IF_ELSE;
COMMAND_DEFINITIONS.IF_ELSE_COLOR = COMMAND_DEFINITIONS.IF_ELSE;

window.COMMAND_DEFINITIONS = COMMAND_DEFINITIONS;
