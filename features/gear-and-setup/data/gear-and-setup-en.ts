import type { GearAndSetupGroup } from "../types/gear-and-setup.types"

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
        name: "PX UCH70",
        description: "A versatile connectivity hub that transforms a single port into a complete professional workstation. Its 7-in-1 integration and robust build quality make it a reliable bridge for all my peripherals, ensuring a seamless and productive workflow whether I’m working from home or on the go.",
        type: "Hub",
        link: "https://www.blibli.com/p/hub-converter-type-c-3-1-laptop-macbook-to-hdmi-type-c-7-in-1-px-uch70/ps--FAS-20335-00339?ds=FAS-20335-00339-00001&source=SEARCH&sid=1bb89a9e84bd6d7b&cnc=false&pickupPointCode=FAS-20335-001&pid1=FAS-20335-00339",
        specs: [
          { name: "Output", value: "HDMI 4K @30Hz" },
          { name: "USB-C", value: "1x PD 100W & 1x Data" },
          { name: "USB Port", value: "2x USB 3.0 (5Gbps)" },
          { name: "Storage", value: "SD & MicroSD Slot" }
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
        name: "Eiger Lorenzt 25",
        description: "A durable and ergonomic backpack designed to keep my essentials secure during daily urban commutes. Its weather-resistant material and streamlined silhouette make it a reliable companion for navigating the city or short weekend trips without compromising on comfort or style.",
        type: "Backpack",
        link: "https://www.eigeradventure.com/d/lorenzt-25-1-0",
        specs: [
          { name: "Capacity", value: "25L" },
          { name: "Material", value: "Polyester 600D" },
          { name: "Laptop", value: "Up to 14 inch" },
          { name: "Feature", value: "Water Repellent" }
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
]