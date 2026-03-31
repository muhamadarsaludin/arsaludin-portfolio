import { type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { updateSession } from "@/lib/supabase/proxy"

const handleI18nRouting = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)
  if (response.headers.get("location")) {
    return response
  }
  return await updateSession(request, response)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
