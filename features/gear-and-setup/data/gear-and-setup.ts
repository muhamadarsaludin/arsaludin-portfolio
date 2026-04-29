import { GearAndSetupGroup } from "../types/gear-and-setup.types";

export const GEAR_AND_SETUP_DATA_EN: GearAndSetupGroup[] = [
  {
    category: "Devices",
    items: [
      {
        name: "MacBook Pro M2 14\"",
        description: "Currently, I use the MacBook Pro M2 14\" as my primary engine for development and design. I rely on its high performance and stunning Liquid Retina XDR display for visual precision. Its exceptional battery life and premium build quality, combined with a compact form factor, make it an incredibly reliable and portable workstation for my daily workflow.",
        type: "Laptop",
        link: "https://support.apple.com/id-id/111340",
        specs: [
          {name: "Chip", value: "Apple M2 Pro"},
          {name: "Disply", value: "Liquid Retina XDR"},
          {name: "Memory", value: "16GB"},
          {name: "Storage", value: "1TB SSD"},
          {name: "Color", value: "Space Gray"},
        ]
      },
      {
        name: "iPhone 13",
        description: "I rely on the iPhone 13 as my secondary device, primarily for mobile responsiveness testing and daily communication. Its consistent performance, impressive camera quality for documentation, and seamless integration with my workstation make it an essential component of my productivity ecosystem.",
        type: "Smartphone",
        link: "https://support.apple.com/id-id/111872",
        specs: [
          {name: "Chip", value: "A15 Bionic"},
          {name: "Display", value: "Super Retina XDR"},
          {name: "Memory", value: "4GB"},
          {name: "Storage", value: "128GB"},
          {name: "Color", value: "Blue"},
        ]
      }
    ]
  },
  {
    category: "Essentials",
    items: [
      {
        name: "Sony Linkbuds Fit",
        description: "A versatile audio tool for both work and leisure. I rely on its clear microphone for virtual meetings and its Noise Cancelling feature to maintain focus while listening to music in any environment.",
        type: "TWS",
        link: "https://www.sony.co.id/id/headphones/products/linkbuds-fit",
        specs: [
          {name: "Driver", value: "Dynamic Driver X"},
          {name: "Codec", value: "SBC, AAC, LDAC"},
          {name: "IP Rating", value: "IPX4"},
          {name: "Features", value: "ANC & Clear Mic"},
          {name: "Color", value: "Green"},
        ]
      },
      {
        name: "ACMIC C10PRO",
        description: "A compact power solution that ensures my devices stay charged throughout the day. Its portable design and solid build quality make it a reliable companion for working remotely or during long commutes without worrying about power access.",
        type: "Powerbank",
        link: "https://acmic.id/products/acmic-c10pro-slim-10000mah-aicharge-power-bank-qc4-pd-vooc",
        specs: [
          {name: "Capacity", value: "10000mAh"},
          {name: "Output", value: "22.5W"},
          {name: "Color", value: "Black"}
        ]
      },
      {
        name: "Casio MTP-V002D-2B3",
        description: "A classic and reliable analog timepiece designed for long-term daily use. Its professional aesthetic and stainless steel build make it a perfect companion for consistent time management.",
        type: "Watch",
        link: "https://www.casio.com/id/watches/casio/product.MTP-V002D-2B3/",
        specs: [
          {name: "Dial", value: "Blue"},
          {name: "Battery Life", value: "Approx. 3 Years"},
          {name: "Material", value: "Stainless Steel"},
          {name: "Feature", value: "Date Display & Water Resistant"}
        ]
      },
      {
        name: "Rodenstock & Bossini",
        description: "High-quality eyewear designed to protect vision during long engineering sessions. I use Rodenstock lenses for superior clarity and blue light protection, paired with a lightweight Bossini frame.",
        type: "Eyewear",
        link: "https://www.optikmelawai.com/product-knowledge/rodenstock-lenses-id",
        specs: [
          {name: "Lens", value: "Rodenstock"},
          {name: "Frame", value: "Bossini"},
          {name: "Feature", value: "Blue Light Protection"}
        ]
      }
    ]
  },
  {
    category: "Workspace",
    items: [
      {
        name: "Informa Berka",
        description: "A minimalist and sturdy workspace center. Its clean design and ample surface area provide the perfect environment for a focused setup, maintaining a clutter-free aesthetic for daily engineering tasks.",
        type: "Office Table",
        link: "https://shopee.co.id/Informa-Berka-120-cm-Meja-Kantor-Putih-Office-Table-Furnitur-Kantor-Meja-Kerja-Belajar-Serbaguna-i.586863199.27206094402",
        specs: [
          {name: "Dimensions", value: "100 x 60 x 75 cm"},
          {name: "Top Material", value: "Hollow Board"},
          {name: "Leg Material", value: "Solid Metal"},
          {name: "Style", value: "Elegant Minimalist"},
          {name: "Color", value: "White"}
        ]
      },
      {
        name: "Avery J001-T",
        description: "A simple and budget-friendly seating solution that focuses on basic functionality. It provides a breathable mesh back and standard adjustments, serving as a straightforward addition to complete the workspace setup.",
        type: "Office Chair",
        link: "https://shopee.co.id/Avery-J001-T-Kursi-Kantor-Kursi-Putar-Jaring-Kursi-Staff-i.102042394.10642610198",
        specs: [
          {name: "Material", value: "Mesh & Fabric"},
          {name: "Adjustment", value: "Height Adjustable"},
          {name: "Style", value: "Simple Minimalist"},
          {name: "Color", value: "Black"}
        ]
      },
      {
        name: "MyRepublic",
        description: "A stable fiber optic setup providing consistent connectivity for daily engineering tasks. Utilizing a dual-band router to ensure a reliable link for cloud synchronization and remote collaboration.",
        type: "ISP",
        link: "https://www.myrepublic.co.id/",
        specs: [
          {name: "Type", value: "Fiber Optic"},
          {name: "Model", value: "ZTE ZXHN F670L"},
          {name: "Band", value: "Dual-Band (2.4GHz / 5GHz)"},
          {name: "Speed", value: "30 Mbps Fiber"}
        ]
      }
    ]
  },
  {
    category: "Development Tools",
    items: [
      {
        name: "Visual Studio Code",
        description: "My primary environment for writing clean, scalable code. I keep it minimalist with a focused set of extensions that enhance productivity across various programming languages and web technologies.",
        type: "Code Editor",
        link: "https://code.visualstudio.com/",
        specs: [
          {name: "Theme", value: "Tokyo Night"},
          {name: "Font", value: "Menlo (Default)"},
        ]
      },
      {
        name: "Android Studio",
        description: "The specialized IDE for Android development. I use it to build, test, and refine applications, ensuring high performance and a seamless user experience on the Android platform.",
        type: "Android IDE",
        link: "https://developer.android.com/studio",
      },
      {
        name: "Native Terminal",
        description: "A straightforward command-line interface for system-level tasks. I rely on the native terminal for efficient package management, script execution, and version control workflows.",
        type: "Terminal",
        specs: [
          {name: "Shell", value: "zsh"},
          {name: "Environment", value: "Unix-based (macOS)"}
        ]
      },
      {
        name: "Git & GitHub",
        description: "The backbone of my version control and collaboration. I rely on Git for local change tracking and GitHub for hosting repositories, managing pull requests, and maintaining code quality.",
        type: "VCS, Repository, CI/CD",
        link: "https://github.com/",
      },
      {
        name: "Docker Desktop",
        description: "Essential for creating consistent development environments. It allows me to containerize applications and manage local services with ease.",
        type: "Containerization",
        link: "https://www.docker.com/products/docker-desktop/",
      },
      {
        name: "Postman",
        description: "An essential tool for API development and testing. It allows me to streamline the process of exploring, debugging, and documenting back-end services to ensure seamless integration.",
        type: "API Testing",
        link: "https://www.postman.com/",
      },
      {
        name: "Google Chrome & Safari",
        description: "My primary environments for web debugging and cross-browser testing. I rely on Chrome DevTools for performance profiling and Safari for ensuring seamless optimization within the Apple ecosystem.",
        type: "Browser",
        link: "https://www.google.com/chrome/"
      }
    ]
  },
  {
    category: "Design, Management & Productivity",
    items: [
      {
        name: "Figma",
        description: "My primary tool for UI design and prototyping. It's where I visualize ideas and craft user interfaces before bringing them to life through code.",
        type: "UI Design & Prototyping",
        link: "https://www.figma.com/"
      },
      {
        name: "Jira",
        description: "My go-to platform for project tracking and Agile management, helping me stay organized with sprints and task backlogs.",
        type: "Project Management",
        link: "https://www.atlassian.com/software/jira"
      },
      {
        name: "Notion",
        description: "A versatile workspace for documentation and personal organization, where I keep my project ideas and technical notes structured.",
        type: "Documentation & Workspace",
        link: "https://www.notion.so/"
      },
      {
        name: "Gemini",
        description: "My AI collaborator for technical brainstorming, code optimization, and streamlining my creative documentation process.",
        type: "AI Assistant",
        link: "https://www.gemini.com/"
      }
    ]
  }
];

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
        name: "Rodenstock & Bossini",
        description: "Kacamata berkualitas tinggi yang dirancang untuk menjaga penglihatan selama sesi engineering yang lama. Saya menggunakan lensa Rodenstock untuk kejelasan visual dan perlindungan cahaya biru, dipadukan dengan bingkai Bossini bermaterial Titanium untuk kenyamanan maksimal.",
        type: "Kacamata",
        link: "https://www.optikmelawai.com/product-knowledge/rodenstock-lenses-id",
        specs: [
          {name: "Lensa", value: "Rodenstock"},
          {name: "Bingkai", value: "Bossini"},
          {name: "Fitur", value: "Perlindungan Cahaya Biru"}
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