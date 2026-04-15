/**
 * SKILL ENTITY
 * Raw data from 'skills' table.
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
 * Flattened object for UI Portfolio.
 */
export type Skill = Pick<
  SkillEntity,
  "id" | "name" | "icon" | "link"
>