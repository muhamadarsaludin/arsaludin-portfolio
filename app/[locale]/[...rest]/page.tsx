import { notFound } from "next/navigation"

// Pastikan ada "default export" dan ini adalah fungsi komponen
export default function CatchAllPage() {
  notFound()
  return null
}