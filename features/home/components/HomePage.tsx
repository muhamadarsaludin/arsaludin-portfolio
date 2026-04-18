import AchievementsSection from "./achievements/AchievementsSection"
import EducationsSection from "./educations/EducationsSection"
import ExperiencesSection from "./experiences/ExperiencesSection"
import ProfileSection from "./profile/ProfileSection"
import ProjectsSection from "./projects/ProjectsSection"
import SkillsAndServicesSection from "./skills-and-services/SkillsAndServicesSection"
import TestimonialsSection from "./testimonials/TestimonialsSection"

export default function HomePage() {
  return (
    <>
      <ProfileSection className="pb-13 lg:pb-23" />
      <SkillsAndServicesSection className="py-13 lg:py-23" />
      <ProjectsSection className="py-13 lg:py-23" />
      <ExperiencesSection className="py-13 lg:py-23" />
      {/* <EducationsSection className="py-13 lg:py-23" />
      <AchievementsSection className="py-13 lg:py-23" />
      <TestimonialsSection className="py-13 lg:py-23" /> */}
    </>
  )
}
