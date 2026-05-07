import { constructMetadata } from "@/configs/metadata";
import ChangelogPage from "@/features/changelog/components/ChangelogPage"
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.changelog");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function Changelog({params}: BasePageProps) {
  return <ChangelogPage params={params}/>
}
