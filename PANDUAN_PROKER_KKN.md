# Panduan & Laporan Program Kerja KKN Tematik
## "Pengenalan Logika Pemrograman Dasar Melalui Media Visual Interaktif (ALGO-BOT)"
### Media Visual Interaktif Pengenalan Logika Pemrograman & Pola Pikir Komputasi untuk Siswa Sekolah Dasar (SD)

---

### 1. Informasi & Deskripsi Program
* **Nama Program Kerja:** Pengenalan Logika Pemrograman Dasar Melalui Media Visual Interaktif (ALGO-BOT)
* **Sasaran Program:** Siswa Sekolah Dasar (SD Negeri Baluwarti, Kelas 3 – 6).
* **Fokus Keilmuan:** Teknik Informatika / Sistem Informasi (Logika Komputasi & Pemrograman Dasar).
* **Kesesuaian Kurikulum:** Selaras dengan **Kurikulum Merdeka**, di mana materi literasi digital dan pengenalan logika komputasi telah menjadi bagian penguatan penalaran kritis siswa.
* **Deskripsi Program:** Pembelajaran pengenalan logika pemrograman dasar dan pola pikir terstruktur (*computational thinking*) kepada siswa sekolah dasar menggunakan media visual interaktif simulasi respon instruksi berbasis web yang ramah anak dan tanpa sintaks rumit.
* **Tujuan Program:** 
  1. Mengenalkan konsep dasar logika pemrograman (runtutan, percabangan, perulangan, dan modularitas) secara visual dan intuitif.
  2. Melatih kemampuan pemecahan masalah (*problem solving*) dan berpikir analitis-sistematis sejak dini.
  3. Menyediakan media pembelajaran digital yang interaktif, aplikatif, dan mudah diakses melalui proyektor kelas maupun gawai.

---

### 2. Teknologi Tepat Guna (TTG) & Peralatan
* **Perangkat Keras (Hardware):** Laptop pemateri, proyektor LCD/layar monitor kelas, perangkat audio/speaker pengarah suara.
* **Perangkat Lunak (Software):** Media visual interaktif web "ALGO-BOT" (berjalan langsung via browser modern tanpa perlu instalasi rumit).
* **Media Cetak / Pendukung:** Lembar kerja aktivitas siswa (*worksheet/kertas soal*), alat tulis, dan lembar panduan sederhana.

---

### 3. Teknis & Runtutan Pelaksanaan

#### A. Teknis Persiapan & Koordinasi
* Melakukan bimbingan dan koordinasi bersama Dosen Pembimbing Lapangan (DPL) terkait materi serta rencana aksi program kerja.
* Melakukan koordinasi resmi dengan pihak pimpinan dan wali kelas SD Negeri Baluwarti terkait penentuan jadwal, alokasi ruang/kelas, serta jumlah siswa yang menjadi peserta.
* Menyiapkan bahan ajar visual, perangkat presentasi, serta mencetak lembar soal aktivitas siswa.

#### B. Rincian Langkah Pelaksanaan di Kelas (45 – 60 Menit)
1. **Koordinasi & Pembukaan:** Membuka sesi pembelajaran, memperkenalkan pemateri, dan menciptakan suasana belajar yang interaktif serta menyenangkan.
2. **Penyiapan Fasilitas:** Menyiapkan peralatan presentasi (laptop, proyektor, sound/speaker) serta membagikan lembar aktivitas.
3. **Penyampaian Konsep:** Memberikan penjelasan konsep dasar logika algoritma dan instruksi komputer menggunakan analogi kegiatan sehari-hari yang mudah dipahami anak SD.
4. **Demonstrasi Interaktif:** Mendemonstrasikan cara kerja instruksi balok dan simulasi visual respon gerak robot secara langsung di layar proyektor.
5. **Latihan Terstruktur (*Problem Solving*):** Membagikan lembar soal logika kepada siswa untuk merancang susunan urutan instruksi yang tepat secara mandiri maupun berkelompok.
6. **Uji Coba Langsung (*Live Verification*):** Mengundang perwakilan siswa untuk menguji coba dan membuktikan susunan instruksinya langsung ke dalam simulasi visual di depan kelas.
7. **Refleksi & Penutup:** Membahas hasil pengerjaan bersama, memberikan apresiasi kepada seluruh siswa, menarik kesimpulan pembelajaran, dan mendokumentasikan kegiatan.

---

### 4. Integrasi Konsep Logika Pemrograman yang Dikenalkan

Ekosistem media visual interaktif KKN ini terdiri dari dua web game terpadu yang saling melengkapi:

#### A. Media Utama: ALGO-BOT (25 Level Labirin 3D)
| No | Konsep Logika | Konsep Dasar | Penerapan Nyata di ALGO-BOT |
| :--- | :--- | :--- | :--- |
| **1** | **Algoritma Runtutan (*Sequence*)** | Menyusun instruksi langkah demi langkah secara runtut dari awal hingga tujuan akhir. | Memasang balok urutan `MAJU`, `PUTAR KANAN`, `PUTAR KIRI`, dan `AMBIL` untuk mengarahkan robot. |
| **2** | **Kondisi Spasial & Elevasi** | Menyesuaikan instruksi terhadap perubahan kondisi fisik atau ketinggian rintangan. | Balok `LOMPAT` untuk melewati celah jurang dan `TUNDUK` meluncur di bawah sinar laser. |
| **3** | **Perulangan (*Loop*)** | Meringkas rangkaian aksi berulang menggunakan kontainer penjepit C-Clamp Code.org. | Balok kontainer `ULANGI(X)` dengan tombol stepper `[-] X [+]` untuk mengulang gerak atau kombo rintangan. |
| **4** | **Dekomposisi & Prosedur (*Function*)** | Memecah tugas kompleks menjadi sub-prosedur yang dapat digunakan kembali (*reusability*). | Balok `KOTAK F1`: mengemas serangkaian perintah ke dalam satu fungsi mandiri yang dipanggil dari program utama. |
| **5** | ***Debugging* (Pelacakan Bug)** | Melatih ketelitian menemukan kesalahan instruksi dan memperbaikinya secara logis. | Menelusuri balok keliru langkah-demi-langkah menggunakan mode Debug (`⏭️`) lalu membetulkannya. |

#### B. Media Terdedikasi: SORT-BOT (5 Level Robot Pemilah Sampah)
| No | Konsep Logika | Konsep Dasar | Penerapan Nyata di SORT-BOT (P5 Lingkungan) |
| :--- | :--- | :--- | :--- |
| **1** | **Percabangan Tunggal (*IF*)** | Menjalankan aksi spesifik jika kondisi terpenuhi. | `JIKA (Sampah == Plastik) ➔ Masukkan ke Tong Kuning 🟡`. |
| **2** | **Percabangan Ganda (*IF - ELSE*)** | Menentukan dua jalur aksi berbeda berdasarkan kondisi objek dinamis. | `JIKA (Organik) ➔ Tong Hijau 🟢, LAINNYA ➔ Tong Kuning 🟡`. |
| **3** | **Multi-Kondisi / Bersarang (*Nested IF*)** | Memilah kategori beragam secara otomatis di ban berjalan daur ulang. | Memilah 4 kategori (Organik, Anorganik/Plastik, Logam/B3, Kertas) selaras Kurikulum Merdeka P5. |

