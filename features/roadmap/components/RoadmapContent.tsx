"use client"

import MiracleBadge from "@/components/miracle/Badge";
import MiracleButton from "@/components/miracle/Button";
import MiracleCheckbox from "@/components/miracle/Checkbox";
import MiraclePopover from "@/components/miracle/Popover";
import MiracleTextField from "@/components/miracle/TextField";
import Section from "@/components/Section";
import { CARD_PRIORITIES, CARD_TYPES, CARDS_PAGE_SIZE } from "@/features/cards/constants/card.constants";
import { CardPriority, CardStatus, CardType } from "@/features/cards/types/cards.types";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlParams } from "@/hooks/useSearchParams";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { LuChevronDown, LuFilter, LuSearch } from "react-icons/lu";
import RoadmapColumn from "./RoadmapColumn";
import { MiracleReveal } from "@/components/miracle/Reveal";

type RoadmapContentProps = {
  kanbanStatuses: CardStatus[];
};

export default function RoadmapContent({ kanbanStatuses }: RoadmapContentProps) {
  const t = useTranslations("pages.roadmap")
  const td = useTranslations("data")
  const { setParams, getParam, getArrayParam } = useUrlParams()

  const types = (getArrayParam("types") || []) as CardType[]
  const priorities = (getArrayParam("priorities") || []) as CardPriority[]
  const searchUrl = getParam("search") || ""

  const [search, setSearch] = useState(searchUrl)
  const debouncedSearch = useDebounce(search, 500)
  const [isOpenFilter, setIsOpenFilter] = useState(false)

  useEffect(() => { setSearch(searchUrl) }, [searchUrl])
  
  useEffect(() => {
    if (debouncedSearch !== searchUrl) {
      setParams({ search: debouncedSearch || undefined })
    }
  }, [debouncedSearch, searchUrl, setParams])

  const handleToggleFilter = (key: "types" | "priorities", value: string) => {
    const current = (key === "types" ? types : priorities) as string[]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    
    setParams({ [key]: next.length ? next : undefined })
  }

  const handleToggleAll = (key: "types" | "priorities", allValues: readonly string[]) => {
    const current = (key === "types" ? types : priorities) as string[]
    const isAllSelected = allValues.length > 0 && allValues.every(v => current.includes(v))
    
    setParams({ [key]: isAllSelected ? undefined : [...allValues] })
  }

  const handleReset = () => {
    setParams({ types: undefined, priorities: undefined, search: undefined })
    setSearch("")
  }

  const getGroupStatus = (selected: string[], all: readonly string[]) => {
    const isAllSelected = all.length > 0 && all.every((v) => selected.includes(v))
    const isSomeSelected = selected.length > 0 && !isAllSelected
    return { isAllSelected, isSomeSelected }
  }

  const currentFilters = useMemo(() => ({
    search: searchUrl || undefined,
    types: types.length ? types : undefined,
    priorities: priorities.length ? priorities : undefined,
    pageSize: CARDS_PAGE_SIZE,
  }), [searchUrl, types, priorities])

  const typeStatus = getGroupStatus(types as string[], CARD_TYPES)
  const priorityStatus = getGroupStatus(priorities as string[], CARD_PRIORITIES)
  const activeFiltersCount = types.length + priorities.length

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
                  {activeFiltersCount > 0 && (
                    <MiracleBadge size="sm" variant="secondary">
                      {activeFiltersCount}
                    </MiracleBadge>
                  )}
                </div>
              </MiracleButton>
            }
          >
            <div className="flex flex-col w-64 max-h-112.5 gap-4 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MiracleCheckbox 
                    invers
                    checked={typeStatus.isAllSelected}
                    indeterminate={typeStatus.isSomeSelected}
                    onChange={() => handleToggleAll("types", CARD_TYPES)}
                  />
                  <p className="text-xs font-semibold uppercase tracking-tight">
                    {t("filter.label.types")}
                  </p>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                  {CARD_TYPES.map((type) => (
                    <MiracleCheckbox 
                      key={type} 
                      invers
                      checked={types.includes(type)}
                      onChange={() => handleToggleFilter("types", type)}
                    >
                      {td(`roadmap.types.${type}`)}
                    </MiracleCheckbox>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-primary-inv pt-4">
                <div className="flex items-center gap-2">
                  <MiracleCheckbox 
                    invers
                    checked={priorityStatus.isAllSelected}
                    indeterminate={priorityStatus.isSomeSelected}
                    onChange={() => handleToggleAll("priorities", CARD_PRIORITIES)}
                  />
                  <p className="text-xs font-semibold uppercase tracking-tight">
                    {t("filter.label.priorities")}
                  </p>
                </div>
                <div className="flex flex-col gap-1 pl-4">
                  {CARD_PRIORITIES.map((priority) => (
                    <MiracleCheckbox 
                      key={priority} 
                      invers
                      checked={priorities.includes(priority as CardPriority)}
                      onChange={() => handleToggleFilter("priorities", priority)}
                    >
                      {td(`roadmap.priorities.${priority}`)}
                    </MiracleCheckbox>
                  ))}
                </div>
              </div>

              {(types.length > 0 || priorities.length > 0 || searchUrl) && (
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
      <div className="flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden">
        {kanbanStatuses.map((status, index) => (
          <MiracleReveal 
            key={status}
            animation="zoom-in"
            delay={(index % 6) * 0.1}
            >
            <RoadmapColumn 
              status={status} 
              filters={currentFilters} 
              columnDelay={(index % 6) * 0.1}
              className="w-[75vw] sm:flex-1 sm:min-w-[320px] shrink-0 snap-start"
            />
          </MiracleReveal>
        ))}
      </div>
    </Section>
  )
}