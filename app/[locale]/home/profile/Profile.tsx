import Section from "@/components/Section";
import Image from "next/image"
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfo from "./ProfileInfo";
import { useTranslations } from "next-intl";
import clsx from "clsx";

export default function Profile() {
  const t = useTranslations("pages.home.profile")
  return (
   <Section className="relative">
      <ProfileHero />
      <div className="-mt-10 lg:-mt-20 relative z-10 flex-col">
        <div className="flex gap-4 lg:gap-6 xl:gap-8">
          <div className={clsx(
            "shrink-0 relative rounded-4xl lg:rounded-[60px] overflow-hidden ml-4 lg:ml-6 xl:ml-8",
            "border-5 lg:border-10 border-primary",
            "w-30 lg:w-48 h-auto"
            )}>
            <Image
              className="absolute object-cover object-top"
              src="/profile.webp"
              alt="Muhamad Arsaludin"
              fill
            />
          </div>
          <div className="flex-1 flex flex-row gap-6 xl:gap-8 justify-between mt-10 lg:mt-20 pt-4 lg:pt-6 xl:pt-8">
            <ProfileInfo/>
            <ProfileStats className="hidden lg:block"/>
          </div>
        </div>
        <ProfileStats className="block lg:hidden mt-4"/>
        <p className="max-w-full md:max-w-9/12 mt-4 lg:mt-6 xl:mt-8">{t("about")}</p>
      </div>
      
   </Section>
  )
}
