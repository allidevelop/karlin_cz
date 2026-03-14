import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except: api, admin, _next, static files
    '/((?!api|admin|_next|_vercel|images|fonts|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
}
