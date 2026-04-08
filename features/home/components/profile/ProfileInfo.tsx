import Heading from "@/components/Heading"
import clsx from "clsx"
import { LuMapPin } from "react-icons/lu"

type ProfileInfoProps = {
  className?: string
}

export default function ProfileInfo({ className }: ProfileInfoProps) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <Heading 
        level={1} 
        noMarginTop 
        fontWeight="semibold"
        id="profile">
        Muhamad Arsaludin
      </Heading>
      <p className="text-blue font-medium text-lg md:text-xl lg:text-2xl">UX Engineer</p>
      <p className="text-secondary flex items-center gap-0.5">
        <LuMapPin />
        Tasikmalaya, Indonesia
      </p>
    </div>
  )
}
