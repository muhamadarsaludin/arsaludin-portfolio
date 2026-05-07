import { constructMetadata } from "@/configs/metadata";
import ProjectsPage from "@/features/projects/components/ProjectsPage";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.projects");

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });
}

export default async function Projects({params, searchParams}: BasePageProps) {
  return <ProjectsPage params={params} searchParams={searchParams} />
}
