import { constructMetadata } from "@/configs/metadata";
import InspirationWebsitePage from "@/features/inspiration-website/components/InspirationWebsitePage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.inspiration-website");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function InspirationWebsite({params}: BasePageProps) {
  return <InspirationWebsitePage params={params}/>
}
