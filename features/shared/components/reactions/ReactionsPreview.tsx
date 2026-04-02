import { ReactionSummary } from "../../types/reactions"
import clsx from "clsx"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge from "@/components/miracle/Badge"

type ReactionsPreviewProps = {
  reactionSummary: ReactionSummary
  onSelectReaction: (emoji: string) => void
}

export default function ReactionsPreview({
  reactionSummary,
  onSelectReaction,
}: ReactionsPreviewProps) {
  const zIndex = 10

  if (reactionSummary.total <= 0) return

  return (
    <MiracleTooltip
      trigger={
        <div className="relative z-20 flex cursor-pointer items-center -space-x-2">
          {reactionSummary.top.map((reaction, index) => (
            <button
              key={index}
              className={clsx(
                "group/reaction-picker",
                "bg-surface-secondary flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 shadow-sm",
                reaction.emoji === reactionSummary.userReaction?.emoji
                  ? "border-blue-400 dark:border-blue-500"
                  : "border-primary"
              )}
              style={{ zIndex: zIndex + index }}
              onClick={() => onSelectReaction(reaction.emoji)}
            >
              <span className="text-xs transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-120">
                {reaction.emoji}
              </span>
            </button>
          ))}
          {reactionSummary.remaining > 0 && (
            <div className="bg-surface-secondary border-primary z-13 flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1 shadow-sm">
              <span className="text-secondary text-xs font-medium">
                +{reactionSummary.remaining}
              </span>
            </div>
          )}
        </div>
      }
      noPadding
      hoverContent
    >
      <div className="flex max-h-[200px] max-w-[150px] cursor-pointer flex-wrap gap-1 overflow-y-auto p-2">
        {reactionSummary.all.map((reaction, index) => (
          <MiracleBadge
            key={index}
            className={clsx(
              "h-7.5",
              reaction.emoji === reactionSummary.userReaction?.emoji &&
                "border-2 border-blue-400 dark:border-blue-500"
            )}
            onClick={() => onSelectReaction(reaction.emoji)}
          >
            {reaction.emoji} {reaction.count}
          </MiracleBadge>
        ))}
      </div>
    </MiracleTooltip>
  )
}
