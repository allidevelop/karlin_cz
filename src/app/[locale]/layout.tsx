import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import localFont from 'next/font/local'
import PopupBannerLoader from '@/components/shared/PopupBannerLoader'
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

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'cs' | 'en' | 'ru')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${clashDisplay.variable} bg-brand-black text-brand-white font-clash antialiased min-h-screen`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <PopupBannerLoader />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
