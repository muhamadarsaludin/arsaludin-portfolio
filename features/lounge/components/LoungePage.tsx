import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getQueryClient } from "@/lib/query-client"
import { getTranslations } from "next-intl/server"
import type { Cursor } from "@/features/shared/types/index.types"
import Container from "@/components/Container"
import { routing } from "@/i18n/routing"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import Article from "@/components/Article"
import Heading from "@/components/Heading"
import type { MessageType } from "@/features/messages/types/messages.types"
import { MESSAGES_PAGE_SIZE } from "@/features/messages/constants/messages.constants"
import { getPaginatedMessages } from "@/features/messages/services/messages"
import LoungeContent from "./LoungeContent"
import { MiracleReveal } from "@/components/miracle/Reveal"

export default async function LoungePage() {
  const t = await getTranslations("pages.lounge")
  const queryClient = getQueryClient()
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

  const dehydratedState = dehydrate(queryClient)

  /**
   * HYDRATION FIX:
   * Manually "aging" server data by 20 minutes to remain consistent with
   * the cache settings used in Articles and Achievements page.
   */
  const TWENTY_MINUTES_IN_MS = 1000 * 60 * 20

  dehydratedState.queries.forEach((query) => {
    if (query.queryKey[0] === "messages") {
      query.state.dataUpdatedAt = query.state.dataUpdatedAt - TWENTY_MINUTES_IN_MS
    }
  })

  return (
    <Container>
      <Article className="pb-13 lg:pb-23">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              lounge: t("breadcrumbs.lounge"),
            }}
            className="mb-5 md:mb-6"
          />
          <div className="mb-6 w-full md:mb-8">
            <Heading id={t("title")} level={1} className="font-semibold">
              {t("title")}
            </Heading>
            <p className="text-secondary mt-4">{t("description")}</p>
          </div>
        </MiracleReveal>
        <HydrationBoundary state={dehydratedState}>
          <LoungeContent messageType={messageType} pageSize={MESSAGES_PAGE_SIZE} />
        </HydrationBoundary>
      </Article>
    </Container>
  )
}
