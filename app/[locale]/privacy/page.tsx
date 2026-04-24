import PrivacyPage from "@/features/privacy/components/PrivacyPage"

type PrivacyProps = {
  params: Promise<{ locale: string }>;
};

export default function Privacy({params}: PrivacyProps) {
  return <PrivacyPage params={params}/>
}
