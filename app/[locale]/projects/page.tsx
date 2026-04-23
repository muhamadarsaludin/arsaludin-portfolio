import ProjectsPage from "@/features/projects/components/ProjectsPage";

type ProjectsProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Projects({params, searchParams}: ProjectsProps) {
  // const { locale } = await props.params
  // const searchParams = await props.searchParams;
  return <ProjectsPage params={params} searchParams={searchParams} />
}
