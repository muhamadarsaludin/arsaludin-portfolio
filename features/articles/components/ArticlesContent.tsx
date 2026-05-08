"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { LuChevronDown, LuFilter, LuSearch, LuTriangleAlert } from "react-icons/lu"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import MiracleCheckbox from "@/components/miracle/Checkbox"
import { useTranslations } from "next-intl"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"
import { useDebounce } from "@/hooks/useDebounce"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import { useAvailableCategories } from "@/features/categories/hooks/useAvailableCategories"
import { CategoryTargetType } from "@/features/categories/types/categories.types"
import { useUrlParams } from "@/hooks/useSearchParams"
import MiracleBadge from "@/components/miracle/Badge"
import { ARTICLES_PAGE_SIZE } from "../constants/articles.constans"
import { useInfiniteArticles } from "../hooks/useInfiniteArticles"
import Section from "@/components/Section"
import { useFeaturedArticles } from "../hooks/useFeaturedArticles"
import FeaturedArticleContent from "./FeaturedArticlesContent"
import ArticleCard from "./ArticleCard"
import ArticleCardSkeleton from "./ArticleCardSkeleton"
import { MiracleReveal } from "@/components/miracle/Reveal"

type ArticlesContentProps = {
  locale: string
  targetType: CategoryTargetType
}

export default function ArticlesContent({
  locale,
  targetType
}: ArticlesContentProps) {
  const t = useTranslations("pages.articles")
  const td = useTranslations("data")
  const { setParams, getParam, getArrayParam } = useUrlParams()

  const categorySlugs = getArrayParam("categories") || []
  const searchUrl = getParam("search") || ""

  const [search, setSearch] = useState(searchUrl)
  const debouncedSearch = useDebounce(search, 500)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  const { data: categories } = useAvailableCategories({ targetType })
  const categorySlugsList = useMemo(() => categories?.map((c) => c.slug) || [], [categories])

  useEffect(() => { setSearch(searchUrl) }, [searchUrl])
  useEffect(() => {
    if (debouncedSearch !== searchUrl) {
      setParams({ search: debouncedSearch || undefined })
    }
  }, [debouncedSearch, searchUrl, setParams])

  const handleToggleCategory = (value: string) => {
    const next = categorySlugs.includes(value)
      ? categorySlugs.filter((v) => v !== value)
      : [...categorySlugs, value]
    
    setParams({ categories: next.length ? next : undefined })
  }
  const handleToggleAllCategories = () => {
    const isAllSelected = categorySlugsList.length > 0 && categorySlugsList.every(v => categorySlugs.includes(v))
    setParams({ categories: isAllSelected ? undefined : categorySlugsList })
  }
  const handleReset = () => {
    setParams({ categories: undefined, search: undefined })
    setSearch("")
  }
  const getGroupStatus = (selected: string[], all: string[]) => {
    const isAllSelected = all.length > 0 && all.every((v) => selected.includes(v))
    const isSomeSelected = selected.length > 0 && !isAllSelected
    return { isAllSelected, isSomeSelected }
  }

  const currentFilters = useMemo(() => ({
    locale,
    search: searchUrl || undefined,
    categorySlugs: categorySlugs.length ? categorySlugs : undefined,
    pageSize: ARTICLES_PAGE_SIZE,
  }), [searchUrl, categorySlugs])
  const { 
    data, fetchNextPage, hasNextPage, isError, isLoading, isFetchingNextPage, refetch 
  } = useInfiniteArticles(currentFilters)
  
  const articles = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])
  
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && !isLoading,
  })

  const categoryStatus = getGroupStatus(categorySlugs, categorySlugsList)

  const renderContent = () => {
    if (isError) return <ErrorStateCard onRetry={() => refetch()} />
    if (isLoading) {
      return (
        <Section className="w-full grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
        </Section>
      )
    }
    if (articles.length === 0) return <EmptyStateCard />
    return (
      <Section className="w-full grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <MiracleReveal 
            animation="fade-up"
            delay={{
              default: 0,
              sm: (index % 6) * 0.1, 
              lg: (index % 6) * 0.1
            }}
            key={article.id}>
            <ArticleCard article={article} className="h-full w-full"/>
          </MiracleReveal>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => <ArticleCardSkeleton key={i} />)
        }
      </Section>
    )
  }

  return (
    <Section className="flex w-full flex-col gap-6 md:gap-8">
      <MiracleReveal animation="fade-right">
        <div className="flex w-full md:w-8/12 items-center gap-3 md:gap-4">
          <MiracleTextField 
            placeholder={t("searchBarPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<LuSearch />}
            fullWidth
          />
          <MiraclePopover
            open={isOpenFilter}
            onOpenChange={v => setIsOpenFilter(v)}
            defaultPosition="bottom-end"
            noPadding
            trigger={
              <MiracleButton 
                startIcon={<LuFilter />}
                endIcon={<LuChevronDown className={clsx("transition-transform duration-300", isOpenFilter && "-rotate-180")}/>}
              >
                <div className="flex gap-2 items-center">
                  Filter 
                  {categorySlugs.length > 0 && (
                    <MiracleBadge size="sm" variant="secondary">
                      {categorySlugs.length}
                    </MiracleBadge>
                  )}
                </div>
              </MiracleButton>
            }
          >
            <div className="flex flex-col w-64 max-h-112.5 gap-4 overflow-y-auto p-4">
              {categories && categories.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MiracleCheckbox 
                      invers
                      checked={categoryStatus.isAllSelected}
                      indeterminate={categoryStatus.isSomeSelected}
                      onChange={handleToggleAllCategories}
                    />
                    <p className="text-xs font-semibold uppercase tracking-tight">
                      {t("filter.label.categories")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 pl-4">
                    {categories.map((category) => (
                      <MiracleCheckbox 
                        key={category.slug} 
                        invers
                        checked={categorySlugs.includes(category.slug)}
                        onChange={() => handleToggleCategory(category.slug)}
                      >
                        {td.has(`categories.${category.slug}`) 
                          ? td(`categories.${category.slug}`) 
                          : category.name
                        }
                      </MiracleCheckbox>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-secondary italic px-2">No categories available</p>
              )}

              {(categorySlugs.length > 0 || searchUrl) && (
                <div className="w-full pt-4 border-t border-primary-inv">
                  <MiracleButton 
                    status="danger" 
                    size="sm" 
                    onClick={handleReset} 
                    fullWidth
                  >
                    {t("filter.reset")}
                  </MiracleButton>
                </div>
              )}
            </div>
          </MiraclePopover> 
        </div>
      </MiracleReveal>
      
      {/* Content */}
      {!searchUrl && categorySlugs.length === 0 && (
        <FeaturedArticleContent locale={locale} />
      )}
      <Section className="w-full overflow-hidden">{renderContent()}</Section>
      <div ref={loadMoreRef} className="flex w-full justify-center py-10">
        {!hasNextPage && !isLoading && articles.length > 0 && (
          <MiracleReveal animation="zoom-in">
            <p className="text-secondary text-sm italic flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <LuTriangleAlert className="text-yellow-500"/>
              {t("noMoreData")}
            </p>
          </MiracleReveal>
        )}
      </div>
    </Section>
  )
}



