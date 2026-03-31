import { Geist, Geist_Mono, Outfit } from "next/font/google"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["Arial", "Helvetica", "sans-serif"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["Courier New", "Courier", "monospace"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  fallback: ["Arial", "Helvetica", "sans-serif"],
})

export { geist, geistMono, outfit }
