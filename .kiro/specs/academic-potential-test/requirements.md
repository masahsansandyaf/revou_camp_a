# Requirements Document

## Introduction

Website Tes Potensi Akademik (Academic Potential Test) adalah platform berbasis web yang memungkinkan pengguna untuk mengukur kemampuan akademik mereka melalui serangkaian soal terstruktur. Platform ini mencakup modul tes meliputi kemampuan verbal, numerik, dan logika/penalaran. Pengguna dapat mengerjakan tes secara mandiri, melihat hasil dan skor mereka, serta mendapatkan interpretasi hasil yang informatif. Platform ini ditujukan untuk calon mahasiswa, peserta seleksi kerja, atau siapa saja yang ingin mengukur potensi akademik mereka.

## Glossary

- **Platform**: Sistem website tes potensi akademik secara keseluruhan.
- **Pengguna**: Individu yang mengakses platform untuk mengerjakan tes.
- **Admin**: Pengelola platform yang memiliki akses penuh untuk mengelola soal dan data tes.
- **Sesi_Tes**: Satu sesi pengerjaan tes yang dimulai dan diakhiri oleh pengguna.
- **Soal**: Satu butir pertanyaan beserta pilihan jawaban dalam tes.
- **Paket_Tes**: Kumpulan soal yang dikelompokkan berdasarkan kategori atau tingkat kesulitan.
- **Kategori_Tes**: Pengelompokan jenis tes, yaitu Verbal, Numerik, dan Logika.
- **Hasil_Tes**: Rekap skor dan interpretasi yang dihasilkan setelah pengguna menyelesaikan sesi tes.
- **Timer**: Penghitung waktu mundur yang berjalan selama sesi tes berlangsung.
- **Skor**: Nilai numerik yang dihitung berdasarkan jumlah jawaban benar pengguna.
- **Leaderboard**: Papan peringkat yang menampilkan perbandingan skor antar pengguna.

---

## Requirements

### Requirement 1: Registrasi dan Autentikasi Pengguna

**User Story:** Sebagai pengguna, saya ingin mendaftar dan masuk ke platform, sehingga data dan hasil tes saya tersimpan dan terhubung ke akun saya.

#### Acceptance Criteria

1. THE Platform SHALL menyediakan formulir registrasi dengan kolom nama lengkap (maksimal 100 karakter), alamat email (maksimal 254 karakter), dan kata sandi (minimal 8 karakter, maksimal 128 karakter).
2. WHEN pengguna mengirimkan formulir registrasi dengan email yang sudah terdaftar, THEN THE Platform SHALL menampilkan pesan kesalahan "Email sudah terdaftar".
3. IF pengguna mengirimkan formulir registrasi dengan format email tidak valid atau kata sandi kurang dari 8 karakter atau nama lengkap kosong, THEN THE Platform SHALL menampilkan pesan kesalahan yang mengidentifikasi kolom yang tidak valid tanpa memproses pendaftaran.
4. WHEN pengguna mengirimkan formulir registrasi dengan data yang valid, THE Platform SHALL membuat akun baru dengan status belum terverifikasi dan mengirimkan email verifikasi ke alamat email yang didaftarkan dalam waktu 30 detik.
5. WHEN pengguna mengklik tautan verifikasi email yang valid, THE Platform SHALL mengaktifkan akun pengguna dan mengarahkan pengguna ke halaman login.
6. IF pengguna mengklik tautan verifikasi email yang sudah kedaluwarsa (lebih dari 24 jam), THEN THE Platform SHALL menampilkan pesan kesalahan yang mengindikasikan tautan tidak valid dan menawarkan opsi untuk mengirim ulang email verifikasi.
7. WHEN pengguna mengirimkan formulir login dengan kredensial yang valid, THE Platform SHALL membuat sesi autentikasi dan mengarahkan pengguna ke halaman utama dalam waktu 3 detik.
8. IF pengguna mengirimkan formulir login dengan kredensial yang tidak valid, THEN THE Platform SHALL menampilkan pesan kesalahan "Email atau kata sandi salah" tanpa mengungkapkan detail mana yang salah.
9. IF pengguna mengirimkan formulir login dengan kredensial yang tidak valid sebanyak 5 kali berturut-turut, THEN THE Platform SHALL memblokir percobaan login dari akun tersebut selama 15 menit dan menampilkan pesan yang mengindikasikan durasi pemblokiran.
10. WHEN pengguna memilih opsi "Lupa Kata Sandi", THE Platform SHALL mengirimkan tautan reset kata sandi ke alamat email terdaftar pengguna dalam waktu 30 detik, dan tautan tersebut berlaku selama 1 jam.
11. THE Platform SHALL mengakhiri sesi autentikasi secara otomatis setelah 60 menit tidak ada aktivitas dan mengarahkan pengguna ke halaman login.

---

### Requirement 2: Pemilihan dan Konfigurasi Paket Tes

**User Story:** Sebagai pengguna, saya ingin memilih jenis dan paket tes yang ingin saya kerjakan, sehingga saya dapat menyesuaikan tes dengan kebutuhan saya.

#### Acceptance Criteria

1. THE Platform SHALL menampilkan daftar Paket_Tes yang tersedia, di mana setiap entri memuat nama paket, deskripsi singkat maksimal 300 karakter, jumlah soal, batas waktu dalam menit, dan Kategori_Tes yang tercakup.
2. WHEN pengguna memilih sebuah Paket_Tes, THE Platform SHALL menampilkan halaman konfirmasi yang memuat nama paket, deskripsi, jumlah soal, batas waktu dalam menit, daftar Kategori_Tes, instruksi pengerjaan, dan tombol untuk memulai tes.
3. THE Platform SHALL menyediakan minimal tiga Kategori_Tes: Verbal, Numerik, dan Logika.
4. WHERE fitur tes simulasi tersedia, THE Platform SHALL menyediakan Paket_Tes simulasi yang menggabungkan ketiga Kategori_Tes dengan minimal 5 soal per Kategori_Tes dalam satu sesi.
5. IF pengguna belum login dan mencoba memulai tes, THEN THE Platform SHALL mengarahkan pengguna ke halaman login dan setelah login berhasil mengarahkan kembali ke halaman konfirmasi Paket_Tes yang dipilih sebelumnya.

---

### Requirement 3: Pengerjaan Tes

**User Story:** Sebagai pengguna, saya ingin mengerjakan tes dengan antarmuka yang jelas dan nyaman, sehingga saya dapat fokus menjawab soal.

#### Acceptance Criteria

1. WHEN sesi tes dimulai, THE Platform SHALL menampilkan satu Soal per tampilan beserta pilihan jawaban dalam format pilihan ganda dengan 2 hingga 5 pilihan jawaban.
2. WHILE Sesi_Tes berlangsung, THE Platform SHALL menampilkan Timer yang menghitung mundur dari batas waktu Paket_Tes dengan pembaruan setiap 1 detik.
3. WHILE Sesi_Tes berlangsung, THE Platform SHALL menampilkan indikator progres yang menunjukkan nomor soal saat ini dan total jumlah soal.
4. WHEN pengguna memilih sebuah jawaban, THE Platform SHALL menyimpan pilihan jawaban tersebut secara otomatis.
5. WHILE Sesi_Tes berlangsung, WHEN pengguna memilih jawaban yang berbeda pada soal yang sama, THE Platform SHALL mengganti pilihan jawaban yang tersimpan dengan pilihan jawaban yang baru.
6. WHEN pengguna menekan tombol navigasi, THE Platform SHALL memindahkan tampilan ke soal sebelumnya atau berikutnya dengan pilihan jawaban yang sudah tersimpan tetap ditampilkan, kecuali pada soal pertama di mana tombol "Sebelumnya" tidak ditampilkan dan pada soal terakhir di mana tombol "Berikutnya" tidak ditampilkan.
7. IF Timer mencapai nol, THEN THE Platform SHALL secara otomatis mengakhiri Sesi_Tes dan menyimpan seluruh jawaban yang telah dipilih hingga saat itu.
8. WHILE Sesi_Tes berlangsung, WHEN pengguna menekan tombol "Selesai", THE Platform SHALL menampilkan dialog konfirmasi yang menginformasikan jumlah soal yang belum dijawab sebelum mengakhiri sesi.
9. IF koneksi internet pengguna terputus selama Sesi_Tes berlangsung, THEN THE Platform SHALL menyimpan seluruh jawaban yang telah dipilih hingga saat itu secara lokal.
10. WHEN koneksi internet pulih setelah sebelumnya terputus selama Sesi_Tes, THE Platform SHALL menyinkronisasikan seluruh jawaban yang tersimpan secara lokal ke server dalam waktu paling lama 10 detik setelah koneksi terdeteksi kembali.

---

### Requirement 4: Penilaian dan Kalkulasi Skor

**User Story:** Sebagai pengguna, saya ingin mendapatkan skor yang akurat setelah tes selesai, sehingga saya mengetahui hasil kemampuan saya secara objektif.

#### Acceptance Criteria

1. WHEN Sesi_Tes berakhir, THE Platform SHALL menghitung Skor_Keseluruhan berdasarkan jumlah jawaban benar dibagi total jumlah soal dikalikan 100, dibulatkan hingga 2 angka desimal, menghasilkan nilai dalam rentang 0.00 hingga 100.00.
2. WHEN Sesi_Tes berakhir, THE Platform SHALL menghitung Skor_Kategori secara terpisah untuk setiap Kategori_Tes yang ada dalam Paket_Tes menggunakan formula yang sama dengan Skor_Keseluruhan.
3. WHEN Sesi_Tes berakhir, THE Platform SHALL menyimpan Hasil_Tes ke dalam basis data yang terhubung ke akun pengguna dalam waktu tidak lebih dari 5 detik, dan menampilkan konfirmasi keberhasilan penyimpanan kepada pengguna.
4. IF terjadi kegagalan penyimpanan Hasil_Tes ke basis data, THEN THE Platform SHALL menampilkan pesan kesalahan yang mengindikasikan kegagalan penyimpanan kepada pengguna.
5. IF terjadi kegagalan penyimpanan Hasil_Tes ke basis data, THEN THE Platform SHALL menyimpan data Hasil_Tes secara lokal sebagai cadangan agar tidak ada data yang hilang.

---

### Requirement 5: Tampilan Hasil Tes

**User Story:** Sebagai pengguna, saya ingin melihat hasil tes saya secara lengkap dan mudah dipahami, sehingga saya dapat mengevaluasi kemampuan akademik saya.

#### Acceptance Criteria

1. WHEN Sesi_Tes berakhir, THE Platform SHALL menampilkan halaman Hasil_Tes dalam waktu ≤3 detik, yang memuat Skor_Total, Skor per Kategori_Tes, dan interpretasi kemampuan pengguna.
2. WHEN halaman Hasil_Tes ditampilkan, THE Platform SHALL menampilkan label kategori kemampuan berdasarkan Skor_Total sebagai berikut: "Di Bawah Rata-rata" untuk skor 0–49, "Rata-rata" untuk skor 50–69, "Di Atas Rata-rata" untuk skor 70–84, dan "Unggul" untuk skor 85–100.
3. WHEN halaman Hasil_Tes ditampilkan, THE Platform SHALL menampilkan pembahasan jawaban untuk setiap Soal yang memuat jawaban pengguna, jawaban benar, dan penjelasan maksimal 300 karakter.
4. WHEN pengguna menekan tombol "Unduh Hasil", THE Platform SHALL menghasilkan file PDF yang berisi Skor_Total, Skor per Kategori_Tes, label kategori kemampuan, dan tanggal pelaksanaan tes.
5. IF proses pembuatan file PDF gagal, THEN THE Platform SHALL menampilkan pesan kesalahan yang mengindikasikan kegagalan unduhan tanpa mengubah data Hasil_Tes yang tersimpan.
6. THE Platform SHALL menyimpan riwayat seluruh Hasil_Tes pengguna, dan WHEN pengguna mengakses halaman profil, THE Platform SHALL menampilkan daftar riwayat Hasil_Tes tersebut.

---

### Requirement 6: Riwayat dan Perkembangan Pengguna

**User Story:** Sebagai pengguna, saya ingin melihat riwayat tes dan perkembangan skor saya dari waktu ke waktu, sehingga saya dapat melacak kemajuan belajar saya.

#### Acceptance Criteria

1. WHEN pengguna mengakses halaman riwayat tes, THE Platform SHALL menampilkan daftar seluruh Sesi_Tes yang telah diselesaikan, diurutkan berdasarkan waktu penyelesaian dari yang terbaru, dengan maksimal 20 entri per halaman.
2. IF pengguna belum menyelesaikan Sesi_Tes manapun, THEN THE Platform SHALL menampilkan pesan informatif yang mengindikasikan bahwa belum ada riwayat tes yang tersedia.
3. IF pengguna telah menyelesaikan minimal 2 Sesi_Tes untuk Paket_Tes yang sama, THEN THE Platform SHALL menampilkan grafik perkembangan Skor pengguna dengan sumbu-Y berskala 0–100 dan sumbu-X menampilkan waktu penyelesaian secara kronologis.
4. WHEN pengguna memilih entri riwayat tertentu, THE Platform SHALL menampilkan detail Hasil_Tes yang memuat nama Paket_Tes, waktu penyelesaian, Skor, jumlah jawaban benar, jumlah jawaban salah, dan jawaban pengguna per soal.

---

### Requirement 7: Leaderboard dan Perbandingan Skor

**User Story:** Sebagai pengguna, saya ingin membandingkan skor saya dengan pengguna lain, sehingga saya mengetahui posisi saya secara relatif.

#### Acceptance Criteria

1. WHERE fitur Leaderboard diaktifkan, THE Platform SHALL menampilkan peringkat 100 pengguna teratas berdasarkan Skor tertinggi per Paket_Tes, dengan setiap entri mencantumkan nomor peringkat, nama pengguna, dan nilai Skor.
2. WHERE fitur Leaderboard diaktifkan, THE Platform SHALL menampilkan posisi peringkat pengguna yang sedang login di antara seluruh peserta, termasuk nomor peringkat dan nilai Skor pengguna tersebut.
3. WHERE fitur Leaderboard diaktifkan, IF pengguna yang sedang login belum menyelesaikan Sesi_Tes untuk Paket_Tes yang dipilih, THEN THE Platform SHALL menampilkan indikasi bahwa peringkat pengguna tidak tersedia untuk paket tersebut.
4. WHEN pengguna memilih Paket_Tes tertentu di halaman Leaderboard, THE Platform SHALL memfilter dan menampilkan peringkat yang relevan untuk paket tersebut dalam waktu tidak lebih dari 3 detik.
5. WHEN pengguna yang memiliki lebih dari satu Sesi_Tes untuk Paket_Tes yang sama terdaftar di Leaderboard, THE Platform SHALL menggunakan hanya nilai Skor tertinggi dari seluruh Sesi_Tes pengguna tersebut untuk menentukan peringkatnya.
6. THE Platform SHALL memperbarui data Leaderboard dalam waktu tidak lebih dari 60 detik setelah Sesi_Tes baru diselesaikan.
7. IF data Leaderboard tidak dapat dimuat, THEN THE Platform SHALL menampilkan pesan kesalahan yang menginformasikan pengguna bahwa data tidak tersedia dan meminta pengguna untuk mencoba kembali.

---

### Requirement 8: Manajemen Soal oleh Admin

**User Story:** Sebagai admin, saya ingin mengelola bank soal secara efisien, sehingga konten tes selalu relevan, akurat, dan berkualitas.

#### Acceptance Criteria

1. THE Platform SHALL menyediakan antarmuka admin untuk membuat, membaca, memperbarui, dan menghapus Soal.
2. WHEN admin membuat Soal baru, THE Platform SHALL memvalidasi bahwa Soal memiliki teks pertanyaan, antara 2 hingga 5 pilihan jawaban, tepat satu jawaban benar yang ditandai, dan Kategori_Tes yang dipilih.
3. IF admin mengirimkan formulir Soal yang tidak memenuhi kriteria validasi, THEN THE Platform SHALL menampilkan pesan kesalahan yang menjelaskan field mana yang tidak valid.
4. WHEN admin mengatur Soal ke dalam Paket_Tes, THE Platform SHALL memungkinkan admin menentukan jumlah soal antara 10 hingga 100, urutan soal, dan batas waktu antara 1 hingga 180 menit untuk setiap paket.
5. WHEN admin mengaktifkan sebuah Paket_Tes, THE Platform SHALL memvalidasi bahwa paket tersebut memiliki antara 10 hingga 100 Soal, dan jika valid mengubah status paket menjadi aktif dan dapat diakses oleh pengguna.
6. IF Paket_Tes yang akan diaktifkan memiliki kurang dari 10 Soal atau lebih dari 100 Soal, THEN THE Platform SHALL menampilkan pesan kesalahan yang mengindikasikan jumlah soal tidak memenuhi syarat dan mempertahankan status paket sebagai tidak aktif.

---

### Requirement 9: Antarmuka yang Responsif dan Aksesibel

**User Story:** Sebagai pengguna, saya ingin mengakses platform dari berbagai perangkat, sehingga saya dapat mengerjakan tes kapan saja dan di mana saja.

#### Acceptance Criteria

1. THE Platform SHALL menampilkan antarmuka yang responsif pada layar dengan lebar mulai dari 320px hingga 2560px, sehingga tidak ada konten yang terpotong secara horizontal, tidak ada elemen yang saling tumpang tindih, dan semua elemen interaktif memiliki area sentuh minimal 44×44 piksel.
2. THE Platform SHALL memenuhi standar aksesibilitas WCAG 2.1 Level AA untuk seluruh halaman utama, termasuk halaman tes dan hasil, yang mencakup: rasio kontras warna minimal 4.5:1 untuk teks normal, label yang dapat dibaca oleh screen reader pada seluruh elemen interaktif, dan navigasi penuh menggunakan keyboard.
3. WHEN pengguna mengakses platform menggunakan browser yang didukung (Chrome versi 90 ke atas, Firefox versi 88 ke atas, Safari versi 14 ke atas, Edge versi 90 ke atas), THE Platform SHALL menampilkan seluruh fitur tanpa ada fungsi yang tidak dapat dioperasikan, konten yang tidak tampil, atau error yang terlihat oleh pengguna.
4. WHILE Sesi_Tes berlangsung pada perangkat mobile, THE Platform SHALL mengunci orientasi layar pada mode portrait sehingga rotasi fisik perangkat tidak mengubah orientasi tampilan.
