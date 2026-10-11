# ATURAN & STANDAR PENGEMBANGAN: ALGO-BOT / KKN PROJECT

Dokumen ini berisi prinsip mutlak dan tidak boleh dilanggar dalam pengembangan aplikasi web di repositori ini.

---

## 1. Konteks Penggunaan: Media Visual Interaktif Proyektor Kelas
* **Bukan Game Gadget Individual**: Aplikasi ini **TIDAK** dirancang untuk dimainkan satu per satu oleh siswa SD di smartphone, tablet, atau gadget pribadi.
* **Proyektor Depan Kelas**: Aplikasi disiarkan oleh pengajar / mahasiswa KKN melalui **layar proyektor** di depan kelas agar disaksikan oleh seluruh siswa bersama-sama.
* **Lembar Kertas Soal Fisik**: Siswa SD memegang **kertas soal fisik** di meja mereka yang soalnya diselaraskan dengan apa yang tampil di layar proyektor.
* **Alur Pembelajaran**: Siswa membaca aturan/misi di layar proyektor -> berpikir dan mengerjakan di kertas soal -> fasilitator menguji kode/logika di proyektor untuk melihat hasil simulasi robot bersama-sama.

---

## 2. Hierarki Visual: Aturan & Cara Main Harus Besar
* **Aturan & Cara Main / Soal Tantangan Wajib Berukuran Besar**:
  * Teks **Misi**, **Aturan Pemilahan**, **Soal Tantangan**, dan **Cetak Biru Aturan** harus berukuran **besar, kontras tinggi, tebal, dan sangat mudah terbaca dari jarak jauh** (bahkan oleh siswa yang duduk di bangku paling belakang kelas).
* **Jangan Membesarkan Hal-Hal Lain**:
  * Elemen non-esensial (seperti dekorasi hiasan, log telemetri teknis, tombol-tombol navigasi sekunder, icon hiasan) **TIDAK BOLEH** dibuat terlalu besar atau mendominasi layar.
  * Hindari visual clutter yang mengaburkan perhatian siswa dari aturan/soal utama.

---

## 3. Pedagogi Critical Thinking (Anti-Spoiler & No Spoon-Feeding)
* **Jangan Memberikan Jawaban Sebagai Petunjuk**:
  * Dilarang membuat petunjuk/clue yang secara gamblang membocorkan jawaban atau mendiktekan instruksi sintaks teknis (misal: jangan menuliskan label `(ELSE)` pada petunjuk; cukup jelaskan aturan logis dunianya: *"Semua sampah lainnya ➔ Tong Hijau"*, biarkan siswa yang menyimpulkan konsep kodingnya).
* **Tanpa Placeholder Bocoran Jawaban**:
  * Kolom input kode harus bersih. Tidak boleh ada teks placeholder abu-abu yang membocorkan kode pemanggilan fungsi.
* **Tanpa Tombol Bantuan Instan / Shortcut**:
  * Jangan menyediakan tombol auto-fill / quick-snippets yang langsung mengisi jawaban. Siswa harus merumuskan dan menuliskan pemanggilan fungsi atau memilih opsi secara mandiri.
* **Tujuan Edukasi**:
  * Melatih kemampuan **berpikir kritis (*critical thinking*)**, menganalisis skenario, dan menerjemahkan masalah dunia nyata ke logika algoritma (seperti IF-ELSE atau Pemanggilan Fungsi & Parameter).

## 4. Kebersihan Kode: Hapus Kode & File yang Tidak Terpakai (No Dead Code & Unused Files)
* **Selalu Hapus Baris Kode yang Tidak Terpakai**: Fungsi usang, selector CSS yang sudah tidak dipakai, komentar lama yang tidak relevan, atau variabel tak bertuan harus segera dibersihkan.
* **Hapus File yang Jelas-Jelas Tidak Digunakan**: Dilarang membiarkan file sampah menumpuk (seperti sisa screenshot sementara, file mockup lawas yang sudah diganti, file duplikat, atau skrip uji coba yang usang).
* **Kerapian & Efisiensi**: Jaga basis kode tetap bersih, terorganisir, modular, dan hanya menyimpan file yang benar-benar aktif digunakan dalam proyek.

---

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
<!-- antislop:end -->
