import TechStackPage from "@/features/tech-stack/components/TechStackPage";

type TechStackProps = {
  params: Promise<{ locale: string }>;
};

export default function TechStack({params}: TechStackProps) {
  return <TechStackPage params={params}/>
}
