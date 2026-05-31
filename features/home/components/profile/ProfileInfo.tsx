import Heading from "@/components/Heading"
import { cn } from "@/utils/class-name"
import { LuMapPin } from "react-icons/lu"

type ProfileInfoProps = {
  className?: string
}

export default function ProfileInfo({ className }: ProfileInfoProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Heading level={1} noMarginTop fontWeight="semibold" id="profile">
        Muhamad Arsaludin
      </Heading>
      <p className="text-blue text-lg font-medium md:text-xl lg:text-2xl">UX Engineer</p>
      <p className="text-secondary flex items-center gap-0.5">
        <LuMapPin />
        Tasikmalaya, Indonesia
      </p>
    </div>
  )
}
