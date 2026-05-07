import { constructMetadata } from "@/configs/metadata";
import RoadmapPage from "@/features/roadmap/components/RoadmapPage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.roadmap");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default function Roadmap({params, searchParams}: BasePageProps) {
  return <RoadmapPage params={params} searchParams={searchParams}/>
}
