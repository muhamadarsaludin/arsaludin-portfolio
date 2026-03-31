type BrowserWrapperIllustrationProps = {
  children?: React.ReactNode
}

export default function BrowserIllustration({ children }: BrowserWrapperIllustrationProps) {
  const colors = [
    "bg-red-400 dark:bg-red-500",
    "bg-amber-400 dark:bg-amber-500",
    "bg-green-400 dark:bg-green-500",
  ]
  return (
    <div className="border-primary bg-surface-primary relative flex h-35 w-50 flex-col overflow-hidden rounded-lg border sm:h-40 sm:w-55">
      {/* Browser header */}
      <div className="border-primary bg-surface-secondary flex items-center gap-1 border-b px-2 py-1">
        {/* buttons */}
        {[1, 2, 3].map((i, idx) => (
          <div key={i} className={`border-primary h-2 w-2 rounded-full border ${colors[idx]}`} />
        ))}
        {/* URL Bar */}
        <div className="ml-1 h-2 flex-1 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
