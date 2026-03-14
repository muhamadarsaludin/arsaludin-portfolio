import clsx from 'clsx'
import { LuMapPin } from 'react-icons/lu'

type ProfileInfoProps = {
  className?: string
}

export default function ProfileInfo({className}: ProfileInfoProps) {
  return (
    <div className={clsx("flex flex-col gap-0.5 md:gap-1", className)}>
      <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold">
        Muhamad Arsaludin
      </h1>
      <p className="text-blue-400 text-xl md:text-2xl lg:text-3xl font-medium">UX Engineer</p>
      <p className="text-secondary flex gap-1 items-center"><LuMapPin/>Tasikmalaya, Indonesia</p>
    </div>
  )
}
