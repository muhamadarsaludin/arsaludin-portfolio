import ChangelogPage from "@/features/changelog/components/ChangelogPage"

type ChangelogProps = {
  params: Promise<{ locale: string }>;
};

export default function Changelog({params}: ChangelogProps) {
  return <ChangelogPage params={params}/>
}
