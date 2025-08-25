# Purwadhika Final Project Repository

This project use Next.js for frontend framework. It is used to build both a mini-project and a final-project for students of the Job Connector Web Development program.

📃 Rules

        ⌨️ Commit & Pull Request

            ✔️ Selalu gunakan `conventional commit message` saat melakukan commit atau pada saat `creating pull request`: https://www.conventionalcommits.org/en/v1.0.0/

            ✔️ `Squash and Merge` pull request menuju ke `branch main`


        🏷️ Standarisasi Penamaan

            📂 Penamaan File

                ✔️ Gunakan Format Penamaan yang Sama untuk Directory atau Files:
                        ▪️Format penamaan directory dan file di dalam 1 project harus konsisten dan seragam antara 1 developer dengan developer lainnya.
                        ▪️Untuk penamaan yang lebih dari 1 suku kata bisa menggunakan format `camelCase`.
                        ▪️Example: page.tsx, productCard.tsx

                ✔️ Gunakan Nama File yang Deskriptif:
                        ▪️Pilih nama yang secara akurat menggambarkan konten dari file tersebut.
                        ▪️Hindari nama file yang terlalu umum seperti `utils.ts` atau `decode.ts`.

                ✔️ Ikuti Standarisasi Penamaan File untuk Jenis File Tertentu:
                        ▪️Untuk file konfigurasi, gunakan nama seperti .env, config.js, atau settings.json.
                        ▪️Gunakan penamaan yang konsisten untuk file test, seperti menambahkan .test.js atau .spec.js ke nama file yang sedang diuji.

# 📘 Git & GitHub Collaboration Guideline

✨ Tujuan

Panduan ini dibuat untuk membantu tim developer dalam berkolaborasi menggunakan Git dan GitHub secara efisien, rapi, dan terstruktur.

📂 Struktur Branch

        ▪️main\*
        Branch utama yang mencerminkan kode production atau versi yang sudah stable. Semua fitur yang rilis ditandai dari branch ini (misalnya dengan tag v.1.0.).
        ⚠️ Developer tidak diperbolehkan melakukan development langsung di branch main.

        ▪️develop/\*
        Branch untuk integrasi seluruh fitur baru sebelum di rilis ke production. Semua fitur dan bugfix digabung kesini terlebih dahulu melalui Pull Request. Bisa dianggap sebagai versi staging sebelum masuk ke branch main.

        ▪️feat/\*
        Prefix untuk pengembangan fitur baru. Branch ini dibuat based on branch develop dan akan di-merge kembali ke branch develop setelah selesai.

        Contoh: feat/login-page, feat/user-profile.

        ▪️ bugfix/\*
        Digunakan untuk memperbaiki bug non-kritis yang ditemukan saat fase development. Dibuat based on branch
        develop, dan setelah selesai diperbaiki akan di-merge kembali ke branch develop.

        Contoh: bugfix/fix-password-validation.

        ▪️hotfix/\*
        Untuk perbaikan darurat terhadap masalah kritis di production. Dibuat based on branch main, dan setelah selesai, hasil perbaikan harus di-merge ke branch main dan branch develop untuk menjaga sinkronisasi.

        Contoh: hotfix/fix-crash-on-payment.

🌱 Alur Kerja Git (Git Flow)

        • Checkout ke branch develop
                ➡️ git checkout develop

        • Buat branch baru based on branch develop:

                Format:
                ➡️ git checkout -b branch-type/nama-fitur

                Contoh:
                ➡️ git checkout -b feat/login-page
                ➡️ git checkout -b bugfix/fix-login-error

        • Lakukan pengerjaan fitur ataupun perbaikan (bug fixing)
        • Commit perubahan dengan format yang jelas. Gunakan format commit yang deskriptif, misalnya:

                Format:
                ➡️ git add .
                ➡️ git commit -m “<type>: <deskripsi>”

                Contoh:
                ➡️ git commit -m “feat: implement login page layout”
                                        ➡️ git commit -m “fix: fix axios error response”

        • Push branch ke remote

                Format:
                ➡️ git push origin  branch-type/nama-fitur

                Contoh:
                ➡️ git push origin feat/login-page
                ➡️ git push origin bugfix/fix-login-error

        • Lakukan create Compare & Pull Request (PR) menuju ke branch develop
        • Pull Request akan di review dan approve oleh Project Manager (PM)
        • Apabila:

                ❌ Pull Request belum mendapatkan approval oleh PM dan butuh perbaikan, lakukan perbaikan tersebut di local. Setelah perbaikan selesai, lakukan ulang commit dan push branch ke remote. ⚠️Tidak perlu melakukan `Compare and Pull Request` lagi!

                ✅ Pull Request telah mendapatkan approval oleh PM, lakukan `Merge Pull Request`

🔤 Format Commit Message (Conventional Commits)

Conventional Commit adalah sebuah standar penulisan pesan commit (commit message) yang terstruktur dan konsisten, digunakan untuk mempermudah:

• Membaca riwayat perubahan (changelog).

• Review dan kolaborasi tim.

        Format:
        <type>(optional-scope): short description

        Contoh:
        ➡️ feat(auth): add JWT middleware
        ➡️ fix(schedule): fix timezone bug
        ➡️ docs(readme): update setup instruction

⌨️ Commit Type:

        ▪️feat
        Menambahkan fitur baru pada code atau aplikasi.
        Contoh: menambah halaman login, fitur notifikasi, filter pencarian, dll.

        ▪️fix
        Melakukan perbaikan bug/error yang memengaruhi fungsionalitas.
        Contoh: memperbaiki validasi form, memperbaiki crash saat submit, dll.

        ▪️docs
        Perubahan pada dokumentasi saja, tidak menyentuh kode program.
        Contoh: update README, komentar dokumentasi, wiki internal, dll.

        ▪️style
        Perubahan yang hanya menyangkut gaya penulisan kode tanpa mengubah logika atau perilaku.
        Contoh: perbaikan indentasi, penyesuaian whitespace, penghapusan baris kosong.

        ▪️refactor
        Melakukan perubahan struktur kode tanpa menambah fitur atau memperbaiki bug.
        Tujuannya untuk meningkatkan kualitas kode, readability, atau efisiensi.
        test Menambahkan atau memodifikasi kode pengujian (unit/integration test).
        Contoh: menambahkan test case baru, memperbaiki test yang gagal.

        ▪️chore
        Perubahan kecil atau non-kode yang tidak berdampak langsung ke aplikasi.
        Contoh: instalasi dependensi, update dependensi, perubahan script, konfigurasi CI/CD, rename file, dll.

🔀 Pull Request (PR) Rules

        • Judul PR harus jelas, contoh: feat(auth): implement login endpoint
        • Deskripsikan perubahan dan tujuan PR
        • Tambahkan screenshot (jika relevan)
        • Assign minimal 1 reviewer
        • Hindari PR besar; jika perlu, pecah menjadi beberapa PR kecil

⛔ Hal yang Harus Dihindari

        • Push langsung ke branch main maupun branch develop
        • Pesan commit tanpa deskripsi jelas
        • PR besar tanpa penjelasan
        • Menghapus branch orang lain tanpa izin

✅ Checklist Sebelum Merge

        • Apakah sudah lulus testing?
        • Apakah telah di review oleh rekan satu tim?
        • Apakah sudah tidak ada confilcit pada saat melakukan merge?
        • Apakah sudah melakukan update dokumentasi (jika perlu)?
