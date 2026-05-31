import { constructMetadata } from "@/configs/metadata";
import ArticlesPage from "@/features/articles/components/ArticlesPage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.articles");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default async function Articles({params, searchParams}: BasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ArticlesPage params={params} searchParams={searchParams} />
}