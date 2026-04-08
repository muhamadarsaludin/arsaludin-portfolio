import ProfileSection from "./profile/ProfileSection"
import ProjectSection from "./projects/ProjectSection"
import SkillsAndServicesSection from "./skills-and-services/SkillsAndServicesSection"

export default function HomePage() {
  return (
    <>
      <ProfileSection className="pb-15 lg:pb-18" />
      <SkillsAndServicesSection className="py-15 lg:py-18" />
      <ProjectSection className="py-15 lg:py-18" />
    </>
  )
}
