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
      <ProfileSection className="pb-15 lg:pb-18" />
      <SkillsAndServicesSection className="py-15 lg:py-18" />
      <ProjectsSection className="py-15 lg:py-18" />
      <ExperiencesSection className="py-15 lg:py-18" />
      <EducationsSection className="py-15 lg:py-18" />
      <AchievementsSection className="py-15 lg:py-18" />
      <TestimonialsSection className="py-15 lg:py-18" />
    </>
  )
}
