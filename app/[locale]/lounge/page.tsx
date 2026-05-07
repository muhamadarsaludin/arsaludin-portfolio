import { constructMetadata } from "@/configs/metadata";
import LoungePage from "@/features/lounge/components/LoungePage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.lounge");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function Lounge({params}: BasePageProps) {
  return <LoungePage params={params}/>
}
