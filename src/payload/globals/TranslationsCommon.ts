import type { GlobalConfig } from 'payload'

/**
 * Mapping from Payload field names to JSON translation paths.
 * Used to sync CMS overrides with next-intl JSON files.
 */
export const COMMON_FIELD_MAP: Record<string, string> = {
  // common.*
  commonCurrency: 'common.currency',
  commonPriceFrom: 'common.priceFrom',
  commonPricesFrom: 'common.pricesFrom',
  commonLoading: 'common.loading',
  commonBack: 'common.back',
  commonContinue: 'common.continue',
  commonLearnMore: 'common.learnMore',
  commonBookNow: 'common.bookNow',
  commonPhone: 'common.phone',
  commonEmail: 'common.email',
  commonAddress: 'common.address',
  commonBrandName: 'common.brandName',
  commonNavigate: 'common.navigate',
  commonSubmit: 'common.submit',
  commonApply: 'common.apply',
  commonClose: 'common.close',
  commonMinRead: 'common.minRead',
  commonAllServices: 'common.allServices',

  // navigation.*
  navigationBooking: 'navigation.booking',
  navigationServices: 'navigation.services',
  navigationPromotions: 'navigation.promotions',
  navigationForBusiness: 'navigation.forBusiness',
  navigationReviews: 'navigation.reviews',
  navigationBlog: 'navigation.blog',
  navigationContact: 'navigation.contact',
  navigationServiceMenuToGo: 'navigation.serviceMenu.toGo',
  navigationServiceMenuToGlow: 'navigation.serviceMenu.toGlow',
  navigationServiceMenuToWow: 'navigation.serviceMenu.toWow',
  navigationServiceMenuPremiumDetailing: 'navigation.serviceMenu.premiumDetailing',
  navigationServiceMenuAllServices: 'navigation.serviceMenu.allServices',

  // header.*
  headerLogoAlt: 'header.logoAlt',
  headerChangeLanguage: 'header.changeLanguage',
  headerCzech: 'header.czech',
  headerEnglish: 'header.english',
  headerCallPhone: 'header.callPhone',
  headerOpenMenu: 'header.openMenu',
  headerRussian: 'header.russian',

  // footer.*
  footerDescription: 'footer.description',
  footerQuickLinks: 'footer.quickLinks',
  footerServicesHeading: 'footer.servicesHeading',
  footerContactHeading: 'footer.contactHeading',
  footerWorkingHoursHeading: 'footer.workingHoursHeading',
  footerWorkingHours: 'footer.workingHours',
  footerCopyright: 'footer.copyright',
  footerPrivacyPolicy: 'footer.privacyPolicy',
  footerTermsOfService: 'footer.termsOfService',

  // contactForm.* (form-level messages)
  contactFormSending: 'contactForm.sending',
  contactFormSuccess: 'contactForm.success',
  contactFormErrorRequired: 'contactForm.errorRequired',
  contactFormErrorGeneric: 'contactForm.errorGeneric',

  // newsletterForm.*
  newsletterFormSubscribing: 'newsletterForm.subscribing',
  newsletterFormSuccess: 'newsletterForm.success',
  newsletterFormAlreadySubscribed: 'newsletterForm.alreadySubscribed',
  newsletterFormErrorInvalid: 'newsletterForm.errorInvalid',
  newsletterFormErrorGeneric: 'newsletterForm.errorGeneric',

  // notFoundCTA.*
  notFoundCTAHeading: 'notFoundCTA.heading',
  notFoundCTASubtitle: 'notFoundCTA.subtitle',
  notFoundCTABookNow: 'notFoundCTA.bookNow',
  notFoundCTACallUs: 'notFoundCTA.callUs',
}

export const TranslationsCommon: GlobalConfig = {
  slug: 'translations-common',
  label: { cs: 'Obecné překlady', en: 'Common Translations', ru: 'Общие переводы' },
  admin: {
    group: { cs: 'Překlady', en: 'Translations', ru: 'Переводы' },
    description: 'Obecné texty webu: navigace, hlavička, patička, formuláře, 404. Prázdné pole = výchozí text z JSON.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ── Tab: Obecné (common.*) ──
        {
          label: 'Obecné',
          fields: [
            { name: 'commonCurrency', type: 'text', localized: true, label: 'Měna (common.currency)' },
            { name: 'commonPriceFrom', type: 'text', localized: true, label: '"od" (common.priceFrom)' },
            { name: 'commonPricesFrom', type: 'text', localized: true, label: '"ceny od" (common.pricesFrom)' },
            { name: 'commonLoading', type: 'text', localized: true, label: 'Načítání (common.loading)' },
            { name: 'commonBack', type: 'text', localized: true, label: 'Zpět (common.back)' },
            { name: 'commonContinue', type: 'text', localized: true, label: 'Pokračovat (common.continue)' },
            { name: 'commonLearnMore', type: 'text', localized: true, label: 'Zjistit více (common.learnMore)' },
            { name: 'commonBookNow', type: 'text', localized: true, label: 'Rezervace (common.bookNow)' },
            { name: 'commonPhone', type: 'text', localized: true, label: 'Telefon (common.phone)' },
            { name: 'commonEmail', type: 'text', localized: true, label: 'Email (common.email)' },
            { name: 'commonAddress', type: 'text', localized: true, label: 'Adresa (common.address)' },
            { name: 'commonBrandName', type: 'text', localized: true, label: 'Název značky (common.brandName)' },
            { name: 'commonNavigate', type: 'text', localized: true, label: 'Navigovat (common.navigate)' },
            { name: 'commonSubmit', type: 'text', localized: true, label: 'Odeslat (common.submit)' },
            { name: 'commonApply', type: 'text', localized: true, label: 'Použít (common.apply)' },
            { name: 'commonClose', type: 'text', localized: true, label: 'Zavřít (common.close)' },
            { name: 'commonMinRead', type: 'text', localized: true, label: 'min čtení (common.minRead)' },
            { name: 'commonAllServices', type: 'text', localized: true, label: 'Všechny služby (common.allServices)' },
          ],
        },
        // ── Tab: Navigace (navigation.*) ──
        {
          label: 'Navigace',
          fields: [
            { name: 'navigationBooking', type: 'text', localized: true, label: 'Rezervace (navigation.booking)' },
            { name: 'navigationServices', type: 'text', localized: true, label: 'Služby (navigation.services)' },
            { name: 'navigationPromotions', type: 'text', localized: true, label: 'Akce (navigation.promotions)' },
            { name: 'navigationForBusiness', type: 'text', localized: true, label: 'Pro firmy (navigation.forBusiness)' },
            { name: 'navigationReviews', type: 'text', localized: true, label: 'Recenze (navigation.reviews)' },
            { name: 'navigationBlog', type: 'text', localized: true, label: 'Blog (navigation.blog)' },
            { name: 'navigationContact', type: 'text', localized: true, label: 'Kontakt (navigation.contact)' },
            { name: 'navigationServiceMenuToGo', type: 'text', localized: true, label: 'To Go (navigation.serviceMenu.toGo)' },
            { name: 'navigationServiceMenuToGlow', type: 'text', localized: true, label: 'To Glow (navigation.serviceMenu.toGlow)' },
            { name: 'navigationServiceMenuToWow', type: 'text', localized: true, label: 'To Wow (navigation.serviceMenu.toWow)' },
            { name: 'navigationServiceMenuPremiumDetailing', type: 'text', localized: true, label: 'Premium Detailing (navigation.serviceMenu.premiumDetailing)' },
            { name: 'navigationServiceMenuAllServices', type: 'text', localized: true, label: 'Všechny služby (navigation.serviceMenu.allServices)' },
          ],
        },
        // ── Tab: Hlavička (header.*) ──
        {
          label: 'Hlavička',
          fields: [
            { name: 'headerLogoAlt', type: 'text', localized: true, label: 'Alt text loga (header.logoAlt)' },
            { name: 'headerChangeLanguage', type: 'text', localized: true, label: 'Změnit jazyk (header.changeLanguage)' },
            { name: 'headerCzech', type: 'text', localized: true, label: 'Čeština (header.czech)' },
            { name: 'headerEnglish', type: 'text', localized: true, label: 'English (header.english)' },
            { name: 'headerCallPhone', type: 'text', localized: true, label: 'Zavolat {phone} (header.callPhone)' },
            { name: 'headerOpenMenu', type: 'text', localized: true, label: 'Otevřít menu (header.openMenu)' },
            { name: 'headerRussian', type: 'text', localized: true, label: 'Русский (header.russian)' },
          ],
        },
        // ── Tab: Patička (footer.*) ──
        {
          label: 'Patička',
          fields: [
            { name: 'footerDescription', type: 'textarea', localized: true, label: 'Popis v patičce (footer.description)' },
            { name: 'footerQuickLinks', type: 'text', localized: true, label: 'Rychlé odkazy (footer.quickLinks)' },
            { name: 'footerServicesHeading', type: 'text', localized: true, label: 'Služby — nadpis (footer.servicesHeading)' },
            { name: 'footerContactHeading', type: 'text', localized: true, label: 'Kontakt — nadpis (footer.contactHeading)' },
            { name: 'footerWorkingHoursHeading', type: 'text', localized: true, label: 'Pracovní doba — nadpis (footer.workingHoursHeading)' },
            { name: 'footerWorkingHours', type: 'text', localized: true, label: 'Pracovní doba (footer.workingHours)' },
            { name: 'footerCopyright', type: 'text', localized: true, label: 'Copyright (footer.copyright)' },
            { name: 'footerPrivacyPolicy', type: 'text', localized: true, label: 'Ochrana osobních údajů (footer.privacyPolicy)' },
            { name: 'footerTermsOfService', type: 'text', localized: true, label: 'Obchodní podmínky (footer.termsOfService)' },
          ],
        },
        // ── Tab: Formuláře (contactForm.*, newsletterForm.*) ──
        {
          label: 'Formuláře',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  type: 'group',
                  name: 'contactFormGroup',
                  label: 'Kontaktní formulář',
                  admin: { hideGutter: true },
                  fields: [
                    { name: 'contactFormSending', type: 'text', localized: true, label: 'Odesílání... (contactForm.sending)' },
                    { name: 'contactFormSuccess', type: 'textarea', localized: true, label: 'Úspěch (contactForm.success)' },
                    { name: 'contactFormErrorRequired', type: 'text', localized: true, label: 'Chyba: povinná pole (contactForm.errorRequired)' },
                    { name: 'contactFormErrorGeneric', type: 'text', localized: true, label: 'Chyba: obecná (contactForm.errorGeneric)' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  type: 'group',
                  name: 'newsletterFormGroup',
                  label: 'Newsletter formulář',
                  admin: { hideGutter: true },
                  fields: [
                    { name: 'newsletterFormSubscribing', type: 'text', localized: true, label: 'Přihlašování... (newsletterForm.subscribing)' },
                    { name: 'newsletterFormSuccess', type: 'text', localized: true, label: 'Úspěch (newsletterForm.success)' },
                    { name: 'newsletterFormAlreadySubscribed', type: 'text', localized: true, label: 'Již přihlášen (newsletterForm.alreadySubscribed)' },
                    { name: 'newsletterFormErrorInvalid', type: 'text', localized: true, label: 'Chyba: neplatný email (newsletterForm.errorInvalid)' },
                    { name: 'newsletterFormErrorGeneric', type: 'text', localized: true, label: 'Chyba: obecná (newsletterForm.errorGeneric)' },
                  ],
                },
              ],
            },
          ],
        },
        // ── Tab: 404 (notFoundCTA.*) ──
        {
          label: '404',
          fields: [
            { name: 'notFoundCTAHeading', type: 'text', localized: true, label: 'Nadpis (notFoundCTA.heading)' },
            { name: 'notFoundCTASubtitle', type: 'text', localized: true, label: 'Podnadpis (notFoundCTA.subtitle)' },
            { name: 'notFoundCTABookNow', type: 'text', localized: true, label: 'Tlačítko rezervace (notFoundCTA.bookNow)' },
            { name: 'notFoundCTACallUs', type: 'text', localized: true, label: 'Tlačítko zavolat (notFoundCTA.callUs)' },
          ],
        },
      ],
    },
  ],
}
