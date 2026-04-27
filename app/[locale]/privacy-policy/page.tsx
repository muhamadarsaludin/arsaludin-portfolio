import PrivacyPolicyPage from "@/features/privacy-policy/components/PrivacyPolicyPage";

type PrivacyPolicyProps = {
  params: Promise<{ locale: string }>;
};

export default function PrivacyPolicy({params}: PrivacyPolicyProps) {
  return <PrivacyPolicyPage params={params}/>
}
