import { Geist, Geist_Mono, Outfit } from "next/font/google"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  fallback: ["Courier New", "Courier", "monospace"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: 'swap',
  fallback: ["Arial", "Helvetica", "sans-serif"],
})

export { geistMono, outfit }
