export type BasePageProps = {
  params: Promise<{
    locale: string
    slug?: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type StaticPageProps = Omit<BasePageProps, "searchParams">