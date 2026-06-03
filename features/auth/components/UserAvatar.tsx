import type { Profile } from "@/features/profile/types/profiles.types"
import { getInitials } from "@/utils/initials"
import { cn } from "@/utils/class-name"
import Image from "next/image"

type AvatarSize = "sm" | "md" | "lg"

type UserAvatarProps = {
  user: Profile
  size?: AvatarSize
  className?: string
}

export default function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const initials = getInitials(user.full_name)
  const getAvatarSize: Record<AvatarSize, string> = {
    sm: "h-5 w-5 md:h-6 md:w-6",
    md: "h-6 w-6 md:h-8 md:w-8",
    lg: "h-8 w-8 md:h-10 md:w-10",
  }

  return (
    <div
      className={cn(
        "bg-blue text-primary-inv relative shrink-0 overflow-hidden rounded-full",
        getAvatarSize[size],
        className
      )}
    >
      {user.avatar_url ? (
        <Image
          src={user.avatar_url || "/dummy.webp"}
          alt={user.full_name}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-bold">
          {initials}
        </span>
      )}
    </div>
  )
}
