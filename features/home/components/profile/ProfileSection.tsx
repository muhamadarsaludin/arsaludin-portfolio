import Section from "@/components/Section";
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfo from "./ProfileInfo";
import { useTranslations } from "next-intl";
import ProfileImage from "./ProfileImage";

export default function ProfileSection() {
  const t = useTranslations("pages.home.profile")
  return (
   <Section className="relative">
      <ProfileHero/>
      <div
        className="-mt-15 lg:-mt-20 relative z-10 flex-col">
        <div 
          className="flex flex-col md:flex-row gap-4 lg:gap-6 xl:gap-8">
          <ProfileImage className="ml-4 lg:ml-6 xl:ml-8"/>
          <div 
            className="flex-1 flex flex-row gap-6 xl:gap-8 justify-between mt-0 md:mt-15 lg:mt-20 pt-0 md:pt-4 lg:pt-6 xl:pt-8">
            <ProfileInfo className="shrink-0"/>
            <ProfileStats className="hidden lg:block"/>
          </div>
        </div>
        <ProfileStats className="block lg:hidden mt-4"/>
        <p className="max-w-full lg:max-w-7/12 mt-6 lg:mt-8 text-secondary">{t("about")}</p>
      </div>
   </Section>
  )
}
