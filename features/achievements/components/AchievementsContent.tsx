"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { LuFilter, LuSearch, LuTriangleAlert, LuX } from "react-icons/lu"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import { useTranslations } from "next-intl"
import { useInfiniteAchievements } from "../hooks/useInfiniteAchievements"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"
import { useDebounce } from "@/hooks/useDebounce"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import AchievementCardSkeleton from "./AchievementCardSkeleton"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import AchievementCard from "./AchievementCard"
import { ACHIEVEMENTS_PAGE_SIZE } from "../constants/achievements.types"
import { useAvailableCategories } from "@/features/categories/hooks/useAvailableCategories"
import { CategoryTargetType } from "@/features/categories/types/categories.types"
import { useQueryClient } from "@tanstack/react-query"
import { useUrlParams } from "@/hooks/useSearchParams"

type AchievementsContentProps = {
  targetType: CategoryTargetType
}

export default function AchievementsContent({
  targetType
}: AchievementsContentProps) {
  const t = useTranslations("pages.achievements")
  const { setParams, getParam, getArrayParam } = useUrlParams()

  const queryClient = useQueryClient()

  // --- URL STATE (source of truth) ---
  const types = getArrayParam("types")
  const categoryIds = getArrayParam("categories")
  const searchUrl = getParam("search") || ""

  // --- LOCAL INPUT STATE ---
  const [search, setSearch] = useState(searchUrl)
  const debouncedSearch = useDebounce(search, 500)

  // ✅ Sync URL → input
  useEffect(() => {
    if (searchUrl !== search) {
      setSearch(searchUrl)
    }
  }, [searchUrl])

  // ✅ Sync input → URL
  useEffect(() => {
    if (debouncedSearch !== searchUrl) {
      setParams({
        search: debouncedSearch || undefined
      })
    }
  }, [debouncedSearch, searchUrl, setParams])

  // --- FETCH CATEGORIES ---
  const { data: categories } = useAvailableCategories({ targetType })

  // --- FILTERS ---
  const currentFilters = useMemo(() => ({
    search: searchUrl || undefined,
    types: types?.length ? types : undefined,
    categoryIds: categoryIds?.length ? categoryIds : undefined,
    pageSize: ACHIEVEMENTS_PAGE_SIZE,
  }), [searchUrl, types, categoryIds])

  // console.log("currentFillters", {search: undefined, types: undefined, categoryIds: undefined, pageSize: ACHIEVEMENTS_PAGE_SIZE})

  // --- FETCH DATA ---
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isError,
    isLoading, 
    isFetchingNextPage,
    refetch
  } = useInfiniteAchievements(currentFilters)

  const achievements = useMemo(
    () => data?.pages.flatMap(p => p.data) ?? [],
    [data]
  )

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && !isLoading,
  })

  // --- RENDER ---
  const renderContent = () => {
    if (isError) return <ErrorStateCard onRetry={() => refetch()} />

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AchievementCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (achievements.length === 0) return <EmptyStateCard />

    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <AchievementCardSkeleton key={`more-${i}`} />
          ))
        }
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6 md:gap-8">
      
      {/* 🔍 TOOLBAR */}
      <div className="flex w-full items-center gap-3 md:gap-4 md:max-w-xl">
        
        {/* SEARCH */}
        <div className="relative flex-1">
          <MiracleTextField 
            placeholder={t("searchBarPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<LuSearch className="text-secondary" />}
            className="focus-within:shadow-sm"
            fullWidth
          />

          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary/10 rounded-full transition"
            >
              <LuX className="size-4" />
            </button>
          )}
        </div>

        {/* FILTER */}
        <MiraclePopover
          defaultPosition="bottom-end"
          trigger={
            <MiracleButton startIcon={<LuFilter />}>
              Filter {categoryIds?.length ? `(${categoryIds.length})` : ""}
            </MiracleButton>
          }
        >
          <div className="w-80 p-5 flex flex-col gap-5 bg-background rounded-2xl shadow-xl border border-secondary/10">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Filters</p>
              
              {categoryIds?.length && (
                <button
                  onClick={() => setParams({ categories: undefined })}
                  className="text-xs text-red-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                Categories
              </p>

              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                {categories?.map((cat) => {
                  const isActive = categoryIds?.includes(cat.id)

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        const prev = categoryIds || []
                        const next = isActive
                          ? prev.filter(id => id !== cat.id)
                          : [...prev, cat.id]

                        setParams({
                          categories: next.length ? next : undefined
                        })
                      }}
                      className={clsx(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-transparent text-secondary border-secondary/30 hover:border-primary hover:text-primary"
                      )}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </MiraclePopover> 
      </div>

      {/* GRID */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

      {/* FOOTER */}
      <div ref={loadMoreRef} className="flex w-full justify-center py-10">
        {!hasNextPage && !isLoading && achievements.length > 0 && (
          <p className="text-secondary/60 text-sm italic flex items-center gap-2 bg-secondary/5 px-4 py-2 rounded-full border border-secondary/5">
            <LuTriangleAlert className="text-yellow-500"/>
            {t("noMoreData")}
          </p>
        )}
      </div>

    </div>
  )
}