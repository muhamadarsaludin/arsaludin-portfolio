import ProfileSection from "./profile";
import ProjectSection from "./projects/ProjectSection";
import SkillsAndServicesSection from "./skills-and-services";

export default function HomePage() {
  return (
    <>
      <ProfileSection className="pb-16"/>
      <SkillsAndServicesSection className="pb-16"/>
      <ProjectSection className="pb-16"/>
    </>
  )
}
