import Heading from '@/components/Heading'
import clsx from 'clsx'
import { LuMapPin } from 'react-icons/lu'

type ProfileInfoProps = {
  className?: string
}

export default function ProfileInfo({className}: ProfileInfoProps) {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold">
        Muhamad Arsaludin
      </h1>
      <p className="text-blue-400 text-xl lg:text-2xl font-medium">UX Engineer</p>
      <p className="text-secondary flex gap-1 items-center"><LuMapPin/>Tasikmalaya, Indonesia</p>
    </div>
  )
}
