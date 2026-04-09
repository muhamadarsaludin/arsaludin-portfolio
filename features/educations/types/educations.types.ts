export type Education = {
  id: string
  school: string
  logo: string | null
  degree: string
  field: string
  grade: string | null
  start_date: string
  end_date: string | null
  location: string
  is_show: boolean
  description: string[] | null
  user_id: string | null
  create_at: string | null
  updated_at: string | null
}

export type EducationTranslation = {
  degree: string
  field: string
  location: string
  description: string[] | null
  i18n: {
    locale: string
  }
}
