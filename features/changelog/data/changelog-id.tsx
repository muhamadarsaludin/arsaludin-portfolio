import MiracleBanner from "@/components/miracle/Banner"
import { Link } from "@/i18n/navigation"
import { LuPartyPopper } from "react-icons/lu"

export const CHANGELOG_ID = [
  {
    version: "1.0.0",
    releaseDate: "2026-06-06",
    banner: (
      <MiracleBanner
        variant="secondary"
        color="blue"
        startIcon={<LuPartyPopper />}
        title="Versi 1.0.0 — Rilis Perdana"
      >
        <p>
          Rilis ini merupakan langkah awal dari portofolio saya, yang menjadi dasar bagi struktur
          utama serta berbagai informasi yang mencerminkan perjalanan, pengalaman, dan karya yang
          telah saya buat. Proyek ini akan terus berkembang, jika anda menemukan bug atau memiliki
          ide baru, silakan beri masukan di halaman{" "}
          <Link href="/roadmap" className="text-blue :hover:underline font-medium">
            Roadmap
          </Link>
          . Selamat berinteraksi dan terima kasih atas dukungannya!
        </p>
      </MiracleBanner>
    ),
    changes: `
<MiracleBadge color="green" variant="secondary">Menambahkan</MiracleBadge>
<div className="text-sm">
* Halaman [Beranda](/) sebagai titik masuk utama, yang menyajikan ringkasan profil, proyek pilihan, dan informasi penting secara singkat.
* Halaman [Proyek](/projects) untuk menampilkan dan menjelajahi karya yang telah saya buat, dilengkapi dengan fitur pencarian dan filter.
* Halaman [Pencapaian](/achievements) untuk menampilkan pencapaian saya, dilengkapi dengan fitur pencarian dan filter, serta detail yang dapat diakses melalui modal.
* Halaman [Artikel](/articles) untuk membagikan tulisan dan insight saya, dilengkapi dengan fitur pencarian dan filter.
* Halaman [Roadmap](/roadmap) sebagai ruang kolaboratif berbasis kanban board untuk menampilkan progres pengembangan, serta mengumpulkan feedback, laporan bug, dan ide fitur dari pengguna.
* Halaman [Lounge](/lounge) sebagai ruang diskusi interaktif berbasis chat untuk berbagi ide dan berkomunikasi secara langsung dengan pengguna lain.
* Halaman [Changelog](/changelog) untuk mencatat seluruh pembaruan, perbaikan, dan penambahan fitur pada setiap versi.
* Halaman [Gear & Setup](/gear-and-setup) sebagai ruang untuk menampilkan tools, perangkat, dan setup yang mendukung proses berkarya saya.
* Halaman [Inspirasi Website](/inspiration-website) untuk menampilkan list website yang menjadi referensi atau acuan dalam pembuatan portfolio ini.
* Halaman [Kebijakan Privasi](/privacy-policy) untuk memberikan penjelasan mengenai pengumpulan, penggunaan, dan perlindungan data pengguna.
* Fitur **!Unduh Resume** untuk mengunduh resume terbaru saya.
* Fitur **!internationalization (i18n)** dengan dukungan bahasa Inggris dan Indonesia.
* Fitur **!tema** untuk beralih antara tema terang, gelap, dan sistem untuk memberikan pengalaman penggunaan yang lebih personal.
* Fitur **!masuk dengan Google** untuk memudahkan autentikasi pengguna.
* Fitur **!hapus akun** untuk menghapus data dan akun pengguna.
* Fitur **!komentar** untuk memberikan komentar baik pada proyek maupun artikel.
* Fitur **!balas komentar** untuk memberikan balasan pada komentar.
* Fitur **!reaksi** untuk memberikan reaksi baik pada proyek, artikel, pencapaian, testimoni maupun komentar.
* Integrasi **!Google Analytics** untuk membantu analisis perilaku dan interaksi pengguna pada website.
</div>
    `,
  },
]
