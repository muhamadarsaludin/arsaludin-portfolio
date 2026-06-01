import { GearAndSetupGroup } from "../types/gear-and-setup.types";

export const GEAR_AND_SETUP_DATA_ID: GearAndSetupGroup[] = [
  {
    category: "Perangkat",
    items: [
      {
        name: "MacBook Pro M2 14\"",
        description: "Saat ini, saya menggunakan MacBook Pro M2 14\" sebagai mesin utama untuk pengembangan dan desain. Saya mengandalkan performa tingginya dan layar Liquid Retina XDR yang menakjubkan untuk presisi visual. Daya tahan baterai yang luar biasa dan kualitas build premium, dikombinasikan dengan bentuk yang ringkas, menjadikannya workstation yang sangat andal dan portabel untuk workflow harian saya.",
        type: "Laptop",
        link: "https://support.apple.com/id-id/111340",
        specs: [
          {name: "Chip", value: "Apple M2 Pro"},
          {name: "Layar", value: "Liquid Retina XDR"},
          {name: "Memori", value: "16GB"},
          {name: "Penyimpanan", value: "1TB SSD"},
          {name: "Warna", value: "Space Gray"},
        ]
      },
      {
        name: "iPhone 13",
        description: "Saya mengandalkan iPhone 13 sebagai perangkat sekunder, terutama untuk pengujian responsivitas mobile dan komunikasi harian. Performanya yang konsisten, kualitas kamera yang mengesankan untuk dokumentasi, dan integrasi mulus dengan workstation saya menjadikannya komponen esensial dalam ekosistem produktivitas saya.",
        type: "Smartphone",
        link: "https://support.apple.com/id-id/111872",
        specs: [
          {name: "Chip", value: "A15 Bionic"},
          {name: "Layar", value: "Super Retina XDR"},
          {name: "Memori", value: "4GB"},
          {name: "Penyimpanan", value: "128GB"},
          {name: "Warna", value: "Biru"},
        ]
      }
    ]
  },
  {
    category: "Esensial",
    items: [
      {
        name: "Sony Linkbuds Fit",
        description: "Alat audio serbaguna untuk bekerja maupun bersantai. Saya mengandalkan mikrofonnya yang jernih untuk pertemuan virtual dan fitur Noise Cancelling untuk menjaga fokus saat mendengarkan musik di lingkungan apa pun.",
        type: "TWS",
        link: "https://www.sony.co.id/id/headphones/products/linkbuds-fit",
        specs: [
          {name: "Driver", value: "Dynamic Driver X"},
          {name: "Codec", value: "SBC, AAC, LDAC"},
          {name: "Rating IP", value: "IPX4"},
          {name: "Fitur", value: "ANC & Mik Jernih"},
          {name: "Warna", value: "Hijau"},
        ]
      },
      {
        name: "ACMIC C10PRO",
        description: "Solusi daya ringkas yang memastikan perangkat saya tetap terisi sepanjang hari. Desain portabel dan kualitas build yang kokoh menjadikannya pendamping andal untuk bekerja remote atau selama perjalanan jauh tanpa khawatir kehabisan daya.",
        type: "Powerbank",
        link: "https://acmic.id/products/acmic-c10pro-slim-10000mah-aicharge-power-bank-qc4-pd-vooc",
        specs: [
          {name: "Kapasitas", value: "10000mAh"},
          {name: "Output", value: "22.5W"},
          {name: "Warna", value: "Hitam"}
        ]
      },
      {
        name: "PX UCH70",
        description: "Solusi konektivitas ringkas yang mengubah satu port menjadi ruang kerja profesional yang lengkap. Integrasi 7-in-1 dan kualitas materialnya yang tangguh menjadikannya penghubung andalan untuk semua perangkat tambahan, memastikan alur kerja yang lancar dan produktif baik saat bekerja di rumah maupun saat bepergian.",
        type: "Hub",
        link: "https://px.id/products/px-uch70-multport-adapter-hub-7-in-1",
        specs: [
          { name: "Output", value: "HDMI 4K @30Hz" },
          { name: "USB-C", value: "1x PD 100W & 1x Data" },
          { name: "Port USB", value: "2x USB 3.0 (5Gbps)" },
          { name: "Penyimpanan", value: "Slot SD & MicroSD" }
        ]
      },
      {
        name: "Rodenstock & Bossini",
        description: "Kacamata berkualitas tinggi yang dirancang untuk menjaga penglihatan selama sesi engineering yang lama. Saya menggunakan lensa Rodenstock untuk kejelasan visual dan perlindungan cahaya biru, dipadukan dengan bingkai Bossini bermaterial Titanium untuk kenyamanan maksimal.",
        type: "Kacamata",
        link: "https://www.optikmelawai.com/product-knowledge/rodenstock-lenses-id",
        specs: [
          {name: "Lensa", value: "Rodenstock"},
          {name: "Bingkai", value: "Bossini"},
          {name: "Fitur", value: "Perlindungan Cahaya Biru"}
        ]
      },
      {
        name: "Casio MTP-V002D-2B3",
        description: "Penunjuk waktu analog yang klasik dan andal, dirancang untuk penggunaan harian jangka panjang. Estetika profesional dan material stainless steel-nya menjadikannya pendamping sempurna untuk manajemen waktu yang konsisten.",
        type: "Jam Tangan",
        link: "https://www.casio.com/id/watches/casio/product.MTP-V002D-2B3/",
        specs: [
          {name: "Tipe", value: "Analog"},
          {name: "Dial", value: "Biru"},
          {name: "Daya Baterai", value: "Sekitar 3 Tahun"},
          {name: "Material", value: "Stainless Steel"},
          {name: "Fitur", value: "Tampilan Tanggal & Tahan Air"}
        ]
      },
      {
        name: "Eiger Lorenzt 25",
        description: "Ransel ergonomis dan tangguh yang menjaga perlengkapan tetap aman selama mobilitas harian di perkotaan. Material tahan cuaca dan siluetnya yang minimalis menjadikannya teman andalan untuk menjelajahi kota atau perjalanan singkat tanpa mengorbankan kenyamanan maupun gaya.",
        type: "Backpack",
        link: "https://www.eigeradventure.com/d/lorenzt-25-1-0",
        specs: [
          { name: "Kapasitas", value: "25L" },
          { name: "Material", value: "Polyester 600D" },
          { name: "Laptop", value: "Hingga 14 inci" },
          { name: "Fitur", value: "Water Repellent" }
        ]
      }
    ]
  },
  {
    category: "Ruang Kerja",
    items: [
      {
        name: "Informa Berka",
        description: "Pusat ruang kerja yang minimalis dan kokoh. Desainnya yang elegan dan luas permukaan yang cukup memberikan lingkungan sempurna untuk setup yang fokus, menjaga estetika tetap rapi untuk tugas engineering harian.",
        type: "Meja Kantor",
        link: "https://shopee.co.id/Informa-Berka-120-cm-Meja-Kantor-Putih-Office-Table-Furnitur-Kantor-Meja-Kerja-Belajar-Serbaguna-i.586863199.27206094402",
        specs: [
          {name: "Dimensi", value: "100 x 60 x 75 cm"},
          {name: "Material Atas", value: "Hollow Board"},
          {name: "Material Kaki", value: "Logam Solid"},
          {name: "Gaya", value: "Minimalis Elegan"},
          {name: "Warna", value: "Putih"}
        ]
      },
      {
        name: "Avery J001-T",
        description: "Solusi tempat duduk entry-level yang simpel dan budget-friendly dengan fokus pada fungsionalitas dasar. Menawarkan sandaran mesh yang sejuk dan pengaturan standar sebagai pelengkap ruang kerja.",
        type: "Kursi Kantor",
        link: "https://shopee.co.id/Avery-J001-T-Kursi-Kantor-Kursi-Putar-Jaring-Kursi-Staff-i.102042394.10642610198",
        specs: [
          {name: "Material", value: "Mesh & Kain"},
          {name: "Pengaturan", value: "Tinggi Bisa Diatur"},
          {name: "Gaya", value: "Minimalis Simpel"},
          {name: "Warna", value: "Hitam"}
        ]
      },
      {
        name: "MyRepublic",
        description: "Setup fiber optik stabil yang memberikan koneksi konsisten untuk tugas engineering harian. Menggunakan router dual-band untuk menjamin koneksi yang andal untuk sinkronisasi cloud dan kolaborasi remote.",
        type: "ISP",
        link: "https://www.myrepublic.co.id/",
        specs: [
          {name: "Tipe", value: "Fiber Optik"},
          {name: "Model", value: "ZTE ZXHN F670L"},
          {name: "Band", value: "Dual-Band (2.4GHz / 5GHz)"},
          {name: "Kecepatan", value: "30 Mbps Fiber"}
        ]
      }
    ]
  },
  {
    category: "Alat Pengembangan",
    items: [
      {
        name: "Visual Studio Code",
        description: "Lingkungan utama saya untuk menulis kode yang bersih dan skalabel. Saya menjaganya tetap minimalis dengan set ekstensi pilihan yang meningkatkan produktivitas di berbagai bahasa pemrograman dan teknologi web.",
        type: "Kode Editor",
        link: "https://code.visualstudio.com/",
        specs: [
          {name: "Tema", value: "Tokyo Night"},
          {name: "Font", value: "Menlo (Default)"},
        ]
      },
      {
        name: "Android Studio",
        description: "IDE khusus untuk pengembangan Android. Saya menggunakannya untuk membangun, menguji, dan menyempurnakan aplikasi, memastikan performa tinggi dan pengalaman pengguna yang mulus pada platform Android.",
        type: "Android IDE",
        link: "https://developer.android.com/studio"
      },
      {
        name: "Native Terminal",
        description: "Antarmuka command-line langsung untuk tugas-tugas tingkat sistem. Saya mengandalkan terminal bawaan untuk manajemen paket yang efisien, eksekusi skrip, dan workflow version control.",
        type: "Terminal",
        specs: [
          {name: "Shell", value: "zsh"},
          {name: "Lingkungan", value: "Berbasis Unix (macOS)"}
        ]
      },
      {
        name: "Git & GitHub",
        description: "Tulang punggung dari kontrol versi dan kolaborasi saya. Saya mengandalkan Git untuk pelacakan perubahan lokal dan GitHub untuk hosting repositori, mengelola pull request, serta menjaga kualitas kode.",
        type: "VCS, Repositori, CI/CD",
        link: "https://github.com/"
      },
      {
        name: "Docker Desktop",
        description: "Sangat penting untuk menciptakan lingkungan pengembangan yang konsisten. Memungkinkan saya untuk melakukan kontainerisasi aplikasi dan mengelola layanan lokal dengan mudah.",
        type: "Kontainerisasi",
        link: "https://www.docker.com/products/docker-desktop/"
      },
      {
        name: "Postman",
        description: "Alat esensial untuk pengembangan dan pengujian API. Memungkinkan saya untuk mempermudah proses eksplorasi, debugging, dan dokumentasi layanan back-end untuk memastikan integrasi yang mulus.",
        type: "Pengujian API",
        link: "https://www.postman.com/"
      },
      {
        name: "Google Chrome & Safari",
        description: "Lingkungan utama saya untuk debugging web dan pengujian lintas browser. Saya mengandalkan Chrome DevTools untuk profiling performa dan Safari untuk memastikan optimasi mulus dalam ekosistem Apple.",
        type: "Browser",
        link: "https://www.google.com/chrome/"
      }
    ]
  },
  {
    category: "Desain, Manajemen & Produktivitas",
    items: [
      {
        name: "Figma",
        description: "Alat utama saya untuk desain UI dan pembuatan prototipe. Di sinilah saya memvisualisasikan ide dan merancang antarmuka pengguna sebelum merealisasikannya melalui kode.",
        type: "UI Design & Prototyping",
        link: "https://www.figma.com/"
      },
      {
        name: "Jira",
        description: "Platform andalan saya untuk pelacakan proyek dan manajemen Agile, membantu saya tetap terorganisir dengan sprint dan backlog tugas.",
        type: "Manajemen Proyek",
        link: "https://www.atlassian.com/software/jira"
      },
      {
        name: "Notion",
        description: "Ruang kerja serbaguna untuk dokumentasi dan organisasi personal, tempat saya menyimpan ide proyek dan catatan teknis secara terstruktur.",
        type: "Dokumentasi",
        link: "https://www.notion.so/"
      },
      {
        name: "Gemini",
        description: "Kolaborator AI saya untuk brainstorming teknis, optimasi kode, serta memudahkan proses penyusunan dokumentasi kreatif saya.",
        type: "Asisten AI",
        link: "https://www.gemini.com/"
      }
    ]
  }
]