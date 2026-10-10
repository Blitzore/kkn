# Peta Kurikulum 20 Level ALGO-BOT & Ekosistem Game Koding KKN
## Media Visual Interaktif Pengenalan Logika Pemrograman Dasar & Pola Pikir Komputasi (Computational Thinking)

Dokumen ini memuat panduan kurikulum lengkap untuk **Ekosistem Pembelajaran Koding KKN**, yang terdiri dari **3 Web Game Mandiri yang Saling Terhubung**:
1. 🤖 **ALGO-BOT** (`index.html`) — **20 Level Terpadu (Total 60 ⭐)**: Runtutan, Belokan Orientasi, Halangan Spasial (Jurang & Laser), Perulangan Loop Berapit C-Clamp, dan Master Debugging.
2. ♻️ **SORT-BOT** (`sortbot.html`) — **5 Level Terdedikasi (Total 15 ⭐)**: Logika Percabangan Syarat & Kondisi `JIKA (IF)`, `LAINNYA JIKA (ELSE IF)`, dan `LAINNYA (ELSE)` dalam tema Pabrik Daur Ulang Sampah selaras Proyek P5 Kurikulum Merdeka.
3. 👗 **OUTFIT-BOT** (`outfitbot.html`) — **5 Level Terdedikasi (Total 15 ⭐)**: Prosedur `FUNGSI` dan masukan `PARAMETER` dalam tema Robot Lemari Otomatis Seragam Sekolah (Senin s.d. Jumat).

---

## 🌐 Arsitektur Ekosistem & Aksesibilitas Antar Game

Meskipun terbagi dalam 3 file HTML terpisah untuk menjaga fokus tema dan performa browser yang ringan:
- **Semua Game Dapat Diakses Langsung dari `index.html`:**
  - Di layar utama (**Lobby**), terdapat **Game Hub** dengan banner interaktif untuk membuka **SORT-BOT** dan **OUTFIT-BOT**.
  - Di dalam arena permainan (**Peta Level Modal**), tersedia tombol jalan pintas langsung ke kedua game modul spesial.
- **Navigasi Bolak-Balik yang Mulus:**
  - Baik di `sortbot.html` maupun `outfitbot.html`, terdapat bilah navigasi atas (Navbar) dengan tombol `← ALGO-BOT` untuk kembali ke permainan utama kapan saja, serta tautan silang antar modul.
- **Berjalan Murni di Browser (Client-Side):**
  - Tidak memerlukan instalasi server rumit. Cukup klik ganda `index.html`, `sortbot.html`, atau `outfitbot.html` di peramban apa pun (Chrome, Edge, Firefox, tablet, atau smartphone).

---

## 🌟 Prinsip Inti Kurikulum ALGO-BOT (20 Level)

1. **Kesulitan Berjenjang Murni (*Strictly Progressive Difficulty*):**  
   Tingkat kesulitan selalu meningkat dari level ke level. Pengenalan balok baru tidak menurunkan tingkat kesulitan arena secara drastis, melainkan langsung disajikan dalam skenario tantangan nyata.
2. **Balok Kumulatif (*Never Disappear*):**  
   Setiap balok yang telah diperkenalkan (`MAJU`, `AMBIL`, `PUTAR`, `LOMPAT`, `TUNDUK`, `ULANGI`) akan **selalu terbuka dan dapat digunakan di semua level berikutnya**.
3. **Balok Loop Berapit C-Clamp Standar Code.org:**  
   Balok `ULANGI` mengapit balok di dalamnya secara visual. Angka perulangan dimulai dari status belum disetel (`?x`) agar siswa melatih pola pikir komputasi untuk menentukan berapa kali perintah harus diulang.
4. **Sistem Ambang Bintang Efisiensi (Unified 3-Star Tiers — 60 ⭐ Total):**  
   Setiap level memiliki potensi maksimal **3 Bintang (⭐⭐⭐)** dengan sistem evaluasi yang adil, tidak kaku, dan memotivasi siswa untuk melakukan optimasi kode (*refactoring*):
   - ⭐ **1 Bintang (LULUS):** Robot selamat melintasi arena dan berhasil mengambil seluruh kristal energi ($\le$ `maxBlocks`).
   - ⭐⭐ **2 Bintang (CERDAS):** Siswa menyelesaikan misi dengan baris kode yang efisien dan rapi ($\le$ `star2Blocks`).
   - ⭐⭐⭐ **3 Bintang (MASTER):** Solusi rekor optimal terhemat yang memanfaatkan fitur cerdas seperti Loop dan jalan pintas ($\le$ `star3Blocks`).

---

## 📊 Matriks 20 Level ALGO-BOT (Skala Lantai Semakin Luas & Menantang)

Tiap naik level, **jumlah ubin lantai dan kompleksitas spasial selalu bertambah banyak**:

### MODUL 1: RUNTUTAN & ORIENTASI ARAH (Level 1 - 5)
Fokus: Urutan instruksi komputer (*sequence*), navigasi koordinat sudut 90°, dan analisis jalur ganda.

| No | Nama Level | Jumlah Lantai | Konsep Logika Utama | Balok Terbuka | Ambang Bintang | Catatan Solusi Arena |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **1** | **Langkah Pertama** | **3 Ubin** | Apa itu Algoritma? (Runtutan) | `MAJU`, `AMBIL` | ⭐⭐⭐ $\le$ 3<br>⭐⭐ $\le$ 4<br>⭐ $\le$ 6 | Maju 2x lalu Ambil kristal (3 balok optimal). |
| **2** | **Jejak Dua Kristal** | **5 Ubin** | Runtutan Langkah & Multi-Objek | `MAJU`, `AMBIL` | ⭐⭐⭐ $\le$ 6<br>⭐⭐ $\le$ 7<br>⭐ $\le$ 8 | Maju 2x, Ambil, Maju 2x, Ambil (6 balok optimal). |
| **3** | **Simpang Belok Presisi** | **7 Ubin** | Sudut & Orientasi Spasial 90° | + `PUTAR KIRI`, `PUTAR KANAN` | ⭐⭐⭐ $\le$ 7<br>⭐⭐ $\le$ 8<br>⭐ $\le$ 12 | Navigasi tikungan L-shape dengan orientasi robot yang presisi. |
| **4** | **Simpang Dua Cabang** | **11 Ubin** | Efisiensi Dua Rute Alternatif | (Semua M1) | ⭐⭐⭐ $\le$ 9<br>⭐⭐ $\le$ 11<br>⭐ $\le$ 14 | Pilihan rute dekat atas (9 balok) vs rute memutar bawah (11 balok). |
| **5** | **Labirin Zig-Zag** | **13 Ubin** | Rangkaian Sudut Beruntun (Ujian M1) | (Semua M1) | ⭐⭐⭐ $\le$ 14<br>⭐⭐ $\le$ 16<br>⭐ $\le$ 20 | Manuver zig-zag mengambil 2 kristal dengan kombinasi belokan berulang. |

---

### MODUL 2: DINAMIKA HALANGAN SPASIAL (Level 6 - 10)
Fokus: Koordinasi aksi fisik melompati jurang dan merunduk di bawah laser pada arena jembatan dan benteng luas.

| No | Nama Level | Jumlah Lantai | Konsep Logika Utama | Balok Terbuka | Ambang Bintang | Catatan Solusi Arena |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **6** | **Jembatan Jurang Berkelok** | **15 Ubin** | Menyeberang Celah Spasial Berbelok | + `LOMPAT` | ⭐⭐⭐ $\le$ 10<br>⭐⭐ $\le$ 12<br>⭐ $\le$ 16 | Jembatan berkelok dengan 2 celah jurang (10 balok optimal). |
| **7** | **Taktik Potong Jurang Danau** | **18 Ubin** | Lompat Pintas vs Jalur Keliling Darat | (Semua M1-M2) | ⭐⭐⭐ $\le$ 3<br>⭐⭐ $\le$ 8<br>⭐ $\le$ 18 | Trik lompat pintas seberang jurang (3 balok) vs keliling darat (13 balok). |
| **8** | **Koridor Laser & Tikungan** | **20 Ubin** | Merunduk & Koordinasi Spasial | + `TUNDUK` | ⭐⭐⭐ $\le$ 17<br>⭐⭐ $\le$ 19<br>⭐ $\le$ 24 | Koridor 2 pos laser dan 2 kristal energi (17 balok optimal). |
| **9** | **Kombinasi Jurang & Laser** | **22 Ubin** | Integrasi 2 Halangan Berbeda | (Semua M1-M2) | ⭐⭐⭐ $\le$ 15<br>⭐⭐ $\le$ 17<br>⭐ $\le$ 22 | Rangkaian terpadu: Lompat jurang, belok, Tunduk laser, dan 2 kristal (15 balok optimal). |
| **10** | **Benteng Rintangan Ganda** | **25 Ubin** | Sirkuit Komprehensif (Ujian M2) | (Semua M1-M2) | ⭐⭐⭐ $\le$ 14<br>⭐⭐ $\le$ 16<br>⭐ $\le$ 24 | Sirkuit benteng besar dengan 2 jurang, 2 laser, dan 3 kristal energi (14 balok optimal). |

---

### MODUL 3: PERULANGAN LOOP BERAPIT (Level 11 - 15)
Fokus: Efisiensi kode menggunakan kontainer `ULANGI(X) { ... }` pada arena luas berirama panjang.

| No | Nama Level | Jumlah Lantai | Konsep Logika Utama | Balok Terbuka | Ambang Bintang | Catatan Solusi Arena |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **11** | **Koridor Panjang: Angka X** | **22 Ubin** | Pengenalan Balok `ULANGI(X)` | + `ULANGI` | ⭐⭐⭐ $\le$ 3<br>⭐⭐ $\le$ 5<br>⭐ $\le$ 8 | Runway 6 langkah: `ULANGI(6x) { Maju }` + Ambil (3 balok). |
| **12** | **Loop Ritme Melompat** | **25 Ubin** | Loop Mengulang Gerak + Lompat | (Semua M1-M3) | ⭐⭐⭐ $\le$ 4<br>⭐⭐ $\le$ 6<br>⭐ $\le$ 12 | 3 Kepulauan jurang: `ULANGI(3x) { Maju, Lompat }` (4 balok). |
| **13** | **Loop Persegi Taman** | **28 Ubin** | Loop Mengitari 4 Sisi Persegi | (Semua M1-M3) | ⭐⭐⭐ $\le$ 5<br>⭐⭐ $\le$ 8<br>⭐ $\le$ 18 | `ULANGI(4x) { Maju 2x, Ambil, Belok }` mengambil 4 kristal di 4 sudut! |
| **14** | **Maraton Laser Berirama** | **30 Ubin** | Loop Mengulang Halangan Laser | (Semua M1-M3) | ⭐⭐⭐ $\le$ 4<br>⭐⭐ $\le$ 7<br>⭐ $\le$ 14 | 4 Pos laser: `ULANGI(4x) { Tunduk, Maju, Ambil }` (4 balok). |
| **15** | **Rintangan Silang Akbar** | **34 Ubin** | Kombo Loop Jurang + Laser (Ujian M3) | (Semua M1-M3) | ⭐⭐⭐ $\le$ 5<br>⭐⭐ $\le$ 8<br>⭐ $\le$ 18 | 3 Benteng kembar: `ULANGI(3x) { Lompat, Tunduk, Maju, Ambil }` (5 balok). |

---

### MODUL 4: MASTER DEBUGGING & OPTIMASI (Level 16 - 20)
Fokus: Arena luas penuh rintangan di mana siswa meng-audit program bawaan yang bermasalah.

| No | Nama Level | Jumlah Lantai | Tipe Bug yang Dihadapi | Ambang Bintang | Perbaikan yang Benar |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **16** | **Debug: Jurang di Jembatan** | **28 Ubin** | *Off-by-One Error* (Kelebihan Langkah) | ⭐⭐⭐ $\le$ 8<br>⭐⭐ $\le$ 9<br>⭐ $\le$ 14 | Pangkas 1 balok `MAJU` berlebih di ruas kedua agar robot tidak jatuh (8 balok). |
| **17** | **Debug: Tersesat di Labirin** | **30 Ubin** | *Orientation Error* (Salah Belok Masuk Laser) | ⭐⭐⭐ $\le$ 7<br>⭐⭐ $\le$ 8<br>⭐ $\le$ 14 | Ganti `PUTAR KANAN` menjadi `PUTAR KIRI` menuju lorong 2 kristal (7 balok). |
| **18** | **Debug: Stepper Mogok** | **32 Ubin** | *Loop Count Error* (Kurang Siklus) | ⭐⭐⭐ $\le$ 4<br>⭐⭐ $\le$ 6<br>⭐ $\le$ 8 | Naikkan angka stepper loop dari 2x menjadi 3x dengan tombol `[+]` (4 balok). |
| **19** | **Debug: Ritme Terbalik** | **35 Ubin** | *Action Sequence Inversion* di dalam Loop | ⭐⭐⭐ $\le$ 5<br>⭐⭐ $\le$ 7<br>⭐ $\le$ 12 | Tukar aksi di dalam loop: `LOMPAT` jurang dulu, baru `TUNDUK` laser (5 balok optimal). |
| **20** | **GRAND CHAMPIONSHIP** | **42 Ubin** | **Ujian Kelulusan Master Pemrograman (Stadion Akbar)** | ⭐⭐⭐ $\le$ 13<br>⭐⭐ $\le$ 16<br>⭐ $\le$ 20 | Audit program stadion kolosal 42 ubin: perbaiki belokan kiri, seberangi jurang, dan raih 3 Kristal Mahkota Juara (13 balok)! |

---

## ♻️ SORT-BOT: Robot Pemilah Sampah Pintar (`sortbot.html`)
- **Tujuan Pembelajaran:** Memahami logika percabangan kondisi:
  - `JIKA (Kondisi) MAKA Tindakan` (`IF`)
  - `LAINNYA JIKA (Kondisi) MAKA Tindakan` (`ELSE IF`)
  - `LAINNYA MAKA Tindakan` (`ELSE`)
- **Tema:** Pabrik Daur Ulang Ramah Lingkungan (Pilah Sampah Plastik 🟡, Organik 🟢, Kertas 🔵, dan Logam 🔴).
- **Jumlah Level:** 5 Level Progresif (Total 15 ⭐).
- **Akses:** Dapat dibuka langsung melalui tautan di Lobby `index.html` atau membuka file `sortbot.html`.

---

## 👗 OUTFIT-BOT: Robot Lemari Seragam Pintar (`outfitbot.html`)
- **Tujuan Pembelajaran:** Memahami konsep prosedur fungsi dan parameter:
  - **Fungsi (`FUNCTION`):** Membungkus serangkaian langkah persiapan pakaian sekolah menjadi 1 cetak biru yang rapi agar tidak ditulis berulang-ulang.
  - **Parameter:** Variabel masukan yang membedakan warna baju, warna bawahan, dan atribut untuk hari-hari sekolah yang berbeda (Senin s.d. Jumat).
- **Tema:** Robot Lemari Seragam Sekolah (Upacara Senin, Hari Biasa, Batik Rabu, Khusus Kamis, Pramuka Jumat).
- **Jumlah Level:** 5 Level Progresif (Total 15 ⭐).
- **Akses:** Dapat dibuka langsung melalui tautan di Lobby `index.html` atau membuka file `outfitbot.html`.

---

## 🏆 Total Skor Ekosistem Pembelajaran
- **ALGO-BOT (20 Level):** 60 Bintang ⭐
- **SORT-BOT (5 Level):** 15 Bintang ⭐
- **OUTFIT-BOT (5 Level):** 15 Bintang ⭐
- **Total Prestasi Siswa:** **90 Bintang Koding Gemilang!**
