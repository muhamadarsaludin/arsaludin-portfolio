import AchievementsPage from "@/features/achievements/components/AchievementsPage";

type AchievementsProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Achievements(props: AchievementsProps) {
  const searchParams = await props.searchParams;
  return <AchievementsPage searchParams={searchParams} />
}
