import React from "react"

type MobileIllustrationProps = {
  children?: React.ReactNode
}

export default function MobileIllustration({ children }: MobileIllustrationProps) {
  return (
    <div className="border-primary bg-primary relative flex h-35 w-18 flex-col overflow-hidden rounded-lg border sm:h-40 sm:w-22">
      {/* Status Bar */}
      <div className="border-primary bg-secondary flex items-center justify-center gap-0.5 border-b px-3 py-1">
        <div className="h-1 w-1 rounded-full bg-neutral-high" />
        <div className="h-1 w-5 rounded-full bg-neutral-high" />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
      {/* Navigation Bar */}
      <div className="border-primary bg-secondary flex w-full items-center justify-around gap-1 border-t px-3 py-1">
        {/* Button menu */}
        {[{ type: "triangle" }, { type: "circle" }, { type: "square" }].map((item, index) => (
          <div key={index} className="flex items-center justify-center">
            {item.type === "triangle" && (
              <svg
                className="h-2 w-2 text-neutral-high"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M12 2 L2 8 L12 14 Z" />
              </svg>
            )}
            {item.type === "circle" && (
              <svg
                className="h-2 w-2 text-neutral-high"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <circle cx="8" cy="8" r="5" />
              </svg>
            )}
            {item.type === "square" && (
              <svg
                className="h-2 w-2 text-neutral-high"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <rect x="3" y="3" width="10" height="10" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
