import Image from "next/image"
import clsx from "clsx";

type ProfileImageProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
};

export default function ProfileImage({className, ...props}: ProfileImageProps) {
  return (
    <div
      {...props}
      className={clsx(
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
        sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 180px"
        priority
      />
    </div>
  )
}
