import { constructMetadata } from "@/configs/metadata";
import GearAndSetupPage from "@/features/gear-and-setup/components/GearAndSetupPage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.gear-and-setup");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function GearAndSetup({params}: BasePageProps) {
  return <GearAndSetupPage params={params}/>
}
