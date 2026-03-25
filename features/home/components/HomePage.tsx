import ProfileSection from "./profile";
import SkillsAndServicesSection from "./skills-and-services/SkillsAndServicesSection";

export default async function HomePage() {
  return (
    <>
      <ProfileSection/>
      <SkillsAndServicesSection/>
    </>
  )
}
