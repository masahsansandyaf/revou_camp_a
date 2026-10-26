# Implementation Plan: Academic Potential Test

## Overview

Implementasi platform Website Tes Potensi Akademik secara bertahap menggunakan React (TypeScript) untuk frontend dan Node.js + Express (TypeScript) untuk backend, dengan PostgreSQL sebagai database dan Redis untuk caching dan session management. Setiap task bersifat inkremental dan saling membangun sehingga tidak ada kode yang terisolasi.

## Tasks

- [-] 1. Setup project structure, shared types, dan environment
  - Inisialisasi monorepo atau dua folder terpisah (`/frontend`, `/backend`)
  - Setup TypeScript config, ESLint, Prettier, dan folder structure untuk backend (`src/routes`, `src/middleware`, `src/services`, `src/models`, `src/utils`)
  - Setup folder structure untuk frontend (`src/components`, `src/pages`, `src/hooks`, `src/services`, `src/types`, `src/utils`)
  - Definisikan semua shared TypeScript interfaces dan types dari Data Models: `User`, `TestCategory`, `Question`, `AnswerOption`, `TestPackage`, `PackageQuestion`, `TestSession`, `SavedAnswer`, `TestResult`, `CategoryScore`, `AbilityLabel`, `LeaderboardEntry`
  - Setup environment variables (`.env.example`) untuk `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `SMTP_*`
  - Setup database connection (Prisma atau TypeORM) dan Redis client
  - Setup testing framework: Jest + Supertest (backend), Vitest + React Testing Library (frontend), `fast-check` untuk PBT
  - _Requirements: 1.1, 2.1, 9.1_

- [ ] 2. Database schema dan migrations
  - [ ] 2.1 Buat Prisma schema (atau migration SQL) untuk semua tabel: `users`, `test_categories`, `questions`, `answer_options`, `test_packages`, `package_questions`, `test_sessions`, `session_answers`, `test_results`, `category_scores`
    - Definisikan foreign keys, indexes (email unique, package_question order), dan constraints
    - _Requirements: 1.1, 2.1, 4.1, 4.2, 6.1, 7.1_
  - [ ] 2.2 Seed data awal: 3 `TestCategory` (Verbal, Numerik, Logika) dan minimal satu `TestPackage` simulasi dengan soal contoh
    - _Requirements: 2.3, 2.4_

- [ ] 3. Backend: Auth module
  - [ ] 3.1 Implementasi `POST /api/auth/register` — validasi input (Zod schema: fullName min 1 max 100, email max 254 valid format, password min 8 max 128), cek email duplikat, hash password bcrypt cost 12, buat akun `unverified`, kirim email verifikasi dalam 30 detik
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 3.2 Write property test untuk validasi registrasi
    - **Property 9: Validasi Registrasi — Field Constraints**
    - **Validates: Requirements 1.1, 1.3**
  - [ ] 3.3 Implementasi `POST /api/auth/verify-email` — validasi token, aktivasi akun, handle token kedaluwarsa (> 24 jam)
    - _Requirements: 1.5, 1.6_
  - [ ] 3.4 Implementasi `POST /api/auth/resend-verification` — selalu return 200 (cegah email enumeration), rate limit 3x/jam/email
    - _Requirements: 1.6_
  - [ ] 3.5 Implementasi `POST /api/auth/login` — validasi kredensial, login attempt counter, lockout 15 menit setelah 5 gagal berturut-turut, buat JWT (HS256, exp 60 menit, `jti` unik) dan refresh token (UUID v4, httpOnly cookie), return `LoginResponse`
    - _Requirements: 1.7, 1.8, 1.9_
  - [ ]* 3.6 Write property test untuk rate limiting login
    - **Property 10: Rate Limiting Login**
    - **Validates: Requirements 1.9**
  - [ ] 3.7 Implementasi `POST /api/auth/forgot-password` dan `POST /api/auth/reset-password` — kirim link reset (berlaku 1 jam), validasi token hash, update password, rate limit 3x/jam/email
    - _Requirements: 1.10_
  - [ ] 3.8 Implementasi `POST /api/auth/refresh` — refresh token rotation (invalidasi token lama, buat yang baru, simpan hash di Redis), implementasi `POST /api/auth/logout` — blacklist JWT `jti` di Redis dengan TTL sisa
    - _Requirements: 1.11_
  - [ ] 3.9 Implementasi JWT middleware (`jwtMiddleware`) dan RBAC middleware (`requireRole`) — validasi token, cek blacklist Redis, attach `req.user`
    - _Requirements: 1.7, 1.11_
  - [ ]* 3.10 Write unit tests untuk Auth module
    - Registrasi berhasil, email duplikat, format email invalid, password pendek, nama kosong
    - Login berhasil → JWT dibuat; login gagal 5x → lockout aktif; request ke-6 ditolak
    - Token verifikasi kedaluwarsa → error + opsi resend
    - Refresh token rotation: token lama diinvalidasi setelah digunakan
    - _Requirements: 1.1–1.11_

- [ ] 4. Checkpoint — Pastikan semua tests auth pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Backend: Test Package dan Question API
  - [ ] 5.1 Implementasi `GET /api/packages` dan `GET /api/packages/:id` — kembalikan paket aktif beserta nama, deskripsi (maks 300 karakter), jumlah soal, batas waktu menit, daftar `Kategori_Tes`
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ] 5.2 Implementasi Admin Question CRUD: `GET/POST /api/admin/questions`, `GET/PUT/DELETE /api/admin/questions/:id` — validasi Zod: teks tidak kosong, 2–5 pilihan, tepat 1 `isCorrect`, `categoryId` valid; require role `admin`
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]* 5.3 Write property test untuk validasi input soal
    - **Property 4: Validasi Input Soal Menolak Konfigurasi Tidak Valid**
    - **Validates: Requirements 8.2**
  - [ ] 5.4 Implementasi Admin Package Management: `GET/POST /api/admin/packages`, `PUT /api/admin/packages/:id` — konfigurasi jumlah soal (10–100), urutan soal, batas waktu (1–180 menit); `POST /api/admin/packages/:id/activate` — validasi jumlah soal 10–100, ubah status `active`
    - _Requirements: 8.4, 8.5, 8.6_
  - [ ]* 5.5 Write property test untuk validasi paket tes
    - **Property 5: Validasi Paket Tes — Jumlah Soal**
    - **Validates: Requirements 8.5, 8.6**
  - [ ]* 5.6 Write unit tests untuk Admin module
    - Soal dengan 0 pilihan benar ditolak; soal dengan 2+ pilihan benar ditolak
    - Paket dengan 9 soal tidak bisa diaktifkan; paket dengan 101 soal tidak bisa diaktifkan
    - _Requirements: 8.2, 8.5, 8.6_

- [ ] 6. Backend: Test Session API
  - [ ] 6.1 Implementasi `POST /api/sessions` — buat `TestSession` baru (status `in_progress`), hitung `timeoutAt = startedAt + timeLimitMinutes`, kembalikan semua soal (tanpa `isCorrect`), handle 409 jika sesi aktif sudah ada
    - _Requirements: 3.1, 2.2_
  - [ ] 6.2 Implementasi `PUT /api/sessions/:id/answer` — simpan atau update `SavedAnswer`, validasi soal milik paket, handle 409 `SESSION_ALREADY_FINISHED` dan 410 `SESSION_TIMED_OUT`, ownership check
    - _Requirements: 3.4, 3.5_
  - [ ] 6.3 Implementasi `GET /api/sessions/:id` — ambil state sesi untuk resume (soal + jawaban tersimpan), ownership check
    - _Requirements: 3.9_
  - [ ] 6.4 Implementasi `POST /api/sessions/:id/sync` — batch upsert jawaban offline dengan timestamp comparison (skip jawaban lebih lama dari yang di server), kembalikan `synced`, `skipped`, `conflicts`; sinkronisasi dalam ≤10 detik
    - _Requirements: 3.9, 3.10_
  - [ ]* 6.5 Write property test untuk sinkronisasi jawaban offline
    - **Property 7: Jawaban Offline Tersinkronisasi Lengkap**
    - **Validates: Requirements 3.9, 3.10**
  - [ ] 6.6 Implementasi `POST /api/sessions/:id/finish` — selesaikan sesi, trigger kalkulasi skor (lihat Task 7), simpan `Hasil_Tes`, handle kasus timer sudah habis (auto-finish dari background job/cron atau middleware)
    - _Requirements: 3.7, 3.8_
  - [ ]* 6.7 Write unit tests untuk Test Session module
    - Timer auto-finish saat mencapai nol; navigasi soal menyimpan jawaban; dialog konfirmasi menampilkan jumlah soal belum dijawab; sync offline ≤10 detik
    - _Requirements: 3.2, 3.4, 3.7, 3.8, 3.9, 3.10_

- [ ] 7. Backend: Scoring dan Result API
  - [ ] 7.1 Implementasi fungsi `calculateTotalScore(correctCount, totalCount)` — formula: `round((C/N) * 100, 2)`, hasil dalam rentang `[0.00, 100.00]`; fungsi `calculateCategoryScore` per kategori dengan formula sama
    - _Requirements: 4.1, 4.2_
  - [ ]* 7.2 Write property test untuk kalkulasi skor keseluruhan
    - **Property 1: Kalkulasi Skor Keseluruhan Akurat**
    - **Validates: Requirements 4.1**
  - [ ]* 7.3 Write property test untuk kalkulasi skor kategori
    - **Property 2: Kalkulasi Skor Kategori Konsisten dengan Skor Keseluruhan**
    - **Validates: Requirements 4.2**
  - [ ] 7.4 Implementasi fungsi `getAbilityLabel(score): AbilityLabel` — "Di Bawah Rata-rata" (0–49), "Rata-rata" (50–69), "Di Atas Rata-rata" (70–84), "Unggul" (85–100)
    - _Requirements: 5.2_
  - [ ]* 7.5 Write property test untuk label kemampuan
    - **Property 3: Label Kemampuan Selalu Sesuai Rentang Skor**
    - **Validates: Requirements 5.2**
  - [ ] 7.6 Implementasi service `ScoreService.computeAndSaveResult(sessionId)` — panggil `calculateTotalScore`, `calculateCategoryScore`, `getAbilityLabel`, simpan `TestResult` ke DB dalam ≤5 detik, handle kegagalan simpan (log error + simpan ke cache lokal sebagai fallback)
    - _Requirements: 4.3, 4.4, 4.5_
  - [ ] 7.7 Implementasi `GET /api/results/:sessionId` — kembalikan `GetResultResponse` lengkap (skor total, skor per kategori, `answerReview` dengan `explanation`, ownership check)
    - _Requirements: 5.1, 5.3_
  - [ ] 7.8 Implementasi `GET /api/results/history` — pagination 20 per halaman, filter opsional `packageId`, sort by `completedAt` DESC
    - _Requirements: 6.1, 6.2_
  - [ ] 7.9 Implementasi `GET /api/results/:sessionId/pdf` — generate PDF dengan `pdf-lib` atau `puppeteer` berisi skor total, skor per kategori, label kemampuan, tanggal pelaksanaan; stream `application/pdf`; handle gagal generate (500, tanpa ubah data)
    - _Requirements: 5.4, 5.5_
  - [ ]* 7.10 Write unit tests untuk Scoring module
    - Skor 0 saat semua salah; skor 100 saat semua benar; pembulatan 2 desimal
    - _Requirements: 4.1, 4.2, 5.2_

- [ ] 8. Backend: Leaderboard API
  - [ ] 8.1 Implementasi `GET /api/leaderboard/:packageId` — query top 100 entri berdasarkan `bestScore` (skor tertinggi per user per paket), dengan caching Redis (stale ≤60 detik); implementasi `GET /api/leaderboard/:packageId/my-rank`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ] 8.2 Implementasi job/trigger async update leaderboard Redis dalam ≤60 detik setelah sesi selesai — gunakan fungsi `getBestScoreForLeaderboard(scores[])` yang mengembalikan `Math.max(...scores)`
    - _Requirements: 7.5, 7.6_
  - [ ]* 8.3 Write property test untuk leaderboard skor tertinggi
    - **Property 6: Leaderboard Menggunakan Skor Tertinggi**
    - **Validates: Requirements 7.5**
  - [ ]* 8.4 Write unit tests untuk Leaderboard module
    - Leaderboard diperbarui ≤60 detik; hanya skor tertinggi digunakan untuk peringkat; handle Redis tidak tersedia (fallback ke DB)
    - _Requirements: 7.1, 7.5, 7.6, 7.7_

- [ ] 9. Checkpoint — Pastikan semua tests backend pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Frontend: Auth pages dan routing
  - [ ] 10.1 Setup React Router, protected route wrapper (redirect ke login jika tidak terautentikasi, simpan intended route untuk redirect setelah login), dan layout dasar
    - _Requirements: 2.5_
  - [ ] 10.2 Implementasi `RegisterForm` — kolom nama lengkap, email, password dengan validasi real-time (nama maks 100, email valid, password min 8); tampilkan pesan error per field; submit ke `POST /api/auth/register`
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 10.3 Implementasi `LoginForm` — submit ke `POST /api/auth/login`, tampilkan "Email atau kata sandi salah", tampilkan pesan lockout beserta durasi 15 menit; implementasi auto-refresh access token via `POST /api/auth/refresh`; implementasi auto-logout setelah 60 menit inaktivitas (event listener)
    - _Requirements: 1.7, 1.8, 1.9, 1.11_
  - [ ] 10.4 Implementasi `EmailVerificationPage`, `ForgotPasswordForm`, `ResetPasswordForm` — alur verifikasi email, handle tautan kedaluwarsa + opsi resend, reset password
    - _Requirements: 1.5, 1.6, 1.10_
  - [ ]* 10.5 Write unit tests untuk Auth components
    - Validasi form registrasi (nama kosong, email invalid, password < 8); pesan error login; tampilan lockout
    - _Requirements: 1.1–1.9_

- [ ] 11. Frontend: Test Selection module
  - [ ] 11.1 Implementasi `PackageListPage` — fetch `GET /api/packages`, tampilkan nama, deskripsi (maks 300 karakter), jumlah soal, batas waktu, badge `CategoryBadge` per kategori
    - _Requirements: 2.1, 2.3_
  - [ ] 11.2 Implementasi `PackageDetailPage` — tampilkan detail paket (nama, deskripsi, jumlah soal, batas waktu, kategori, instruksi), tombol "Mulai Tes"; redirect ke login jika belum auth dengan simpan intended route
    - _Requirements: 2.2, 2.5_

- [ ] 12. Frontend: Test Session module
  - [ ] 12.1 Implementasi `TestSessionPage` sebagai orkestrator — fetch `POST /api/sessions` untuk buat sesi, kelola state jawaban (`Map<questionId, selectedOptionId>`), current question index, waktu tersisa; implementasi `OfflineSyncIndicator` (deteksi `navigator.onLine`, event listener `online`/`offline`)
    - _Requirements: 3.1, 3.9_
  - [ ] 12.2 Implementasi `TimerDisplay` — countdown dari `timeoutAt - now()` dengan update setiap 1 detik (gunakan `setInterval`); trigger auto-finish dan call `POST /api/sessions/:id/finish` saat Timer mencapai nol
    - _Requirements: 3.2, 3.7_
  - [ ] 12.3 Implementasi `QuestionDisplay` + `AnswerSelector` — tampilkan teks soal dan pilihan ganda (radio button 2–5 opsi); `ProgressIndicator` "Soal X dari N"; saat pilihan berubah call `PUT /api/sessions/:id/answer` secara otomatis (auto-save)
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  - [ ] 12.4 Implementasi `NavigationButtons` — tombol "Sebelumnya" (hidden di soal pertama) dan "Berikutnya" (hidden di soal terakhir); navigasi mempertahankan state jawaban tersimpan
    - _Requirements: 3.6_
  - [ ]* 12.5 Write property test untuk navigasi soal mempertahankan jawaban
    - **Property 8: Navigasi Soal Mempertahankan Jawaban Tersimpan**
    - **Validates: Requirements 3.6**
  - [ ] 12.6 Implementasi `FinishConfirmationDialog` — tampilkan jumlah soal belum dijawab; saat konfirmasi call `POST /api/sessions/:id/finish`; implementasi logika offline: simpan jawaban ke `localStorage` saat `navigator.onLine === false`, sinkronisasi via `POST /api/sessions/:id/sync` dalam ≤10 detik setelah koneksi pulih (`addEventListener('online', ...)`)
    - _Requirements: 3.8, 3.9, 3.10_
  - [ ]* 12.7 Write unit tests untuk Test Session components
    - Timer countdown dan auto-finish; auto-save jawaban; navigasi mempertahankan pilihan; dialog konfirmasi dengan jumlah belum dijawab; offline indicator muncul saat koneksi putus
    - _Requirements: 3.2, 3.4, 3.6, 3.7, 3.8, 3.9_

- [ ] 13. Frontend: Result module
  - [ ] 13.1 Implementasi `ResultPage` — fetch `GET /api/results/:sessionId`, tampilkan dalam ≤3 detik; `ScoreDisplay` (skor total + skor per kategori); `AbilityLabel` berdasarkan skor (Di Bawah Rata-rata/Rata-rata/Di Atas Rata-rata/Unggul)
    - _Requirements: 5.1, 5.2_
  - [ ] 13.2 Implementasi `AnswerReviewList` — daftar per soal dengan jawaban pengguna, jawaban benar (highlight berbeda), dan penjelasan (maks 300 karakter)
    - _Requirements: 5.3_
  - [ ] 13.3 Implementasi `DownloadPDFButton` — call `GET /api/results/:sessionId/pdf`, handle blob response, trigger download; tampilkan error jika gagal tanpa mengubah data hasil
    - _Requirements: 5.4, 5.5_
  - [ ] 13.4 Implementasi halaman profil dengan daftar riwayat hasil tes (via `GET /api/results/history`)
    - _Requirements: 5.6_

- [ ] 14. Frontend: History & Progress module
  - [ ] 14.1 Implementasi `HistoryPage` — daftar sesi selesai dengan pagination 20/halaman, sort terbaru di atas; tampilkan pesan informatif jika belum ada riwayat
    - _Requirements: 6.1, 6.2_
  - [ ] 14.2 Implementasi `ProgressChart` — grafik perkembangan skor (sumbu Y: 0–100, sumbu X: waktu kronologis); tampilkan hanya jika minimal 2 sesi untuk paket yang sama
    - _Requirements: 6.3_
  - [ ] 14.3 Implementasi `HistoryDetailPage` — detail satu sesi: nama paket, waktu selesai, skor, jumlah benar, jumlah salah, jawaban per soal
    - _Requirements: 6.4_

- [ ] 15. Frontend: Leaderboard module
  - [ ] 15.1 Implementasi `LeaderboardPage` dengan `PackageSelector` — filter leaderboard per paket tes, fetch dalam ≤3 detik; `UserRankDisplay` (peringkat + skor pengguna login, atau indikasi belum ada data); top 100 list dengan nomor peringkat, nama, skor; tampilkan error dengan opsi retry jika data gagal dimuat
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7_

- [ ] 16. Frontend: Admin Dashboard
  - [ ] 16.1 Implementasi `AdminQuestionCRUD` — form create/edit soal (teks, 2–5 pilihan, radio tepat satu benar, pilih kategori), daftar soal dengan pagination, aksi delete; validasi form real-time sebelum submit ke Admin API
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ] 16.2 Implementasi `AdminPackageManager` — assign soal ke paket (drag-and-drop atau select), konfigurasi batas waktu (1–180 menit) dan jumlah soal (10–100); `PackageActivationControl` — tombol aktivasi dengan validasi (tampilkan error jika soal < 10 atau > 100)
    - _Requirements: 8.4, 8.5, 8.6_

- [ ] 17. Responsiveness, aksesibilitas, dan cross-browser
  - [ ] 17.1 Implementasi responsive layout menggunakan CSS/Tailwind untuk breakpoint 320px–2560px — pastikan tidak ada horizontal overflow, tidak ada elemen overlap, semua touch target ≥ 44×44px; implementasi portrait lock untuk mobile saat sesi tes aktif (CSS `@media` orientation + JS Screen Orientation API)
    - _Requirements: 9.1, 9.4_
  - [ ] 17.2 Audit dan perbaiki aksesibilitas WCAG 2.1 Level AA — tambahkan ARIA labels pada semua elemen interaktif, pastikan konten dapat diakses keyboard (Tab, Enter, Space), pastikan kontras warna ≥ 4.5:1, jalankan `axe-core` pada halaman utama
    - _Requirements: 9.2_
  - [ ]* 17.3 Write accessibility tests menggunakan `axe-core`
    - Validasi contrast ratio ≥ 4.5:1; ARIA labels pada elemen interaktif; navigasi keyboard; touch target ≥ 44×44px
    - _Requirements: 9.2_
  - [ ]* 17.4 Write cross-browser smoke tests
    - Verifikasi rendering pada Chrome ≥ 90, Firefox ≥ 88, Safari ≥ 14, Edge ≥ 90
    - _Requirements: 9.3_

- [ ] 18. Integration tests dan wiring akhir
  - [ ] 18.1 Buat integration test end-to-end alur utama: registrasi → verifikasi email → login → pilih paket → mulai tes → jawab soal → finish → lihat hasil → unduh PDF
    - _Requirements: 1.4, 2.2, 3.1–3.8, 4.1–4.3, 5.1–5.4_
  - [ ]* 18.2 Write integration test untuk sinkronisasi offline
    - Mock network interruption, simpan jawaban offline, pulihkan koneksi, verifikasi semua jawaban tersinkron ke server
    - _Requirements: 3.9, 3.10_
  - [ ]* 18.3 Write integration test untuk leaderboard update
    - Selesaikan sesi tes, verifikasi leaderboard terupdate dalam ≤60 detik
    - _Requirements: 7.6_
  - [ ]* 18.4 Write integration test untuk admin workflow
    - Create question → assign ke package → activate package → package accessible oleh user
    - _Requirements: 8.1–8.6_

- [ ] 19. Final checkpoint — Semua tests pass dan fitur terintegrasi
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task merujuk ke requirement spesifik untuk traceability
- Design menggunakan TypeScript di seluruh stack (React frontend + Node.js backend)
- Library PBT: `fast-check` dengan minimum 100 iterasi per property test
- Setiap property test harus diberi tag komentar: `// Feature: academic-potential-test, Property {N}: {deskripsi}`
- Checkpoint memastikan validasi inkremental sebelum melanjutkan ke modul berikutnya
- Access token disimpan di memory (bukan localStorage) untuk keamanan XSS
- Refresh token disimpan di httpOnly cookie dengan atribut `Secure`, `HttpOnly`, `SameSite=Strict`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "3.3", "3.4"] },
    { "id": 2, "tasks": ["3.2", "3.5", "3.7"] },
    { "id": 3, "tasks": ["3.6", "3.8", "3.9", "5.1"] },
    { "id": 4, "tasks": ["3.10", "5.2", "5.4", "6.1"] },
    { "id": 5, "tasks": ["5.3", "5.5", "5.6", "6.2", "6.3", "6.4", "7.1", "7.4"] },
    { "id": 6, "tasks": ["6.5", "6.6", "7.2", "7.3", "7.5", "8.1"] },
    { "id": 7, "tasks": ["6.7", "7.6", "7.7", "7.8", "8.2"] },
    { "id": 8, "tasks": ["7.9", "7.10", "8.3", "10.1"] },
    { "id": 9, "tasks": ["8.4", "10.2", "10.3"] },
    { "id": 10, "tasks": ["10.4", "10.5", "11.1", "12.1"] },
    { "id": 11, "tasks": ["11.2", "12.2", "12.3"] },
    { "id": 12, "tasks": ["12.4", "12.6", "13.1"] },
    { "id": 13, "tasks": ["12.5", "12.7", "13.2", "13.3", "14.1", "15.1", "16.1"] },
    { "id": 14, "tasks": ["13.4", "14.2", "14.3", "16.2"] },
    { "id": 15, "tasks": ["17.1", "17.2"] },
    { "id": 16, "tasks": ["17.3", "17.4", "18.1"] },
    { "id": 17, "tasks": ["18.2", "18.3", "18.4"] }
  ]
}
```
