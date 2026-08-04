<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['category' => 'Umum', 'question' => 'Apa itu Artifex?', 'answer' => 'Artifex adalah marketplace digital yang menghubungkan klien dengan freelancer profesional untuk berbagai layanan kreatif dan teknologi, mulai dari desain grafis, video editing, copywriting, hingga web development.', 'sort_order' => 1],
            ['category' => 'Umum', 'question' => 'Bagaimana cara kerja Artifex?', 'answer' => 'Klien dapat mencari freelancer berdasarkan kategori atau keahlian tertentu, melihat portfolio dan review, lalu melakukan pemesanan. Pembayaran dilakukan melalui sistem escrow yang aman.', 'sort_order' => 2],
            ['category' => 'Umum', 'question' => 'Apakah Artifex aman digunakan?', 'answer' => 'Ya. Kami menggunakan sistem escrow untuk melindungi pembayaran klien sampai pekerjaan selesai dan disetujui. Data pengguna juga dienkripsi dan dilindungi.', 'sort_order' => 3],
            ['category' => 'Untuk Klien', 'question' => 'Bagaimana cara memesan jasa?', 'answer' => 'Cari jasa yang kamu butuhkan di halaman Explore, pilih paket yang sesuai, lalu klik \'Pemesanan\'. Ikuti instruksi pembayaran dan freelancer akan mulai mengerjakan pesananmu.', 'sort_order' => 4],
            ['category' => 'Untuk Klien', 'question' => 'Bagaimana jika hasil pekerjaan tidak sesuai?', 'answer' => 'Kamu bisa melakukan revisi sesuai jumlah yang tertera pada paket yang dipilih. Jika masih tidak puas, kamu bisa mengajukan dispute dan tim kami akan membantu menyelesaikan masalah.', 'sort_order' => 5],
            ['category' => 'Untuk Klien', 'question' => 'Metode pembayaran apa yang diterima?', 'answer' => 'Kami menerima pembayaran melalui transfer bank, e-wallet (GoPay, OVO, Dana, ShopeePay), dan kartu kredit/debit.', 'sort_order' => 6],
            ['category' => 'Untuk Freelancer', 'question' => 'Bagaimana cara menjadi freelancer di Artifex?', 'answer' => 'Klik \'Become a Freelancer\' di navbar, isi data diri dan keahlianmu. Tim kami akan melakukan verifikasi dalam 1-2 hari kerja. Setelah disetujui, kamu bisa mulai menerima pesanan.', 'sort_order' => 7],
            ['category' => 'Untuk Freelancer', 'question' => 'Berapa komisi yang diambil Artifex?', 'answer' => 'Artifex mengambil komisi sebesar 10% dari setiap transaksi yang berhasil. Tidak ada biaya langganan atau biaya tersembunyi lainnya.', 'sort_order' => 8],
            ['category' => 'Untuk Freelancer', 'question' => 'Bagaimana cara menarik dana (withdraw)?', 'answer' => 'Dana bisa ditarik ke rekening bank atau e-wallet setelah mencapai minimum Rp100.000. Proses penarikan biasanya selesai dalam 1-3 hari kerja.', 'sort_order' => 9],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}
