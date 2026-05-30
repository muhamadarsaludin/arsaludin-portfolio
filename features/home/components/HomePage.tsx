import Container from "@/components/Container"
import Article from "@/components/Article"
import ProfileSection from "./profile/ProfileSection"
import SkillsAndServicesSection from "./skills-and-services/SkillsAndServicesSection"
import ProjectsSection from "./projects/ProjectsSection"
import ExperiencesSection from "./experiences/ExperiencesSection"
import EducationsSection from "./educations/EducationsSection"
import AchievementsSection from "./achievements/AchievementsSection"
import TestimonialsSection from "./testimonials/TestimonialsSection"

export default function HomePage() {
  return (
    <Container>
      <Article>
        <ProfileSection className="pb-13 lg:pb-23" />
        <SkillsAndServicesSection className="py-13 lg:py-23" />
        <ProjectsSection className="py-13 lg:py-23" />
        <ExperiencesSection className="py-13 lg:py-23" />
        <EducationsSection className="py-13 lg:py-23" />
        <AchievementsSection className="py-13 lg:py-23" />
        {/* <TestimonialsSection className="py-13 lg:py-23" /> */}
      </Article>
    </Container>
  )
}
