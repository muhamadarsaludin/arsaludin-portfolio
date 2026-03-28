import Heading from '@/components/Heading'
import clsx from 'clsx'
import React from 'react'
import MiracleTooltip from '@/components/miracle/Tooltip'

export interface ServiceType {
  title: string
  description: string
  illustration: React.ReactNode
  skills: string[]
  featured?: boolean
}

export default function ServiceCard({ service }: { service: ServiceType }) {
  return (
    <div 
      className={clsx(
        "flex flex-col w-[80vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-start overflow-hidden",
        "border border-primary rounded-2xl"
      )}
    >
      <div className="w-full aspect-video relative flex justify-center items-center p-5 sm:p-6">
        {service.illustration}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#80808035_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_70%,transparent_100%)]"></div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 font-semibold text-primary text-lg md:text-xl xl:text-2xl">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {service.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-neutral-200/60 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400">
              {skill}
            </span>
          ))}
          {service.skills.length > 4 && (
            <MiracleTooltip
              trigger={
                <span className="cursor-help rounded-md bg-neutral-200/60 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700">
                  +{service.skills.length - 4}
                </span>
              }
              noPadding
            >
              <div className="max-w-[180px] p-2 text-center text-[11px] font-medium leading-snug whitespace-normal">
                {service.skills.slice(4).join(', ')}
              </div>
            </MiracleTooltip>
          )}
        </div>
      </div>
    </div>
  )
}