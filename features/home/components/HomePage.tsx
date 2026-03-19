import { getFeaturedProjects } from "../services/projects";
import { loginWithGoogle, logout } from '@/features/auth/services/authService';
import ProfileSection from "./profile";

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()
  return (
    <>
      <ProfileSection/>
    </>
  )
}
