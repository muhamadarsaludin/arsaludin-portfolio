import Image from "next/image"
import { LuImage } from "react-icons/lu"
import { EducationItem } from "../../types"

export default function EducationCard({
  name,
  logo,
  degree,
  field,
  gpa,
  description,
  images
}:EducationItem) {
  return (
    <div className="w-full bg-surface-secondary p-6 rounded-xl flex gap-6">
      {logo ? (
        <Image 
          className="rounded-lg shrink-0"
          src={logo}
          alt={name + "logo"}
          width={100}
          height={100}
        />
      ) : (
        <div className="w-25 h-25 flex items-center justify-center bg-neutral-300 dark:bg-neutral-700 rounded-lg shrink-0">
          <LuImage size={32} />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h4 className="text-lg lg:text-xl xl:text-2xl">{name}</h4>
        <p><span>{degree}</span> • <span>{field}</span> • {gpa && <span>GPA: {gpa}/4.00</span>}</p>
      </div>
    </div>
  )
}
