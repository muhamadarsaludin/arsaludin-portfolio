import clsx from "clsx"
import React from "react"
import FrontEndIllustration from "./illustrations/FrontEndIllustration"
import BackEndIllustration from "./illustrations/BackEndIllustration"
import UiUxIllustration from "./illustrations/UiUxIllustration"
import AndroidIllustration from "./illustrations/AndroidIllustration"
import PmIllustration from "./illustrations/PmIllustration"
import DevOpsIllustration from "./illustrations/DevOpsIllustration"
import type { Service } from "../types/services.types"
import SkillBadges from "@/features/skills/components/SkillBadges"

const SERVICE_ILLUSTRATION_MAP: Record<string, React.ReactNode> = {
  "front-end": <FrontEndIllustration />,
  "back-end": <BackEndIllustration />,
  "ui-ux": <UiUxIllustration />,
  android: <AndroidIllustration />,
  pm: <PmIllustration />,
  devops: <DevOpsIllustration />,
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div
      className={clsx(
        "flex w-[80vw] max-w-75 shrink-0 snap-start flex-col sm:w-auto sm:max-w-none",
        "border-primary rounded-2xl border"
      )}
    >
      <div className="relative flex aspect-video w-full items-center justify-center p-5 md:p-6">
        {SERVICE_ILLUSTRATION_MAP[service.slug]}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#80808035_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)] bg-size-[16px_16px]" />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-primary mb-1 text-lg font-semibold md:text-xl xl:text-2xl">
          {service.name}
        </h3>
        <p className="text-secondary mb-6 text-sm leading-relaxed">{service.description}</p>
        <SkillBadges skills={service.skills} className="mb-auto" />
      </div>
    </div>
  )
}
