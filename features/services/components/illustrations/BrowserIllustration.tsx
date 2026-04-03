type BrowserWrapperIllustrationProps = {
  children?: React.ReactNode
}

export default function BrowserIllustration({ children }: BrowserWrapperIllustrationProps) {
  const colors = [
    "bg-red",
    "bg-yellow",
    "bg-green",
  ]
  return (
    <div className="border-primary bg-primary relative flex h-35 w-50 flex-col overflow-hidden rounded-lg border sm:h-40 sm:w-55">
      {/* Browser header */}
      <div className="border-primary bg-secondary flex items-center gap-1 border-b px-2 py-1">
        {/* buttons */}
        {colors.map((color, idx) => (
          <div key={idx} className={`border-primary h-2 w-2 rounded-full border ${color}`} />
        ))}
        {/* URL Bar */}
        <div className="ml-1 h-2 flex-1 rounded-sm bg-neutral-high" />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
