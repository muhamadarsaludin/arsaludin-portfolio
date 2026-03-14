import Image from "next/image"
import clsx from "clsx";

type ProfileImageProps = {
  className?: string
}

export default function ProfileImage({className}: ProfileImageProps) {
  return (
    <div className={clsx(
      "relative rounded-4xl lg:rounded-[60px] overflow-hidden",
      "border-4 lg:border-6 xl:border-8 border-primary",
      "w-30 md:40 lg:w-45 aspect-5/6",
      className
      )}>
      <Image
        className="absolute object-cover object-top"
        src="/profile/profile.webp"
        alt="Muhamad Arsaludin"
        fill
      />
    </div>
  )
}
