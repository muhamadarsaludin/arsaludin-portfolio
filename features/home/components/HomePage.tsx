import ProfileSection from "./profile";
import EducationSection from "./education";
import { getEducations } from "../services";

export default async function HomePage() {
  const educations = await getEducations()
  return (
    <>
      <ProfileSection/>
      <EducationSection items={educations} />
    </>
  )
}
