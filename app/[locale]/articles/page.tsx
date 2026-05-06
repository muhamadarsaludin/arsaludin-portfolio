import ArticlesPage from "@/features/articles/components/ArticlesPage";

type ArticlesProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Articles({params, searchParams}: ArticlesProps) {
  // const { locale } = await props.params
  // const searchParams = await props.searchParams;
  return <ArticlesPage params={params} searchParams={searchParams} />
}
