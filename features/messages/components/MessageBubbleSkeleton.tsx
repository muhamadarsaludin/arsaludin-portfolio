import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function MessageBubbleSkeleton({ isAuthor = false }: { isAuthor?: boolean }) {
  const arrowPositionClass = isAuthor ? "-right-[5px] bottom-3" : "-left-[5px] bottom-3"
  return (
    <div className={cn("relative flex w-full flex-col", isAuthor ? "items-end" : "items-start")}>
      <div
        className={cn(
          "group/message flex max-w-[90%] flex-col md:max-w-125 lg:max-w-140",
          isAuthor ? "items-end" : "items-start"
        )}
      >
        {/* Name */}
        <div className={cn("mb-1.5 flex items-center gap-2", isAuthor ? "pr-11" : "pl-11")}>
          <MiracleSkeleton className="h-3 w-30" />
        </div>
        {/* Body */}
        <div className={cn("flex items-end gap-3", isAuthor ? "flex-row-reverse" : "flex-row")}>
          {/* Avatar */}
          <MiracleSkeleton className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full" />
          {/* Bubble */}
          <MiracleSkeleton
            className={cn(
              "text-secondary relative flex h-30 w-100 max-w-full flex-col rounded-md p-3 text-sm whitespace-pre-wrap"
            )}
          >
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
        <div
          className={cn(
            "mt-0.5 flex items-center pl-11",
            isAuthor ? "flex-row-reverse pr-11" : "flex-row pl-11"
          )}
        >
          <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" />
          <MiracleSkeleton className="h-3 w-6" />
        </div>
      </div>
    </div>
  )
}
