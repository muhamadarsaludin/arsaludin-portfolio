'use client'

import { motion } from 'framer-motion'

export default function UxIllustration() {
  return (
    <div className="relative flex h-36 w-52 flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 grid grid-cols-4 gap-1 p-2 opacity-20 dark:opacity-30">
         {[...Array(12)].map((_, i) => (
           <div key={i} className="border border-dashed border-neutral-500 dark:border-neutral-400" />
         ))}
      </div>
      
      {/* Top Toolbar (Design Tool Header) */}
      <div className="relative z-10 flex h-5 w-full shrink-0 items-center justify-between border-b border-neutral-300 bg-neutral-200/90 px-2 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/90">
        <div className="flex gap-1.5 items-center">
          {/* Frame Tool */}
          <div className="h-2 w-2 border border-neutral-500 dark:border-neutral-400" />
          {/* Shape Tool */}
          <div className="h-2 w-2 rounded-full border border-neutral-500 dark:border-neutral-400" />
          {/* Pen Tool */}
          <div className="h-2 w-2 bg-neutral-500 dark:bg-neutral-400" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        </div>
        <div className="h-1.5 w-8 rounded-full bg-neutral-400/50 dark:bg-neutral-600/50" />
      </div>

      {/* Main Workspace */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* Left Panel: Layers */}
        <div className="w-12 shrink-0 border-r border-neutral-300 bg-neutral-100/90 p-1.5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/90">
           <div className="mb-1.5 h-1 w-6 rounded bg-neutral-400 dark:bg-neutral-500" />
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="mb-1 flex items-center gap-1">
               <div className="h-1.5 w-1.5 rounded-sm border border-neutral-400 dark:border-neutral-500" />
               <div className="h-1 w-full rounded bg-neutral-300 dark:bg-neutral-600" />
             </div>
           ))}
        </div>

        {/* Center: Canvas / Artboard */}
        <div className="flex flex-1 items-center justify-center">
          <motion.div 
            className="relative flex h-16 flex-col gap-1 border border-blue-500 bg-white p-1 shadow-sm dark:bg-neutral-800"
            animate={{ width: ['64px', '64px', '64px', '84px', '64px', '64px'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Selection Handles */}
            <div className="absolute -left-1 -top-1 h-1.5 w-1.5 border border-blue-500 bg-white" />
            <div className="absolute -right-1 -top-1 h-1.5 w-1.5 border border-blue-500 bg-white" />
            <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border border-blue-500 bg-white" />
            <div className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border border-blue-500 bg-white" />
            
            {/* Internal Artboard Content */}
            <div className="h-2 w-full rounded-sm bg-neutral-200 dark:bg-neutral-700" />
            <motion.div 
              className="h-6 w-full rounded-sm"
              animate={{ backgroundColor: ['#171717', '#3b82f6', '#171717', '#171717', '#171717', '#171717'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Right Panel: Properties & Color Code */}
        <div className="w-16 shrink-0 border-l border-neutral-300 bg-neutral-100/90 p-1.5 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/90">
          <div className="mb-2 h-1 w-8 rounded bg-neutral-400 dark:bg-neutral-500" />
          
          {/* Fill property with Hex */}
          <div className="flex flex-col gap-0.5">
            <div className="h-1 w-4 rounded bg-neutral-400 dark:bg-neutral-500" />
            <motion.div 
              className="flex items-center gap-1 rounded border border-neutral-300 bg-white p-0.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-800"
              animate={{ borderColor: ['#d4d4d8', '#3b82f6', '#d4d4d8', '#d4d4d8', '#d4d4d8', '#d4d4d8'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#171717] dark:border dark:border-neutral-600" />
              <span className="text-[6px] font-mono tracking-tighter text-neutral-700 dark:text-neutral-300">#171717</span>
            </motion.div>
          </div>

          {/* Stroke property */}
          <div className="mt-1.5 flex flex-col gap-0.5">
            <div className="h-1 w-5 rounded bg-neutral-400 dark:bg-neutral-500" />
            <div className="flex items-center gap-1 rounded border border-neutral-300 bg-white p-0.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm border-[1.5px] border-neutral-400 bg-transparent" />
              <span className="text-[6px] font-mono tracking-tighter text-neutral-700 dark:text-neutral-300">#FFFFFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Cursor */}
      <motion.div 
        className="absolute z-20 drop-shadow-md"
        animate={{
          // Alur: Diam di Properties (10%) -> Klik (20%) -> Pindah ke Handle Canvas (30-40%) -> Drag (50-60%) -> Kembali (80-100%)
          left: ['80%', '80%', '80%', '64%', '64%', '73%', '64%', '80%'],
          top: ['45%', '45%', '45%', '55%', '55%', '55%', '55%', '45%'],
          scale: [1, 0.8, 1, 1, 0.9, 0.9, 1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neutral-600 dark:text-neutral-400">
          <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </div>
  )
}