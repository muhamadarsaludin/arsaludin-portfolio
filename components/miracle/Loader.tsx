import React from "react"

interface LoaderProps {
  size?: number
  strokeWidth?: number
}

export default function MiracleLoader({ size = 24, strokeWidth = 8 }: LoaderProps) {
  return (
    <div className="flex items-center justify-center">
      <style>{`
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash-base {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -120;
          }
        }
        @keyframes dash-highlight {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 50, 200;
            stroke-dashoffset: -15;
          }
          100% {
            stroke-dasharray: 50, 200;
            stroke-dashoffset: -124;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 56 56"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: size,
          height: size,
          animation: "rotate 2s linear infinite",
        }}
      >
        {/* Base Circle */}
        <circle
          className="text-neutral-med"
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            opacity: 0.5,
            animation: "dash-base 1.5s linear infinite",
          }}
        />

        {/* Highlight Circle */}
        <circle
          className="text-blue"
          cx="28"
          cy="28"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            animation: "dash-highlight 1.5s linear infinite",
          }}
        />
      </svg>
    </div>
  )
}
