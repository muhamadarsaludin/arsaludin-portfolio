import Heading from '@/components/Heading'
import { LuMapPin } from 'react-icons/lu'

export default function ProfileInfo() {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <Heading className="font-bold" copyLink={false} level={2}>
        Muhamad Arsaludin
      </Heading>
      <p className="text-blue-400 text-2xl font-medium">UX Engineer</p>
      <p className="text-secondary flex gap-1 items-center"><LuMapPin/>Tasikmalaya, Indonesia</p>
    </div>
  )
}
