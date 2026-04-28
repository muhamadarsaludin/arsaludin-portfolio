// import Heading from '@/components/Heading'
// import Section from '@/components/Section'

// export default function Hardware() {
//   return (
//     <Section>
//       <Heading level={2}>
//         Hardware
//       </Heading>

//       {/* CARD MACBOOK */}
//       <div>
//         <Heading level={3}>
//           MacBook Pro 14"
//         </Heading>

//         <div className="flex gap-6 md:gap-8 mt-4 w-full">
//           {/* Item Info */}
//           <div className="w-3/12">
//             <div className="aspect-4/3 w-full rounded-2xl bg-slate-100 dark:bg-slate-900 mb-8 overflow-hidden border border-slate-200 dark:border-slate-800">
//               <div className="flex items-center justify-center h-full text-slate-400">
//                 {/* <img src="/images/gear/macbook-pro.jpg" alt="MacBook Pro" className="object-cover w-full h-full" /> */}
//                 <span className="text-sm font-medium">Product Image</span>
//               </div>
//             </div>
//           </div>
//           <div className="w-full">
//             <p>
//               Laptop ini punya tenaga besar dari **chip M2 Pro** yang bikin proses ngoding dan buka file desain berat jadi super lancar tanpa hambatan. Performa ini krusial banget buat pastiin alur kerja saya tetap stabil meski lagi buka banyak aplikasi sekaligus.
//             </p>
//             <p className="mt-4">
//               Baterainya awet banget buat kerja seharian di coffee shop, ditambah layar Liquid Retina yang warnanya akurat untuk memoles detail desain. Ini juga jadi andalan saya buat pastiin tampilan website tampil sempurna di browser Safari.
//             </p>
//             <p className="mt-4">
//               Selain mesinnya, saya suka kualitas audionya yang jernih untuk dengerin musik sambil fokus. Ditambah build quality yang kokoh dan trackpad yang presisi, laptop ini beneran jadi partner yang nyaman buat dibawa eksplorasi ke mana saja.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* CARD IPHONE 13 */}

      

//       <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all mb-8">
//   <div className="flex flex-col lg:flex-row">
    
//     {/* 1. Image Side: Ukuran tetap/fixed di desktop agar card tidak terlalu tinggi */}
//     <div className="lg:w-2/5 aspect-square lg:aspect-auto relative bg-slate-100 dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 overflow-hidden">
//       <div className="flex items-center justify-center h-full text-slate-400">
//         {/* <img src="/images/iphone13.jpg" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" /> */}
//         <span className="text-xs uppercase tracking-widest font-semibold">iPhone 13</span>
//       </div>
//     </div>

//     {/* 2. Content Side */}
//     <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
//       <div>
//         <div className="flex justify-between items-start mb-4">
//           <Heading level={3} className="text-xl md:text-2xl font-bold">
//             iPhone 13
//           </Heading>
//           {/* Link dipojok kecil saja */}
//           <a href="#" target="_blank" rel="sponsored nofollow" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//           </a>
//         </div>

//         {/* Deskripsi: Dibuat lebih ringkas (truncated/scrollable atau cukup 2 paragraf) */}
//         <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
//           <p>
//             Daily driver andalan untuk produktivitas harian. Chip A15 Bionic-nya memastikan workflow tetap responsif dari manajemen tugas sampai komunikasi tim.
//           </p>
//           <p>
//             Sangat krusial untuk <strong>real-device testing</strong> guna memastikan setiap komponen antarmuka terasa natural dan responsif bagi pengguna mobile.
//           </p>
//         </div>

//         {/* Specs: Dibuat horizontal/row agar hemat tempat */}
//         <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
//           <div className="flex flex-col">
//             <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Display</span>
//             <span className="text-xs font-semibold">6.1" Super Retina</span>
//           </div>
//           <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
//           <div className="flex flex-col">
//             <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Storage</span>
//             <span className="text-xs font-semibold">128GB</span>
//           </div>
//           <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
//           <div className="flex flex-col">
//             <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tight">Color</span>
//             <span className="text-xs font-semibold">Midnight</span>
//           </div>
//         </div>
//       </div>
//     </div>

//   </div>
// </div>


// <div className="group mb-20">
//   {/* 1. Header Area: Judul & Link dibikin bersih */}
//   <div className="flex items-center justify-between mb-6">
//     <div className="space-y-1">
//       <Heading level={3} className="text-2xl font-bold tracking-tight">
//         iPhone 13
//       </Heading>
//       <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Daily Workhorse</p>
//     </div>
//     <a 
//       href="#" 
//       target="_blank" 
//       className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
//     >
//       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//     </a>
//   </div>

//   {/* 2. Image Area: Ratio lebar (21:9 atau 16:9) biar gak makan tempat ke bawah */}
//   <div className="relative aspect-[21/9] w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
//     <div className="flex items-center justify-center h-full text-slate-400">
//        {/* <img src="..." className="..." /> */}
//        <span className="text-xs font-mono uppercase">Device Visualization</span>
//     </div>
//   </div>

//   {/* 3. Info Area: Split antara Story dan Technical Data */}
//   <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
//     {/* Kolom Kiri: Narasi Personal (2/3) */}
//     <div className="flex-[2] space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
//       <p>
//         Bukan sekadar HP, perangkat ini adalah pintu gerbang saya untuk memastikan kualitas produk di dunia nyata. Chip A15 Bionic-nya tetap responsif untuk menangani multitasking dari komunikasi tim hingga *testing* aplikasi secara instan.
//       </p>
//       <p>
//         Poin krusialnya ada pada **real-device testing**. Saya memakainya untuk memastikan transisi antarmuka terasa halus dan navigasi *mobile browser* berjalan tanpa hambatan, memberikan sudut pandang yang tidak bisa didapatkan dari emulator.
//       </p>
//     </div>

//     {/* Kolom Kanan: Quick Specs (1/3) - Dibuat Minimalis List */}
//     <div className="flex-1">
//       <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Core Specs</h4>
//       <ul className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
//         {[
//           { label: "Display", value: '6.1" Super Retina' },
//           { label: "Storage", value: "128GB" },
//           { label: "Color", value: "Midnight" }
//         ].map((spec) => (
//           <li key={spec.label} className="flex justify-between text-xs">
//             <span className="text-slate-500">{spec.label}</span>
//             <span className="font-semibold text-slate-900 dark:text-slate-200">{spec.value}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   </div>
// </div>

// <div className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
//   <div className="flex flex-col lg:flex-row gap-2">
    
//     {/* 1. Visual Block (Blueprint Style) */}
//     <div className="relative lg:w-1/3 aspect-square rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center">
//       {/* Background Decor (Grid Pattern) */}
//       <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
//            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
//       />
      
//       <div className="relative z-10 text-center">
//         {/* Tempat Image */}
//         <div className="text-4xl mb-2">📱</div>
//         <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-400">Device_ID: IP13-MND</span>
//       </div>
      
//       {/* Corner Accents */}
//       <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-slate-300 dark:border-slate-600" />
//       <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-slate-300 dark:border-slate-600" />
//     </div>

//     {/* 2. Info Block */}
//     <div className="flex-1 p-6 flex flex-col">
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">iPhone 13</h3>
//           <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest">Secondary Device / Testing</p>
//         </div>
//         <a href="#" className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//         </a>
//       </div>

//       {/* Description: 3 Paragraphs (Dibuat Grid 2 Kolom untuk menghemat ruang) */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
//         <div className="space-y-4">
//           <p>
//             Bukan sekadar HP, perangkat ini adalah pintu gerbang saya untuk memastikan kualitas produk di dunia nyata. Chip A15 Bionic-nya tetap responsif untuk menangani multitasking.
//           </p>
//           <p>
//             Poin krusialnya ada pada **real-device testing**. Saya memakainya untuk memastikan transisi antarmuka terasa halus dan navigasi mobile berjalan tanpa hambatan.
//           </p>
//         </div>
//         <div>
//           <p>
//             Kualitas kameranya membantu dokumentasi cepat atau menangkap inspirasi desain saat eksplorasi. Ukurannya pas di tangan, nyaman dibawa tanpa membebani saku.
//           </p>
//         </div>
//       </div>

//       {/* 3. Footer Specs Bar */}
//       <div className="mt-auto pt-6 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap gap-6">
//         <div className="space-y-1">
//           <p className="text-[10px] uppercase font-bold text-slate-400">Panel</p>
//           <p className="text-sm font-semibold">Super Retina</p>
//         </div>
//         <div className="space-y-1">
//           <p className="text-[10px] uppercase font-bold text-slate-400">Capacity</p>
//           <p className="text-sm font-semibold">128 GB</p>
//         </div>
//         <div className="space-y-1">
//           <p className="text-[10px] uppercase font-bold text-slate-400">Engine</p>
//           <p className="text-sm font-semibold">A15 Bionic</p>
//         </div>
//       </div>
//     </div>

//   </div>
// </div>

//       <div className="group mb-20 md:mb-28">
//         <Heading level={3} className="text-2xl font-semibold mb-6">
//           iPhone 13
//         </Heading>

//         <div className="aspect-video w-full rounded-2xl bg-slate-100 dark:bg-slate-900 mb-8 overflow-hidden border border-slate-200 dark:border-slate-800">
//           <div className="flex items-center justify-center h-full text-slate-400">
//             <span className="text-sm font-medium">iPhone 13 Image</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
//           <div className="lg:col-span-2 space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-balance">
//             <p>
//               iPhone 13 masih menjadi *daily driver* yang sangat andal untuk mendukung produktivitas harian. Chip A15 Bionic di dalamnya memastikan semua aplikasi berjalan responsif, mulai dari manajemen tugas hingga komunikasi tim tanpa kendala.
//             </p>
//             <p>
//               Sebagai engineer, perangkat ini krusial untuk melakukan *real-device testing*. Saya menggunakannya untuk memastikan setiap komponen antarmuka terasa natural saat disentuh dan responsif di browser mobile, memberikan perspektif pengguna yang sebenarnya.
//             </p>
//             <p>
//               Kualitas kameranya juga sangat membantu untuk dokumentasi cepat atau menangkap inspirasi desain saat sedang eksplorasi. Ukurannya yang pas di tangan membuatnya nyaman dibawa bermobilitas tanpa terasa membebani saku.
//             </p>
//             <div className="pt-4">
//               <a href="#" target="_blank" rel="sponsored nofollow" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:opacity-70 transition-opacity">
//                 Cek di Tokopedia 
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//               </a>
//             </div>
//           </div>

//           <div className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/20">
//             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Spesifikasi Utama</h4>
//             <dl className="space-y-4 text-sm">
//               <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2">
//                 <dt className="text-slate-500">Display</dt>
//                 <dd className="font-medium text-slate-900 dark:text-slate-200">6.1" Super Retina</dd>
//               </div>
//               <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/50 pb-2">
//                 <dt className="text-slate-500">Storage</dt>
//                 <dd className="font-medium text-slate-900 dark:text-slate-200">128GB</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-slate-500">Color</dt>
//                 <dd className="font-medium text-slate-900 dark:text-slate-200">Midnight</dd>
//               </div>
//             </dl>
//           </div>
//         </div>
//       </div>

//       <Section id="software">
//   <Heading level={2} className="mb-8">Software</Heading>
  
//   <div className="flex flex-col border-t border-slate-100 dark:border-slate-800">
//     {/* ITEM: VS Code */}
//     <div className="group flex flex-col md:flex-row md:items-start justify-between py-8 border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-4 -mx-4 rounded-xl">
//       <div className="flex-1 md:pr-12">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20">
//             VS
//           </div>
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visual Studio Code</h3>
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
//           Editor utama untuk semua project. Saya menggunakan tema **Night Owl** dan font **Geist Mono** untuk menjaga mata tetap nyaman saat sesi koding yang panjang. Ekosistem extension-nya sangat membantu produktivitas harian.
//         </p>
//       </div>
      
//       <div className="mt-4 md:mt-0 shrink-0">
//         <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
//           Development
//         </span>
//       </div>
//     </div>

//     {/* ITEM: Figma */}
//     <div className="group flex flex-col md:flex-row md:items-start justify-between py-8 border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-4 -mx-4 rounded-xl">
//       <div className="flex-1 md:pr-12">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-600 dark:text-orange-400 border border-orange-500/20">
//             FG
//           </div>
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Figma</h3>
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
//           Tempat di mana semua konsep UX dan UI lahir. Dari wireframe cepat sampai prototyping interaktif, Figma adalah *tool* krusial untuk menjembatani ide desain ke implementasi kode.
//         </p>
//       </div>
      
//       <div className="mt-4 md:mt-0 shrink-0">
//         <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
//           Design
//         </span>
//       </div>
//     </div>

//     {/* ITEM: Arc Browser */}
//     <div className="group flex flex-col md:flex-row md:items-start justify-between py-8 border-b border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 px-4 -mx-4 rounded-xl">
//       <div className="flex-1 md:pr-12">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-purple-600 dark:text-purple-400 border border-purple-500/20">
//             AR
//           </div>
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Arc Browser</h3>
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
//           Mengubah cara saya menjelajahi web. Fitur *Spaces* dan *Split View*-nya sangat membantu saat melakukan riset sambil menulis kode di saat yang bersamaan.
//         </p>
//       </div>
      
//       <div className="mt-4 md:mt-0 shrink-0">
//         <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
//           Productivity
//         </span>
//       </div>
//     </div>
//   </div>
// </Section>


// <Section id="hardware">
//   <Heading level={2} className="mb-16 opacity-50 uppercase tracking-[0.3em] text-sm">
//     01. Hardware
//   </Heading>

//   <div className="space-y-32">
//     {/* ITEM: MACBOOK PRO */}
//     <div className="relative">
//       {/* Background Numbering (Subtle) */}
//       <span className="absolute -left-8 -top-8 text-8xl font-bold text-slate-100 dark:text-slate-900 -z-10 select-none">
//         01
//       </span>
      
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8">
//         {/* Kolom Judul (Gede Banget sebagai ganti Image) */}
//         <div className="lg:col-span-12 border-b border-slate-900 dark:border-white pb-4 mb-8">
//           <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
//             MacBook Pro 14"
//           </h3>
//         </div>

//         {/* Kolom Cerita (Paragraf Pendek) */}
//         <div className="lg:col-span-7 pr-0 lg:pr-16 space-y-6 text-lg text-slate-600 dark:text-slate-400">
//           <p className="font-medium text-slate-900 dark:text-white leading-snug">
//             Bukan sekadar laptop, tapi mesin tempur utama. Chip **M2 Pro** di dalamnya bikin workflow ngoding dan desain kerasa *seamless* tanpa hambatan.
//           </p>
//           <p className="text-sm leading-relaxed">
//             Daya tahan baterainya jadi penyelamat buat sesi kerja panjang di luar kantor. Ditambah layar dengan akurasi warna tinggi, setiap detail desain bisa dipoles dengan presisi. Wajib hukumnya buat testing Safari secara native.
//           </p>
//           <p className="text-sm leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-800 pl-4">
//             "Kualitas audio jernih dan trackpad presisi bikin laptop ini jadi partner paling nyaman buat eksplorasi ke mana saja."
//           </p>
//         </div>

//         {/* Kolom Specs (Dibuat Grid Kecil) */}
//         <div className="lg:col-span-5 grid grid-cols-2 gap-4 h-fit">
//           {[
//             { label: "Processor", value: "M2 Pro" },
//             { label: "Memory", value: "16GB Unified" },
//             { label: "Storage", value: "512GB SSD" },
//             { label: "Display", value: '14" Liquid XDR' },
//           ].map((spec) => (
//             <div key={spec.label} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm">
//               <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{spec.label}</p>
//               <p className="text-sm font-bold">{spec.value}</p>
//             </div>
//           ))}
//           <a href="#" className="col-span-2 p-4 flex justify-between items-center bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-all rounded-sm">
//             <span className="text-xs font-bold uppercase tracking-widest">Affiliate Link</span>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//           </a>
//         </div>
//       </div>
//     </div>

//     {/* Ulangi untuk iPhone, dll dengan urutan yang sama */}
//   </div>
// </Section>

// {/* MODAL CONTENT EXAMPLE */}
// <div className="p-8 md:p-12 max-w-4xl w-full bg-white dark:bg-slate-950 rounded-3xl overflow-hidden">
//   <header className="flex justify-between items-start mb-10">
//     <div>
//       <h2 className="text-3xl font-black uppercase italic tracking-tighter">MacBook Pro 14"</h2>
//       <p className="text-blue-600 font-mono text-xs mt-1">PRIMARY WORKSTATION</p>
//     </div>
//     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
//       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
//     </button>
//   </header>

//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//     {/* Kolom Visual & Specs */}
//     <div className="space-y-8">
//       <div className="aspect-video rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-mono text-xs text-slate-500">
//         [PRODUCT_IMAGE_HERE]
//       </div>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
//           <p className="text-[10px] text-slate-400 uppercase font-bold">Processor</p>
//           <p className="text-sm font-bold">M2 Pro</p>
//         </div>
//         <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
//           <p className="text-[10px] text-slate-400 uppercase font-bold">RAM</p>
//           <p className="text-sm font-bold">16GB Unified</p>
//         </div>
//       </div>
//     </div>

//     {/* Kolom Deskripsi */}
//     <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
//       <p className="text-lg font-medium text-slate-900 dark:text-white">
//         Mesin tempur utama untuk handle codebase kompleks dan desain berat secara lancar.
//       </p>
//       <div className="space-y-4 text-sm">
//         <p>Baterainya awet banget buat kerja seharian di coffee shop, ditambah layar Liquid Retina yang warnanya akurat untuk memoles detail desain.</p>
//         <p>Selain mesinnya, saya suka kualitas audionya yang jernih untuk dengerin musik sambil fokus. Partner yang nyaman buat dibawa eksplorasi ke mana saja.</p>
//       </div>
      
//       <a href="#" className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-all">
//         Buy on Tokopedia
//         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//       </a>
//     </div>
//   </div>
// </div>

// <Section id="hardware">
//   <Heading level={2} className="mb-8">Hardware</Heading>
  
//   <div className="flex flex-col border-t border-slate-100 dark:border-slate-800">
//     {/* ITEM: MACBOOK PRO */}
//     <button 
//       // onClick={() => openModal('macbook')}
//       className="group flex items-center justify-between py-6 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-4 -mx-4 transition-all text-left"
//     >
//       <div className="flex items-center gap-6 md:gap-10">
//         {/* Numbering subtle ala enji.dev */}
//         <span className="hidden sm:block font-mono text-xs text-slate-400 tabular-nums">01</span>
        
//         <div>
//           <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
//             MacBook Pro 14"
//           </h3>
//           <p className="text-sm text-slate-500 mt-1">
//             M2 Pro • 16GB • 512GB • Space Grey
//           </p>
//         </div>
//       </div>
      
//       <div className="flex items-center gap-4">
//         {/* Hint text yang muncul pas hover */}
//         <span className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
//           Details
//         </span>
//         <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//         </div>
//       </div>
//     </button>

//     {/* ITEM: IPHONE 13 */}
//     <button 
//       // onClick={() => openModal('iphone')}
//       className="group flex items-center justify-between py-6 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-4 -mx-4 transition-all text-left"
//     >
//       <div className="flex items-center gap-6 md:gap-10">
//         <span className="hidden sm:block font-mono text-xs text-slate-400 tabular-nums">02</span>
//         <div>
//           <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
//             iPhone 13
//           </h3>
//           <p className="text-sm text-slate-500 mt-1">
//             A15 Bionic • 128GB • Midnight
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <span className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
//           Details
//         </span>
//         <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//         </div>
//       </div>
//     </button>

//     {/* ITEM: SONY LINKBUDS FIT */}
//     <button 
//       // onClick={() => openModal('linkbuds')}
//       className="group flex items-center justify-between py-6 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-4 -mx-4 transition-all text-left"
//     >
//       <div className="flex items-center gap-6 md:gap-10">
//         <span className="hidden sm:block font-mono text-xs text-slate-400 tabular-nums">03</span>
//         <div>
//           <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
//             Sony LinkBuds Fit
//           </h3>
//           <p className="text-sm text-slate-500 mt-1">
//             ANC • Bluetooth 5.3 • 21h Battery
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <span className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
//           Details
//         </span>
//         <div className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
//         </div>
//       </div>
//     </button>
//   </div>
// </Section>
//       {/* Next Item Hardware bisa ditaruh di sini (iPhone, Monitor, dll) */}
//     </Section>
//   )
// }
