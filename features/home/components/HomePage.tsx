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
      <ProfileSection className="pb-13 lg:pb-16" />
      <SkillsAndServicesSection className="py-13 lg:py-16" />
      <ProjectsSection className="py-13 lg:py-16" />
      <ExperiencesSection className="py-13 lg:py-16" />
      <EducationsSection className="py-13 lg:py-16" />
      <AchievementsSection className="py-13 lg:py-16" />
      <TestimonialsSection className="py-13 lg:py-16" />
    </>
  )
}
