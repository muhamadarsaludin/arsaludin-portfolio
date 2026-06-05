"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/utils/class-name"
import { LuChevronDown, LuFilter, LuSearch, LuTriangleAlert } from "react-icons/lu"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import MiracleCheckbox from "@/components/miracle/Checkbox"
import { useTranslations } from "next-intl"
import { useInfiniteAchievements } from "../hooks/useInfiniteAchievements"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import { useDebounce } from "@/hooks/useDebounce"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import AchievementCardSkeleton from "./AchievementCardSkeleton"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import AchievementCard from "./AchievementCard"
import { useAvailableCategories } from "@/features/categories/hooks/useAvailableCategories"
import { useUrlParams } from "@/hooks/useSearchParams"
import MiracleBadge from "@/components/miracle/Badge"
import Section from "@/components/Section"
import {
  ACHIEVEMENTS_LEVELS,
  ACHIEVEMENTS_PAGE_SIZE,
  ACHIEVEMENTS_TYPES,
} from "../constants/achievements.constants"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"

type AchievementsContentProps = {
  locale: string
}

export default function AchievementsContent({ locale }: AchievementsContentProps) {
  const t = useTranslations("pages.achievements")
  const td = useTranslations("data")
  const { setParams, getParam, getArrayParam } = useUrlParams()

  const typesArray = getArrayParam("types") || []
  const levelsArray = getArrayParam("levels") || []
  const categorySlugsArray = getArrayParam("categories") || []
  const searchUrl = getParam("search") || ""

  const [search, setSearch] = useState(searchUrl)
  const [prevSearchUrl, setPrevSearchUrl] = useState(searchUrl)
  const debouncedSearch = useDebounce(search, 500)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const { data: categories } = useAvailableCategories({ locale, targetType: "achievement" })
  const categorySlugsList = useMemo(() => categories?.map((c) => c.slug) || [], [categories])

  if (searchUrl !== prevSearchUrl) {
    setPrevSearchUrl(searchUrl)
    setSearch(searchUrl)
  }

  useEffect(() => {
    if (debouncedSearch !== searchUrl) {
      setParams({ search: debouncedSearch || undefined })
    }
  }, [debouncedSearch, searchUrl, setParams])

  const handleToggleFilter = (key: "types" | "levels" | "categories", value: string) => {
    const current =
      key === "types" ? typesArray : key === "levels" ? levelsArray : categorySlugsArray
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]

    setParams({ [key]: next.length ? next : undefined })
  }

  const handleToggleAll = (key: "types" | "levels" | "categories", allValues: string[]) => {
    const current =
      key === "types" ? typesArray : key === "levels" ? levelsArray : categorySlugsArray
    const isAllSelected = allValues.length > 0 && allValues.every((v) => current.includes(v))

    setParams({ [key]: isAllSelected ? undefined : allValues })
  }

  const handleReset = () => {
    setParams({ types: undefined, levels: undefined, categories: undefined, search: undefined })
    setSearch("")
  }

  const getGroupStatus = (selected: string[], all: string[]) => {
    const isAllSelected = all.length > 0 && all.every((v) => selected.includes(v))
    const isSomeSelected = selected.length > 0 && !isAllSelected
    return { isAllSelected, isSomeSelected }
  }

  const currentFilters = {
    locale,
    search: searchUrl || undefined,
    types: typesArray.length ? typesArray : undefined,
    levels: levelsArray.length ? levelsArray : undefined,
    categorySlugs: categorySlugsArray.length ? categorySlugsArray : undefined,
    pageSize: ACHIEVEMENTS_PAGE_SIZE,
  }

  const { data, fetchNextPage, hasNextPage, isError, isLoading, isFetchingNextPage, refetch } =
    useInfiniteAchievements(currentFilters)

  const achievements = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])
  const achievementIds = useMemo(() => achievements.map((a) => a.id), [achievements])

  const { data: dataReactions } = useBatchReactions({
    targetIds: achievementIds,
    targetType: "achievement",
  })

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && !isLoading,
  })

  const typeStatus = getGroupStatus(typesArray, ACHIEVEMENTS_TYPES as string[])
  const levelStatus = getGroupStatus(levelsArray, ACHIEVEMENTS_LEVELS as string[])
  const categoryStatus = getGroupStatus(categorySlugsArray, categorySlugsList)
  const activeFiltersCount = typesArray.length + levelsArray.length + categorySlugsArray.length

  const renderContent = () => {
    if (isError) return <ErrorStateCard onRetry={() => refetch()} />
    if (isLoading) {
      return (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AchievementCardSkeleton key={i} />
          ))}
        </div>
      )
    }
    if (achievements.length === 0) return <EmptyStateCard />

    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {achievements.map((achievement, index) => {
          const dataReaction = dataReactions?.[achievement.id]
          const reactionSummary = dataReaction?.summary || achievement.reaction_summary
          const userReaction = dataReaction?.userReaction || null
          return (
            <MiracleReveal
              animation="fade-up"
              delay={{
                default: 0,
                sm: (index % 6) * 0.1,
              }}
              key={achievement.id}
            >
              <AchievementCard
                className="h-full w-full"
                achievement={achievement}
                reactionSummary={reactionSummary}
                userReaction={userReaction}
              />
            </MiracleReveal>
          )
        })}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => <AchievementCardSkeleton key={`more-${i}`} />)}
      </div>
    )
  }

  return (
    <Section className="flex w-full flex-col gap-6 md:gap-8">
      <MiracleReveal animation="fade-right">
        <div className="flex w-full items-center gap-3 md:w-8/12 md:gap-4">
          <MiracleTextField
            placeholder={t("searchBarPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<LuSearch />}
            fullWidth
          />
          <MiraclePopover
            open={isOpenFilter}
            onOpenChange={(v) => setIsOpenFilter(v)}
            defaultPosition="bottom-end"
            noPadding
            trigger={
              <MiracleButton
                startIcon={<LuFilter />}
                endIcon={
                  <LuChevronDown
                    className={cn(
                      "transition-transform duration-300",
                      isOpenFilter && "-rotate-180"
                    )}
                  />
                }
              >
                <div className="flex items-center gap-2">
                  Filter
                  {activeFiltersCount > 0 && (
                    <MiracleBadge size="sm" variant="secondary">
                      {activeFiltersCount}
                    </MiracleBadge>
                  )}
                </div>
              </MiracleButton>
            }
          >
            <div className="flex max-h-112.5 w-64 flex-col gap-4 overflow-y-auto p-4">
              {/* Filter Types */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MiracleCheckbox
                    invers
                    checked={typeStatus.isAllSelected}
                    indeterminate={typeStatus.isSomeSelected}
                    onChange={() => handleToggleAll("types", ACHIEVEMENTS_TYPES as string[])}
                  />
                  <p className="text-xs font-semibold tracking-tight uppercase">
                    {t("filter.label.types")}
                  </p>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                  {ACHIEVEMENTS_TYPES.map((type) => (
                    <MiracleCheckbox
                      key={type}
                      invers
                      checked={typesArray.includes(type)}
                      onChange={() => handleToggleFilter("types", type)}
                    >
                      {td(`achievement.types.${type}`)}
                    </MiracleCheckbox>
                  ))}
                </div>
              </div>

              {/* Filter Levels */}
              <div className="border-primary-inv flex flex-col gap-2 border-t pt-4">
                <div className="flex items-center gap-2">
                  <MiracleCheckbox
                    invers
                    checked={levelStatus.isAllSelected}
                    indeterminate={levelStatus.isSomeSelected}
                    onChange={() => handleToggleAll("levels", ACHIEVEMENTS_LEVELS as string[])}
                  />
                  <p className="text-xs font-semibold tracking-tight uppercase">
                    {t("filter.label.levels")}
                  </p>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                  {ACHIEVEMENTS_LEVELS.map((level) => (
                    <MiracleCheckbox
                      key={level}
                      invers
                      checked={levelsArray.includes(level.toString())}
                      onChange={() => handleToggleFilter("levels", level.toString())}
                    >
                      {td(`achievement.levels.${level}`)}
                    </MiracleCheckbox>
                  ))}
                </div>
              </div>

              {/* Filter Categories */}
              {categories && categories.length > 0 && (
                <div className="border-primary-inv flex flex-col gap-2 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <MiracleCheckbox
                      invers
                      checked={categoryStatus.isAllSelected}
                      indeterminate={categoryStatus.isSomeSelected}
                      onChange={() => handleToggleAll("categories", categorySlugsList)}
                    />
                    <p className="text-xs font-semibold tracking-tight uppercase">
                      {t("filter.label.categories")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 pl-4">
                    {categories.map((category) => (
                      <MiracleCheckbox
                        key={category.slug}
                        invers
                        checked={categorySlugsArray.includes(category.slug)}
                        onChange={() => handleToggleFilter("categories", category.slug)}
                      >
                        {category.name}
                      </MiracleCheckbox>
                    ))}
                  </div>
                </div>
              )}

              {(categorySlugsArray.length > 0 ||
                typesArray.length > 0 ||
                levelsArray.length > 0 ||
                searchUrl) && (
                <div className="border-primary-inv w-full border-t pt-4">
                  <MiracleButton status="danger" size="sm" onClick={handleReset} fullWidth>
                    {t("filter.reset")}
                  </MiracleButton>
                </div>
              )}
            </div>
          </MiraclePopover>
        </div>
      </MiracleReveal>

      <div className="w-full overflow-hidden">{renderContent()}</div>

      <div ref={loadMoreRef} className="flex w-full justify-center py-10">
        {!hasNextPage && !isLoading && achievements.length > 0 && (
          <MiracleReveal animation="zoom-in">
            <p className="text-secondary border-primary/20 bg-primary/5 flex items-center gap-2 rounded-full border px-4 py-2 text-sm italic">
              <LuTriangleAlert className="text-yellow-500" />
              {t("noMoreData")}
            </p>
          </MiracleReveal>
        )}
      </div>
    </Section>
  )
}
