import { createClient } from "@/lib/supabase/server"
import {routing} from "@/i18n/routing"
import { Skill } from "@/features/shared/types/skills"
import type { Reaction, ReactionSummary } from "@/features/shared/types/reactions"

type ProjectTranslation = {
  title: string | null
  description: string | null
  content: string | null
  additional_info: string | null
  additional_info_label: string | null
  i18n: {
    locale: string
  }[]
}

type ProjectSkill = {
  skills: Skill | null
}[]

export type Project = {
  id: string;
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  github_url: string | null;
  url: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  additional_info: {
    label: string;
    content: string;
  };
  skills: Skill[];
  comments_count: number;
  reaction_sumary: ReactionSummary;
}

export async function getProjects(
  locale: string = routing.defaultLocale,
  isFeatured: boolean = false,
  limit: number = 12,
  page: number = 1
) : Promise<Project[]> {
  const supabase = await createClient()

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
  .from("projects")
  .select(`
    id,
    name,
    slug,
    thumbnail,
    github_url,
    url,
    created_at,
    updated_at,
    project_translations!inner (
      description,
      content,
      additional_info,
      additional_info_label,
      i18n!inner (
        locale
      )
    ),
    skill_maps (
      skills ( 
        name,
        icon,
        color
      )
    ),
    comments(count),
    project_reaction_summary(
      emoji,
      count
    )
  `)
  .eq("project_translations.i18n.locale", locale)
  .order("order_index", { ascending: true })
  .limit(3)
  .eq("skill_maps.is_show", true)
  .eq("skill_maps.target_type", "project")
  .order("order_index", { referencedTable: "skill_maps", ascending: true })
  .eq('comments.target_type', 'project');

  if (isFeatured) {
    query.eq("is_featured", true);
  }

  query = query.range(from, to);

  const {data, error} = await query

  if (error) {
    console.error("Supabase Error:", error)
    throw error
  }
  if (!data) return []

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" })

  return data.map((project) => {
    const t = project.project_translations?.[0] as ProjectTranslation | undefined
    const skills =
        (project.skill_maps as unknown as ProjectSkill)
          ?.map((s) => s.skills)
          .filter((skill) => skill !== null) as Skill[] ?? []

    const commentsCount = (project.comments as any)?.[0]?.count ?? 0
    const reactions = (project.project_reaction_summary as Reaction[]) ?? [];

    const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);
    const topThree = sortedReactions.slice(0, 3);
    const limitedAll = sortedReactions.slice(0, 10)
    const remaining = sortedReactions.length > 3 ? sortedReactions.length - 3 : 0;
    const totalReactionsCount = sortedReactions.reduce((sum, r) => sum + r.count, 0);
    
    return {
      id: project.id,
      name: project.name,
      description: t?.description ?? "",
      slug: project.slug,
      thumbnail: project.thumbnail,
      github_url: project.github_url,
      url: project.url,
      content: t?.content ?? "",
      created_at: dateFormatter.format(new Date(project.created_at)),
      updated_at: dateFormatter.format(new Date(project.updated_at)),
      additional_info: {
        label: t?.additional_info ?? "",
        content: t?.additional_info ?? "",
      },
      skills,
      comments_count: commentsCount,
      reaction_sumary: {
        all: limitedAll,
        top: topThree,
        remaining: remaining,
        total: totalReactionsCount,
        isLimit: sortedReactions.length > limitedAll.length,
      },
    }
  })
}