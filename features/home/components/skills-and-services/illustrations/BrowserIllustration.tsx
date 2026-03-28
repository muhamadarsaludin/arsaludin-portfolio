type BrowserWrapperIllustrationProps = {
  children?: React.ReactNode 
}

export default function BrowserIllustration({children}: BrowserWrapperIllustrationProps) {
  const colors = [
    'bg-red-400 dark:bg-red-500', 
    'bg-amber-400 dark:bg-amber-500', 
    'bg-green-400 dark:bg-green-500'
  ]
  return (
    <div className="relative flex flex-col h-35 w-50 sm:h-40 sm:w-55 overflow-hidden rounded-lg border border-primary bg-surface-primary">
      {/* Browser header */}
      <div className="flex items-center gap-1 border-b border-primary px-2 py-1 bg-surface-secondary">
        {/* buttons */}
        {[1, 2, 3].map((i, idx) => (
          <div key={i} className={`h-2 w-2 rounded-full border border-primary ${colors[idx]}`} />
        ))}
        {/* URL Bar */}
        <div className="ml-1 h-2 flex-1 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
