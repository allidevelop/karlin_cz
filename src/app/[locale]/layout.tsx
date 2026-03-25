import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import localFont from 'next/font/local'
import { Montserrat } from 'next/font/google'
import PopupBannerLoader from '@/components/shared/PopupBannerLoader'
import { getCmsMessages } from '@/lib/payload'
import { deepMerge } from '@/lib/cms-messages'
import '@/app/globals.css'

const clashDisplay = localFont({
  src: [
    { path: '../../../public/fonts/clash-display/ClashDisplay-Regular.woff', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/clash-display/ClashDisplay-Medium.woff', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/clash-display/ClashDisplay-Semibold.woff', weight: '600', style: 'normal' },
    { path: '../../../public/fonts/clash-display/ClashDisplay-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'cs' | 'en' | 'ru')) {
    notFound()
  }

  // 1. Get static JSON messages (next-intl)
  const jsonMessages = await getMessages()

  // 2. Get CMS override messages (Payload globals)
  const cmsMessages = await getCmsMessages(locale)

  // 3. Merge: CMS values override JSON defaults (empty CMS fields are ignored)
  const messages = deepMerge(
    jsonMessages as Record<string, unknown>,
    cmsMessages,
  )

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body className={`${clashDisplay.variable} ${montserrat.variable} bg-brand-black text-brand-white font-clash antialiased min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <PopupBannerLoader />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
