"use client"

import { cn } from "@/utils/class-name"
import { LuArrowUpRight } from "react-icons/lu"
import type { GearAndSetupItem } from "../types/gear-and-setup.types"
import MiracleBadge from "@/components/miracle/Badge"

type GearAndSetupCardProps = {
  item: GearAndSetupItem
}

export default function GearAndSetupCard({ item }: GearAndSetupCardProps) {
  return (
    <div className="border-primary group/card bg-card relative flex items-start justify-between gap-4 overflow-hidden rounded-2xl border p-5 transition-all duration-300 md:gap-6 md:p-6">
      {item.link && (
        <a
          href={item.link}
          className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View details for ${item.name}`}
        />
      )}

      <div className="relative z-0 flex w-full flex-col items-start">
        {/* Title & Badge */}
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-primary text-lg font-semibold md:text-xl xl:text-2xl">{item.name}</h3>
          <MiracleBadge color="blue" variant="secondary">
            {item.type}
          </MiracleBadge>
        </div>

        {/* Description Banner Style */}
        <div className="text-secondary border-blue mt-5 flex items-start gap-2 border-l-2 py-1 pl-3 text-sm leading-relaxed italic md:mt-6">
          <p>
            {"“"}
            {item.description}
            {"”"}
          </p>
        </div>

        {/* Specs Grid/Flex Row */}
        {item.specs && item.specs.length > 0 && (
          <div className="mt-6 grid w-full grid-cols-2 items-start gap-x-0 gap-y-6 sm:flex sm:flex-wrap">
            {item.specs.map((spec, index) => {
              const isFirstItem = index === 0
              const isOddItem = index % 2 !== 0
              return (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col gap-1 pr-4 transition-all duration-300 sm:pr-8",
                    !isFirstItem && "sm:border-default sm:border-l sm:pl-8",
                    isOddItem
                      ? "border-default border-l pl-4"
                      : "sm:border-default border-none pl-0 sm:border-l sm:pl-8"
                  )}
                >
                  <p className="text-secondary text-[10px] tracking-tight uppercase md:text-xs">
                    {spec.name}
                  </p>
                  <p className="text-primary text-sm leading-none font-medium">{spec.value}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {/* Floating Arrow Icon Indicator */}
      {item.link && (
        <div className="border-primary relative z-20 hidden shrink-0 translate-x-2 cursor-pointer rounded-full border-2 p-2 opacity-0 transition-all duration-300 ease-in-out group-hover/card:translate-x-0 group-hover/card:opacity-100 hover:bg-neutral-100 md:block dark:hover:bg-neutral-900">
          <LuArrowUpRight size={20} className="text-primary" />
        </div>
      )}
    </div>
  )
}
