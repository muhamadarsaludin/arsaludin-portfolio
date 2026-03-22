import { getFeaturedProjects } from "../services/projects";
import ProfileSection from "./profile";

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()
  return (
    <>
      <ProfileSection/>
    </>
  )
}
