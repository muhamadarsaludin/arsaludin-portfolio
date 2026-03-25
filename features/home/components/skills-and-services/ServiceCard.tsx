import React from 'react'

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
      className={`group relative flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md dark:hover:bg-neutral-900 sm:w-auto sm:max-w-none ${
        service.featured 
          ? 'border-blue-300 bg-blue-50/50 dark:border-blue-500/40 dark:bg-blue-900/10' 
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700'
      }`}
    >
      {service.featured && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:border-blue-800/60 dark:bg-blue-900/40 dark:text-blue-300">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          Top Skill
        </div>
      )}
      <div className="flex w-full items-center justify-center">
        {service.illustration}
      </div>
      <div className="flex flex-1 flex-col text-center">
        <h3 className="mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {service.title}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {service.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-5">
          {service.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-neutral-200/60 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-400">
              {skill}
            </span>
          ))}
          {service.skills.length > 4 && (
            <div className="group/tooltip relative flex items-center justify-center">
              <span className="cursor-help rounded-md bg-neutral-200/60 px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-400 dark:hover:bg-neutral-700">
                +{service.skills.length - 4}
              </span>
              {/* Custom Tooltip */}
              <div className="pointer-events-none absolute bottom-full z-20 mb-1.5 w-max max-w-[180px] translate-y-1 rounded-md bg-neutral-800 px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-neutral-100 opacity-0 shadow-md transition-all duration-200 group-hover/tooltip:-translate-y-0 group-hover/tooltip:opacity-100 dark:bg-neutral-200 dark:text-neutral-900">
                {service.skills.slice(4).join(', ')}
                {/* Tooltip Triangle Arrow */}
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-800 dark:bg-neutral-200" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}