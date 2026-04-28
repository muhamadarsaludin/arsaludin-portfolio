import InspirationWebsitePage from "@/features/inspiration-website/components/InspirationWebsitePage";

type InspirationWebsiteProps = {
  params: Promise<{ locale: string }>;
};

export default function InspirationWebsite({params}: InspirationWebsiteProps) {
  return <InspirationWebsitePage params={params}/>
}
