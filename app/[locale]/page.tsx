import { constructMetadata } from "@/configs/metadata";
import HomePage from "@/features/home/components/HomePage"
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.home");

  return constructMetadata({
    description: t("description"),
    locale: locale,
  });
}

export default function Home() {
  return <HomePage />
}
