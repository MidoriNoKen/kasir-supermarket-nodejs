# Kasir Super Market - Simple Rest API

[Kasir Super Market - Simple Rest API](#kasir-supermarket)

- [Deskripsi Proyek](#deskripsi-proyek)
- [Desain Database](#desain-database)
- [Penggunaan Pattern MVC](#penggunaan-pattern-mvc)
- [Testing E2E](#testing-e2e)
- [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
- [Dokumentasi API](#dokumentasi-api)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Deskripsi Proyek

Proyek "Kasir Super Market" adalah sebuah aplikasi Rest API yang memungkinkan admin atau kasir untuk mengelola transaksi di sebuah supermarket. Aplikasi ini dibangun dengan menggunakan Node.js dan mengimplementasikan otentikasi berbasis token menggunakan JSON Web Tokens (JWT). Aplikasi ini juga dilengkapi dengan fitur pengujian end-to-end (E2E) untuk menguji otentikasi dengan token.

## Desain Database

### Tabel Users

Tabel ini akan menyimpan informasi tentang semua pengguna.

- `id` (Primary Key): ID pengguna.
- `username`: Nama pengguna (username).
- `password`: Kata sandi pengguna (harus di-hash).
- `name`: Nama lengkap pengguna (opsional).
- `address`: Alamat pengguna (opsional).
- `phone`: Nomor telepon pengguna (opsional).
- `nik`: Nomor Induk Kependudukan pengguna (opsional).
- `role_id` (Foreign Key ke Tabel Roles): Peran (role) pengguna.

### Tabel Roles

Tabel ini akan menyimpan daftar peran (roles) yang dapat dimiliki oleh pengguna.

- `id` (Primary Key): ID peran.
- `name`: Nama peran (contoh: 'admin', 'kasir').

### Tabel Products

Tabel ini akan menyimpan informasi tentang barang-barang yang dapat dijual atau dibeli.

- `id` (Primary Key): ID barang.
- `name`: Nama barang.
- `category`: Kategori barang.
- `price`: Harga barang per unit.
- `stock`: Stok barang.

### Tabel Transactions

Tabel ini akan mencatat setiap transaksi yang dilakukan oleh admin atau kasir.

- `id` (Primary Key): ID transaksi.
- `user_id` (Foreign Key ke Tabel Users, menunjukkan admin atau kasir yang melakukan transaksi).
- `transaction_date`: Tanggal transaksi.
- `total_amount`: Total harga transaksi.

### Tabel TransactionDetails

Tabel ini akan mencatat detail item dalam setiap transaksi.

- `id` (Primary Key): ID detail transaksi.
- `transaction_id` (Foreign Key ke Tabel Transactions): ID transaksi yang terkait.
- `product_id` (Foreign Key ke Tabel Products): ID barang yang terkait.
- `quantity`: Jumlah item yang dibeli.
- `unit_price`: Harga per unit item pada saat transaksi.

## Penggunaan Pattern MVC

Dalam proyek ini, kami menggunakan pola MVC (Model-View-Controller) untuk mengorganisir kode. Alasan kami menggunakan pola ini adalah untuk memisahkan tanggung jawab dalam aplikasi menjadi tiga komponen utama:

- **Model**: Representasi data dan logika bisnis. Model mengatur cara data disimpan, diakses, dan dimanipulasi.
- **View**: Tampilan atau antarmuka pengguna. Ini berurusan dengan bagaimana data ditampilkan kepada pengguna.
- **Controller**: Mengendalikan aliran aplikasi dan menghubungkan Model dan View. Ini berfungsi sebagai jembatan antara Model dan View.

MVC membantu menjaga kode tetap terorganisir, mudah dipahami, dan dapat diuji dengan baik.

## Testing E2E

Proyek ini dilengkapi dengan pengujian end-to-end (E2E) yang memeriksa otentikasi dengan token. Pengujian ini memastikan bahwa API hanya dapat diakses oleh pengguna yang sah dengan token yang valid. Ini membantu melindungi keamanan aplikasi dari akses yang tidak sah.

## Cara Menjalankan Proyek

Untuk menjalankan proyek ini, ikuti langkah-langkah berikut:

1. Clone repositori dari GitHub:

   ```bash
   git clone https://github.com/yourusername/kasir-super-market.git

2. Masuk ke direktori proyek:

   ```bash
   cd kasir-super-market

3. Instal dependensi proyek:

   ### Dependencies:
   a. bcrypt
   
   Deskripsi: Untuk mengenkripsi dan mendekripsi kata sandi.

   Cara instalasi:

   npm install bcrypt

   b. body-parser
   
   Deskripsi: Middleware untuk mengurai data permintaan HTTP.

   Cara instalasi:

   npm install body-parser

   c. cors
   
   Deskripsi: Middleware untuk mengaktifkan Cross-Origin Resource Sharing (CORS).

   Cara instalasi:

   npm install cors

   d. express
   
   Deskripsi: Kerangka kerja untuk mengembangkan aplikasi web.

   Cara instalasi:

   npm install express

   e. express-validator
   
   Deskripsi: Alat validasi untuk Express.js.

   Cara instalasi:

   npm install express-validator

   f. jsonwebtoken
   
   Deskripsi: Untuk menghasilkan dan memverifikasi token JSON Web (JWT).

   Cara instalasi:

   npm install jsonwebtoken

   g. mysql2
   
   Deskripsi: Driver untuk menghubungkan aplikasi dengan database MySQL.

   Cara instalasi:

   npm install mysql2

   h. pg
   
   Deskripsi: Driver untuk menghubungkan aplikasi dengan database PostgreSQL.

   Cara instalasi:

   npm install pg

   i. sequelize
   
   Deskripsi: ORM (Object-Relational Mapping) untuk mengakses database SQL dengan lebih mudah.

   Cara instalasi:

   npm install sequelize

   j. sequelize-cli
   
   Deskripsi: CLI (Command Line Interface) untuk Sequelize, digunakan untuk mengelola migrasi dan seeding database.

   Cara instalasi:

   npm install sequelize-cli

   ### Dev Dependencies:
   nodemon
   Deskripsi: Untuk memantau perubahan berkas dan secara otomatis memulai ulang server saat berkas berubah selama pengembangan.

   Cara instalasi:

   ```bash
   npm install nodemon --save-dev


5. Konfigurasi Database: Pastikan Anda telah mengatur database MySQL dan mengonfigurasi koneksi database Anda di berkas konfigurasi.
Jalankan migrasi database untuk membuat tabel yang diperlukan:

   ```bash
   npx sequelize-cli db:migrate

6. Jalankan proyek:

   ```bash
   npm start

7. Proyek akan berjalan di http://localhost:3000. Anda dapat mengakses API dengan menggunakan aplikasi klien HTTP seperti Postman.

## Dokumentasi API

Dokumentasi API tersedia dalam format Postman. Anda dapat mengimpor berkas Postman JSON yang menyertai proyek ini untuk mendapatkan dokumentasi lengkap tentang endpoin API, permintaan yang diperlukan, dan tanggapan yang diharapkan.

## Kontribusi

Kami sangat menyambut kontribusi dari komunitas. Jika Anda ingin berkontribusi pada proyek ini, silakan buka "Issues" untuk menemukan pekerjaan yang perlu dilakukan atau buat "Pull Request" dengan perubahan yang Anda ajukan.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat berkas LICENSE untuk detail lebih lanjut.

Terima kasih telah menggunakan Kasir Super Market - Simple Rest API! Kami harap proyek ini bermanfaat bagi Anda.

## Kasir Super Market

Pastikan Anda menggantikan `https://github.com/MidoriNoKen/kasir-supermarket-nodejs` dengan URL yang benar untuk repositori GitHub Anda. Anda juga dapat menyesuaikan tampilan, seperti menambahkan logo atau mengganti warna teks sesuai preferensi Anda.



