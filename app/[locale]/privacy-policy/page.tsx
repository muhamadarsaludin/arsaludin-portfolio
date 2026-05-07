import { constructMetadata } from "@/configs/metadata";
import PrivacyPolicyPage from "@/features/privacy-policy/components/PrivacyPolicyPage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.privacy-policy");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function PrivacyPolicy({params}: BasePageProps) {
  return <PrivacyPolicyPage params={params}/>
}
