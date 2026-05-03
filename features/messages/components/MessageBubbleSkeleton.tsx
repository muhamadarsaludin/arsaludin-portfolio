import { MiracleSkeleton } from '@/components/miracle/Skeleton'
import clsx from 'clsx'

export default function MessageBubbleSkeleton(
  {isAuthor = false}: {isAuthor?: boolean}
) {
  const arrowPositionClass = isAuthor ?  "-right-[5px] bottom-3" : "-left-[5px] bottom-3"
  return (
    <div
      className={clsx(
        "flex flex-col w-full relative",
        isAuthor ? "items-end" : "items-start"
      )}
    >
      <div className={clsx(
        "group/message flex flex-col max-w-[90%] md:max-w-125 lg:max-w-140",
        isAuthor ? "items-end" : "items-start",    
        )}>
        {/* Name */}
        <div className={clsx(
          "flex items-center gap-2 mb-1.5",
          isAuthor ? "pr-11" : "pl-11",
          )}>
          <MiracleSkeleton className="h-3 w-20" />
        </div>
        {/* Body */}
        <div className={clsx(
          "flex gap-3 items-end",
          isAuthor ? "flex-row-reverse" : "flex-row"
          )}>
          {/* Avatar */}
          <MiracleSkeleton className="relative shrink-0 overflow-hidden rounded-full! h-8 w-8"/>
          {/* Bubble */}
          <MiracleSkeleton className={clsx("flex flex-col relative h-30 w-120 max-w-full p-3 rounded-md text-sm text-secondary whitespace-pre-wrap")}>
            {/* Arrow */}
            <MiracleSkeleton
              className={clsx(
                "absolute z-1 h-2.5 w-2.5 rounded-none!",
                arrowPositionClass,
                isAuthor ? "clip-triangle rotate-225" : "rotate-45"
              )}
            />
            {/* Content */}
          </MiracleSkeleton>
        </div>
        {/* footer */}
        <div className={clsx(
          "flex items-center pl-11 mt-0.5",
          isAuthor ? "pr-11 flex-row-reverse" : "pl-11 flex-row",
          )}>
          <MiracleSkeleton className="w-5 h-5 rounded-full! m-1"/>
          <MiracleSkeleton className="h-2.5 w-8"/>
        </div>
      </div>
    </div> 
  )
}
