/**
 * SKILL ENTITY
 * Database model (full data).
 * Used for admin & server logic.
 */
export interface SkillEntity {
  id: string
  name: string
  icon: string | null
  link: string | null
  user_id: string
  created_at: string
  updated_at: string
}

/**
 * SKILL (Public)
 * Public data for UI / Portfolio.
 */
export type Skill = Pick<
  SkillEntity,
  "id" | "name" | "icon" | "link"
>

/**
 * SKILL INPUT
 * Fields required for the Form (Create & Update).
 */
export type SkillInput = Pick<
  SkillEntity,
  "name" | "icon" | "link"
>