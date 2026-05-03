import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getTranslations } from 'next-intl/server'
import { Cursor } from '@/features/shared/types/index.types'
import Container from '@/components/Container'
import { routing } from '@/i18n/routing'
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs'
import Article from '@/components/Article'
import Heading from '@/components/Heading'
import ForumContent from './LoungeContent'
import { MessageType } from '@/features/messages/types/messages.types'
import { MESSAGES_PAGE_SIZE } from '@/features/messages/constants/messages.constants'
import { getPaginatedMessages } from '@/features/messages/services/messages'
import LoungeContent from './LoungeContent'

type LoungePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoungePage({params}: LoungePageProps) {
  const t = await getTranslations("pages.lounge")
  const queryClient = new QueryClient()
  const messageType: MessageType = "group"

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["messages", messageType, { pageSize: MESSAGES_PAGE_SIZE }],
    queryFn: ({ pageParam }) => 
      getPaginatedMessages({ 
        pageSize: MESSAGES_PAGE_SIZE,
        cursor: pageParam as Cursor | undefined,
      }),
    initialPageParam: undefined as Cursor | undefined,
  })

  const dehydratedState = dehydrate(queryClient);

  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === 'messages') {
      query.state.dataUpdatedAt = Date.now() - (1000 * 30);
    }
  });


  return (
    <Container>
      <Article className="pb-13 lg:pb-23">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            lounge: t("breadcrumbs.lounge")
          }}
          className="mb-5 md:mb-6"
        />
        <div className="mb-6 md:mb-8 w-full">
          <Heading 
            id={t("title")}
            level={1}
            className="font-semibold">
              {t("title")}
          </Heading>
          <p className="mt-4 text-secondary">{t("description")}</p>
        </div>
        <HydrationBoundary state={dehydratedState}>
          <LoungeContent messageType={messageType} pageSize={MESSAGES_PAGE_SIZE} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
