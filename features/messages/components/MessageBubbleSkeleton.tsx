import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function MessageBubbleSkeleton(
  {isAuthor = false}: {isAuthor?: boolean}
) {
  const arrowPositionClass = isAuthor ?  "-right-[5px] bottom-3" : "-left-[5px] bottom-3"
  return (
    <div
      className={cn(
        "flex flex-col w-full relative",
        isAuthor ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "group/message flex flex-col max-w-[90%] md:max-w-125 lg:max-w-140",
        isAuthor ? "items-end" : "items-start",    
        )}>
        {/* Name */}
        <div className={cn(
          "flex items-center gap-2 mb-1.5",
          isAuthor ? "pr-11" : "pl-11",
          )}>
          <MiracleSkeleton className="h-3 w-30" />
        </div>
        {/* Body */}
        <div className={cn(
          "flex gap-3 items-end",
          isAuthor ? "flex-row-reverse" : "flex-row"
          )}>
          {/* Avatar */}
          <MiracleSkeleton className="relative shrink-0 overflow-hidden rounded-full h-8 w-8"/>
          {/* Bubble */}
          <MiracleSkeleton className={cn("flex flex-col relative h-30 w-100 max-w-full p-3 rounded-md text-sm text-secondary whitespace-pre-wrap")}>
            {/* Arrow */}
            <MiracleSkeleton
              className={cn(
                "absolute z-1 h-2.5 w-2.5 rounded-none",
                arrowPositionClass,
                isAuthor ? "clip-triangle rotate-225" : "rotate-45"
              )}
            />
            {/* Content */}
          </MiracleSkeleton>
        </div>
        {/* footer */}
        <div className={cn(
          "flex items-center pl-11 mt-0.5",
          isAuthor ? "pr-11 flex-row-reverse" : "pl-11 flex-row",
          )}>
          <MiracleSkeleton className="w-5 h-5 rounded-full m-1"/>
          <MiracleSkeleton className="h-3 w-6"/>
        </div>
      </div>
    </div> 
  )
}
