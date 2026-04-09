export type Experience = {
  id: string
  role: string
  company: string
  company_logo: string | null
  company_link: string | null
  start_date: string
  end_date: string | null
  is_show: boolean
  employment_type: string
  location: string
  key_contributions: string[] | null
  user_id: string | null
  create_at: string | null
  updated_at: string | null
}

export type ExperienceTranslation = {
  role: string
  employment_type: string
  location: string
  key_contributions: string[] | null
  i18n: {
    locale: string
  }
}
