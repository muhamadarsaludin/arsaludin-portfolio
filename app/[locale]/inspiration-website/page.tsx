import { constructMetadata } from "@/configs/metadata";
import InspirationWebsitePage from "@/features/inspiration-website/components/InspirationWebsitePage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.inspiration-website");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default async function InspirationWebsite({params}: BasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InspirationWebsitePage params={params}/>
}
