"use server"

import { createClient } from "@/lib/supabase/server";
import { Category, CategoryTargetType } from "../types/categories.types";

type GetAvailableCategoriesParams = {
  targetType: CategoryTargetType
}

type GetAvailableCategoriesResponse = Category & Record<string, { id: string, is_show: boolean}[]>

export async function getAvailableCategories({ 
  targetType 
}: GetAvailableCategoriesParams): Promise<Category[]> {
  const supabase = await createClient();
  const relationTable = `${targetType}_categories`;
  
  const { data, error } = await supabase
    .from("categories")
    .select<string, GetAvailableCategoriesResponse>(`
      id,
      name,
      slug,
      is_show,
      ${relationTable}!inner(
        id,
        is_show
      )
    `)
    .eq("is_show", true)
    .eq(`${relationTable}.is_show`, true)
    .order("name", { ascending: true });

  if (error) {
    console.error(`[getAvailableCategories] Error:`, error);
    throw error
  }

  if (!data) return []

  const uniqueCategories: Category[] = Array.from(
    new Map(data.map((item) => [item.id, item])).values()
  ).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    is_show: cat.is_show,
  }));

  return uniqueCategories;
}