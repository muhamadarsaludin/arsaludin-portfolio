export type Skill = {
  name: string
  icon: string | null
  color: string | null
}

export type SkillSummary = {
  hasSkills: boolean
  all: Skill[]
  top: Skill[]
  total: number
  remaining: number
}
