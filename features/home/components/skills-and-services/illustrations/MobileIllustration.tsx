import React from 'react'

type MobileIllustrationProps = {
  children?: React.ReactNode 
}

export default function MobileIllustration({children}: MobileIllustrationProps) {
  return (
    <div className="relative h-35 w-18 sm:h-40 sm:w-22 overflow-hidden rounded-lg border border-primary bg-surface-primary flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-center gap-0.5 border-b border-primary px-3 py-1 bg-surface-secondary">
        <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-600" />
        <div className="h-1 w-5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {/* Navigation Bar */}
      <div className="flex w-full items-center justify-around gap-1 border-t border-primary px-3 py-1 bg-surface-secondary">
        {/* Button menu */}
        {[
          { type: 'triangle' },
          { type: 'circle' },
          { type: 'square' },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-center">
            {item.type === 'triangle' && (
              <svg className="h-2 w-2 text-neutral-400 dark:text-neutral-600" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12 2 L2 8 L12 14 Z" />
              </svg>
            )}
            {item.type === 'circle' && (
              <svg className="h-2 w-2 text-neutral-400 dark:text-neutral-600" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="5" /></svg>
            )}
            {item.type === 'square' && (<svg className="h-2 w-2 text-neutral-400 dark:text-neutral-600" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10" /></svg>)}
          </div>
        ))}
      </div>
    </div>
  )
}
