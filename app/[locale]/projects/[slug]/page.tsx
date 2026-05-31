import { constructMetadata } from "@/configs/metadata";
import ProjectDetailPage from "@/features/projects/components/ProjectDetailPage";
import { getProject } from "@/features/projects/services/projects";
import { BasePageProps } from "@/types/page.types";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject({ slug, locale });
  const t = await getTranslations("pages.project-detail");

  if (!slug || !project) return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  });

  return constructMetadata({
    title: project.name,
    description: project.description,
    locale: locale,
  });
}

export default async function ProjectDetail({ params, searchParams }: BasePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectDetailPage params={params} searchParams={searchParams} />;
}