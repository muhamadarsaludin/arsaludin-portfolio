import Section from "@/components/Section";
import Image from "next/image"
import ProfileHero from "./ProfileHero";
import ProfileStats from "./ProfileStats";
import ProfileInfo from "./ProfileInfo";

export default function Profile() {
  return (
   <Section className="relative">
      <ProfileHero />
      <div className="relative flex gap-8 items-start -mt-20">
        <div className="shrink-0 relative w-55 h-60 rounded-[60px] overflow-hidden z-10 ml-8 border-10 border-primary">
          <Image
            className="absolute object-cover object-top"
            src="/profile.png"
            alt="Muhamad Arsaludin"
            fill
          />
        </div>

        <div className="flex-1 flex justify-between items-end gap-4 mt-20 pt-6">
          <ProfileInfo/>
          <div className="flex">
            <ProfileStats/>
          </div>
        </div>
      </div>
   </Section>
  )
}
