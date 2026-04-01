import { ReactionSummary } from "../../types/reactions"
import clsx from "clsx"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge from "@/components/miracle/Badge"

type ReactionsPreviewProps = {
  reactionSummary: ReactionSummary
}

export default function ReactionsPreview ({reactionSummary}: ReactionsPreviewProps) {
  const zIndex = 10

  if (reactionSummary.total <= 0) return

  return (
    <MiracleTooltip
      trigger={
        <div className="relative z-20 flex cursor-help items-center -space-x-2">
          {reactionSummary.top.map((reaction, index) => (
            <div
              key={index}
              className={clsx(
                "bg-surface-secondary flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm",
                reaction.emoji === reactionSummary.userReaction?.emoji ? "border-blue-400 dark:border-blue-500" : "border-primary",
              )}
              style={{ zIndex: zIndex + index }}
            >
              <span className="text-xs">{reaction.emoji}</span>
            </div>
          ))}
          {reactionSummary.remaining > 0 &&
            <div className="bg-surface-secondary border-primary z-13 flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1 shadow-sm">
              <span className="text-secondary text-xs font-medium">
                +{reactionSummary.remaining}
              </span>
            </div>
          }
        </div>
      }
      noPadding
      hoverContent
    >
      <div className="flex max-w-[150px] cursor-help flex-wrap gap-1 p-2">
        {reactionSummary.all.map((reaction, index) => (
          <MiracleBadge 
            key={index} 
            className={clsx(
              "h-7.5",
              reaction.emoji === reactionSummary.userReaction?.emoji && "border-2 border-blue-400 dark:border-blue-500"
            )}
            // startIcon={reaction.emoji}
            >
            {reaction.emoji} {reaction.count}
          </MiracleBadge>
        ))}
      </div>
    </MiracleTooltip>
  )
}
