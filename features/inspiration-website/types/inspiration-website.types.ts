export type InspirationWebsite = {
  link: string
  author: string
  location: "Indonesia" | "Global"
  type: "personal" | "organization"
  is_favorite: boolean
  role?: string
  company?: string
  image?: string
  description?: {
    en: string
    id: string
  }
}
