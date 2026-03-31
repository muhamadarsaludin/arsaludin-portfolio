import Section from "@/components/Section"
import ProfileHero from "./ProfileHero"
import ProfileStats from "./ProfileStats"
import ProfileInfo from "./ProfileInfo"
import { useTranslations } from "next-intl"
import ProfileImage from "./ProfileImage"
import clsx from "clsx"

export default function ProfileSection({ className }: { className?: string }) {
  const t = useTranslations("pages.home.profile")
  return (
    <Section className={clsx("relative", className)}>
      <ProfileHero />
      <div className="relative z-10 -mt-15 flex-col lg:-mt-20">
        <div className="flex flex-col gap-4 md:flex-row lg:gap-6 xl:gap-8">
          <ProfileImage className="ml-4 lg:ml-6 xl:ml-8" />
          <div className="mt-0 flex flex-1 flex-row justify-between gap-6 pt-0 md:mt-15 md:pt-4 lg:mt-20 lg:pt-6 xl:gap-8 xl:pt-8">
            <ProfileInfo className="shrink-0" />
            <ProfileStats className="hidden lg:block" />
          </div>
        </div>
        <ProfileStats className="mt-4 block lg:hidden" />
        <p className="text-secondary mt-6 max-w-full lg:mt-10 lg:max-w-7/12">{t("about")}</p>
      </div>
    </Section>
  )
}
