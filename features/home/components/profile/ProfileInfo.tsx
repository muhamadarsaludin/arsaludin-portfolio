import clsx from "clsx"
import { LuMapPin } from "react-icons/lu"

type ProfileInfoProps = {
  className?: string
}

export default function ProfileInfo({ className }: ProfileInfoProps) {
  return (
    <div className={clsx("flex flex-col gap-0.5 md:gap-1", className)}>
      <h1 className="text-3xl font-bold md:text-4xl xl:text-5xl">Muhamad Arsaludin</h1>
      <p className="text-xl font-medium md:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400">UX Engineer</p>
      <p className="text-secondary flex items-center gap-1">
        <LuMapPin />
        Tasikmalaya, Indonesia
      </p>
    </div>
  )
}
