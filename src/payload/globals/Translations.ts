import type { GlobalConfig } from 'payload'

export const Translations: GlobalConfig = {
  slug: 'translations',
  label: { cs: 'Překlady UI', en: 'UI Translations', ru: 'Переводы UI' },
  admin: {
    group: { cs: 'Nastavení', en: 'Settings', ru: 'Настройки' },
    description: 'Přepisování textů na webu z adminu. Prázdné pole = použije se výchozí text z JSON souborů.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroTitle', type: 'text', localized: true, label: 'Nadpis hero sekce' },
            { name: 'heroSubtitle', type: 'text', localized: true, label: 'Podnadpis hero sekce' },
            { name: 'heroCtaButton', type: 'text', localized: true, label: 'Text CTA tlačítka' },
            { name: 'heroNavigateButton', type: 'text', localized: true, label: 'Text tlačítka "Navigovat"' },
          ],
        },
        {
          label: 'Služby',
          fields: [
            { name: 'servicesTitle', type: 'text', localized: true, label: 'Nadpis sekce služeb' },
            { name: 'servicesSubtitle', type: 'text', localized: true, label: 'Podnadpis sekce služeb' },
            { name: 'servicesCtaButton', type: 'text', localized: true, label: 'Text CTA tlačítka' },
            { name: 'servicesChooseProgramButton', type: 'text', localized: true, label: 'Text tlačítka "Vybrat program"' },
            { name: 'servicesAllButton', type: 'text', localized: true, label: 'Text tlačítka "Všechny služby"' },
          ],
        },
        {
          label: 'Akce',
          fields: [
            { name: 'promotionsViewDetailButton', type: 'text', localized: true, label: 'Text tlačítka "Zobrazit detail"' },
            { name: 'promotionsAllButton', type: 'text', localized: true, label: 'Text tlačítka "Všechny akce"' },
            { name: 'promotionsBookWithPromoButton', type: 'text', localized: true, label: 'Text tlačítka "Rezervovat s akcí"' },
          ],
        },
        {
          label: 'Express Wash',
          fields: [
            { name: 'expressWashStartButton', type: 'text', localized: true, label: 'Text tlačítka "Začít"' },
          ],
        },
        {
          label: 'Blog',
          fields: [
            { name: 'blogReadAllButton', type: 'text', localized: true, label: 'Text tlačítka "Číst vše"' },
          ],
        },
        {
          label: 'Recenze',
          fields: [
            { name: 'reviewsLeaveReviewButton', type: 'text', localized: true, label: 'Text tlačítka "Napsat recenzi"' },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            { name: 'faqContactUsButton', type: 'text', localized: true, label: 'Text tlačítka "Kontaktujte nás"' },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            { name: 'newsletterSubscribeButton', type: 'text', localized: true, label: 'Text tlačítka "Odebírat"' },
          ],
        },
        {
          label: 'Rezervace',
          fields: [
            { name: 'bookingCtaButton', type: 'text', localized: true, label: 'Text CTA tlačítka rezervace' },
            { name: 'bookingStepVehicle', type: 'text', localized: true, label: 'Krok: Vozidlo' },
            { name: 'bookingStepProgram', type: 'text', localized: true, label: 'Krok: Program' },
            { name: 'bookingStepAddons', type: 'text', localized: true, label: 'Krok: Doplňky' },
            { name: 'bookingStepContact', type: 'text', localized: true, label: 'Krok: Kontakt' },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            { name: 'contactTitle', type: 'text', localized: true, label: 'Nadpis sekce kontaktů' },
            { name: 'contactSubtitle', type: 'text', localized: true, label: 'Podnadpis sekce kontaktů' },
            { name: 'contactSendButton', type: 'text', localized: true, label: 'Text tlačítka "Odeslat"' },
            { name: 'contactNavigateButton', type: 'text', localized: true, label: 'Text tlačítka "Navigovat"' },
          ],
        },
        {
          label: 'Obecné',
          fields: [
            { name: 'headerPhone', type: 'text', label: 'Telefonní číslo v hlavičce' },
            { name: 'footerCopyright', type: 'text', localized: true, label: 'Copyright text v patičce' },
            { name: 'bookNowButton', type: 'text', localized: true, label: 'Text tlačítka "Rezervace"' },
            { name: 'learnMoreButton', type: 'text', localized: true, label: 'Text tlačítka "Zjistit více"' },
            { name: 'notFoundBookButton', type: 'text', localized: true, label: 'Text tlačítka "Rezervovat" (nenašli jste)' },
            { name: 'notFoundCallButton', type: 'text', localized: true, label: 'Text tlačítka "Zavolejte nám" (nenašli jste)' },
          ],
        },
      ],
    },
  ],
}
