import clsx from "clsx"
import React from "react"
import type { Service, ServiceLevel } from "../types/services.types"
import SkillBadges from "@/features/skills/components/SkillBadges"
import MiracleBadge, { BadgeColor } from "@/components/miracle/Badge"
import { useTranslations } from "next-intl"
import { LuCrown } from "react-icons/lu"

const badgeColor: Record<ServiceLevel, BadgeColor> = {
  expert: "yellow",
  intermediate: "blue",
  beginner: "green",
}

type ServiceCardProps = {
  service: Service
  illustration?: React.ReactNode
  className?: string
}

export default function ServiceCard({ service, illustration, className }: ServiceCardProps) {
  const td = useTranslations("data.service")
  
  return (
    <div
      className={clsx(
        "relative flex flex-col rounded-2xl border border-primary bg-primary",
        className
      )}
    >
      <div className="relative flex aspect-video w-full items-center justify-center p-5 md:p-6">
        {illustration}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#80808035_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)] bg-size-[16px_16px]" />
      </div>
      
      <div className="flex flex-1 flex-col p-5 md:p-6 items-start">
        {service.level && (
          <MiracleBadge 
            color={badgeColor[service.level]} 
            variant="secondary" 
            className="mb-2" 
            startIcon={service.level === "expert" ? <LuCrown /> : undefined}
          >
            {td("levels." + service.level)}
          </MiracleBadge>
        )}
        <h3 className="text-primary mb-1 text-lg font-semibold md:text-xl xl:text-2xl">
          {service.name}
        </h3>
        <p className="text-secondary mb-6 text-sm leading-relaxed">{service.description}</p>
        <SkillBadges skills={service.skills} className="mb-auto" />
      </div>
    </div>
  )
}