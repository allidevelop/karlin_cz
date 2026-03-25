import type { GlobalConfig } from 'payload'

export const HomePageContent: GlobalConfig = {
  slug: 'home-page-content',
  label: { cs: 'Obsah hlavní stránky', en: 'Home page content', ru: 'Контент главной' },
  admin: {
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero sekce',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Automyčka Karlín' },
            { name: 'heroSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Ruční čištění disků' },
            { name: 'heroSubtitles', type: 'text', label: 'Rotující podnadpisy (oddělené |)', localized: true, admin: { description: 'Více podnadpisů pro animaci. Např: RUČNÍ ČIŠTĚNÍ | DETAILING | KERAMICKÁ OCHRANA' } },
            { name: 'heroCtaText', type: 'text', label: 'Text CTA tlačítka', localized: true, defaultValue: 'Rychlá Rezervace' },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Pozadí hero (fallback)', admin: { description: 'Záložní obrázek, pokud video není k dispozici. JPG/WebP, 1920×1080px' } },
            { name: 'heroVideoId', type: 'text', label: 'YouTube Video ID', admin: { description: 'ID videa z YouTube pro pozadí hero. Např: Q4SuUYmRnkk' } },
          ],
        },
        {
          label: 'Služby',
          fields: [
            { name: 'servicesTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Naše služby' },
            { name: 'servicesSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Vyberte si program pro vaše vozidlo' },
          ],
        },
        {
          label: 'Akce',
          fields: [
            { name: 'promotionsTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Exkluzivní akce' },
            { name: 'promotionsSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Využijte naše časově omezené nabídky' },
          ],
        },
        {
          label: 'Recenze',
          fields: [
            { name: 'reviewsTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Co říkají naši klienti' },
            { name: 'reviewsSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Přečtěte si recenze od skutečných zákazníků' },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            { name: 'faqTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Často kladené otázky' },
            { name: 'faqSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Odpovědi na nejčastější dotazy o našich službách' },
          ],
        },
        {
          label: 'Partneři',
          fields: [
            { name: 'partnersTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Naši partneři' },
            { name: 'partnersSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Spolupracujeme s prémiovými značkami' },
          ],
        },
        {
          label: 'Blog',
          fields: [
            { name: 'blogTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Blog' },
            { name: 'blogSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Tipy a novinky ze světa autopéče' },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            { name: 'newsletterTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Newsletter' },
            { name: 'newsletterSubtitle', type: 'text', label: 'Podnadpis', localized: true, defaultValue: 'Přihlaste se k odběru, abyste nepropásli důležité události!' },
          ],
        },
        {
          label: 'Kontaktní sekce',
          fields: [
            { name: 'contactTitle', type: 'text', label: 'Nadpis', localized: true, defaultValue: 'Kontakty' },
            { name: 'contactFormHeading', type: 'text', label: 'Nadpis formuláře', localized: true, defaultValue: 'Máte ještě něco na srdci?' },
            { name: 'contactFormSubheading', type: 'text', label: 'Podnadpis formuláře', localized: true, defaultValue: 'Hoďte nám zprávu přes formulář a my se hned ozveme!' },
          ],
        },
      ],
    },
  ],
}
