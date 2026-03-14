import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['cs', 'en', 'ru'],
  defaultLocale: 'cs',
  localePrefix: 'as-needed',
})
