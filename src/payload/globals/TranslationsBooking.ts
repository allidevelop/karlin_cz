import type { GlobalConfig } from 'payload'

/**
 * Mapping: Payload field name → JSON dot-path in messages/{locale}.json
 */
export const BOOKING_FIELD_MAP: Record<string, string> = {
  // Hero
  heroTitle: 'booking.heroTitle',

  // Steps
  stepsVehicleLabel: 'booking.steps.vehicle.label',
  stepsVehicleShort: 'booking.steps.vehicle.short',
  stepsVehicleSubtitle: 'booking.steps.vehicle.subtitle',
  stepsProgramLabel: 'booking.steps.program.label',
  stepsProgramShort: 'booking.steps.program.short',
  stepsProgramSubtitle: 'booking.steps.program.subtitle',
  stepsAddonsLabel: 'booking.steps.addons.label',
  stepsAddonsShort: 'booking.steps.addons.short',
  stepsAddonsSubtitle: 'booking.steps.addons.subtitle',
  stepsDatetimeLabel: 'booking.steps.datetime.label',
  stepsDatetimeShort: 'booking.steps.datetime.short',
  stepsDatetimeSubtitle: 'booking.steps.datetime.subtitle',
  stepsContactLabel: 'booking.steps.contact.label',
  stepsContactShort: 'booking.steps.contact.short',
  stepsContactSubtitle: 'booking.steps.contact.subtitle',

  // Vehicle
  vehicleTitle: 'booking.vehicle.title',
  vehicleSubtitle: 'booking.vehicle.subtitle',

  // Program
  programTitle: 'booking.program.title',
  programSubtitle: 'booking.program.subtitle',
  programChangeCategory: 'booking.program.changeCategory',
  programWhatsIncluded: 'booking.program.whatsIncluded',
  programHide: 'booking.program.hide',
  programAdd: 'booking.program.add',
  programRemove: 'booking.program.remove',
  programCart: 'booking.program.cart',
  programEmptyCart: 'booking.program.emptyCart',
  programPromoLabel: 'booking.program.promoLabel',
  programPromoPlaceholder: 'booking.program.promoPlaceholder',
  programTotal: 'booking.program.total',
  programBackToVehicle: 'booking.program.backToVehicle',
  programProgramBadge: 'booking.program.programBadge',
  programMostPopular: 'booking.program.mostPopular',
  programDuration: 'booking.program.duration',

  // Addons
  addonsTitle: 'booking.addons.title',
  addonsSubtitle: 'booking.addons.subtitle',
  addonsContinueWithout: 'booking.addons.continueWithout',
  addonsCartTitle: 'booking.addons.cartTitle',
  addonsEmptyCart: 'booking.addons.emptyCart',
  addonsPromoPlaceholder: 'booking.addons.promoPlaceholder',
  addonsSelectDate: 'booking.addons.selectDate',
  addonsAddonCount1: 'booking.addons.addonCount1',
  addonsAddonCount2to4: 'booking.addons.addonCount2to4',
  addonsAddonCount5plus: 'booking.addons.addonCount5plus',
  addonsSkipToAddons: 'booking.addons.skipToAddons',
  addonsAddonOnlyMode: 'booking.addons.addonOnlyMode',
  addonsCategoryInterior: 'booking.addons.categoryInterior',
  addonsCategoryExterior: 'booking.addons.categoryExterior',
  addonsCategoryProtection: 'booking.addons.categoryProtection',

  // Cart
  cartDiscount: 'booking.cart.discount',
  cartPromoInvalid: 'booking.cart.promoInvalid',
  cartPromoExpired: 'booking.cart.promoExpired',
  cartPromoUsedUp: 'booking.cart.promoUsedUp',
  cartTimeMorning: 'booking.cart.timeMorning',
  cartTimeAfternoon: 'booking.cart.timeAfternoon',
  cartTimeEvening: 'booking.cart.timeEvening',
  cartPromoBadge: 'booking.cart.promoBadge',

  // Contact Form
  contactFormTitle: 'booking.contactForm.title',
  contactFormNameLabel: 'booking.contactForm.nameLabel',
  contactFormNamePlaceholder: 'booking.contactForm.namePlaceholder',
  contactFormPhoneLabel: 'booking.contactForm.phoneLabel',
  contactFormPhonePlaceholder: 'booking.contactForm.phonePlaceholder',
  contactFormEmailLabel: 'booking.contactForm.emailLabel',
  contactFormEmailPlaceholder: 'booking.contactForm.emailPlaceholder',
  contactFormPromoLabel: 'booking.contactForm.promoLabel',
  contactFormCommentLabel: 'booking.contactForm.commentLabel',
  contactFormCommentPlaceholder: 'booking.contactForm.commentPlaceholder',
  contactFormReminderLabel: 'booking.contactForm.reminderLabel',
  contactFormReminder1h: 'booking.contactForm.reminder1h',
  contactFormReminder2h: 'booking.contactForm.reminder2h',
  contactFormReminder24h: 'booking.contactForm.reminder24h',
  contactFormNoReminder: 'booking.contactForm.noReminder',
  contactFormGdprConsent: 'booking.contactForm.gdprConsent',
  contactFormGdprLink: 'booking.contactForm.gdprLink',
  contactFormMarketingConsent: 'booking.contactForm.marketingConsent',
  contactFormSubmitBooking: 'booking.contactForm.submitBooking',
  contactFormAddonBadge: 'booking.contactForm.addonBadge',
  contactFormSelectTime: 'booking.contactForm.selectTime',
  contactFormNoTimeslots: 'booking.contactForm.noTimeslots',
  contactFormErrorCreate: 'booking.contactForm.errorCreate',
  contactFormErrorNetwork: 'booking.contactForm.errorNetwork',

  // Confirmation
  confirmationDone: 'booking.confirmation.done',
  confirmationThankYou: 'booking.confirmation.thankYou',
  confirmationServicesLabel: 'booking.confirmation.servicesLabel',
  confirmationAddonsLabel: 'booking.confirmation.addonsLabel',
  confirmationTotalLabel: 'booking.confirmation.totalLabel',
  confirmationBookingRefLabel: 'booking.confirmation.bookingRefLabel',
  confirmationStatusLabel: 'booking.confirmation.statusLabel',
  confirmationStatusConfirmed: 'booking.confirmation.statusConfirmed',
  confirmationStatusPending: 'booking.confirmation.statusPending',
  confirmationContactsLabel: 'booking.confirmation.contactsLabel',
  confirmationBackHome: 'booking.confirmation.backHome',
  confirmationNoBookingTitle: 'booking.confirmation.noBookingTitle',
  confirmationNoBookingText: 'booking.confirmation.noBookingText',
  confirmationGoToBooking: 'booking.confirmation.goToBooking',
  confirmationAddToCalendar: 'booking.confirmation.addToCalendar',
  confirmationAddToGoogleCalendar: 'booking.confirmation.addToGoogleCalendar',
  confirmationDownloadICS: 'booking.confirmation.downloadICS',
  confirmationCalendarEventTitle: 'booking.confirmation.calendarEventTitle',
  confirmationDefaultService: 'booking.confirmation.defaultService',
}

export const TranslationsBooking: GlobalConfig = {
  slug: 'translations-booking',
  label: { cs: 'Texty rezervace', en: 'Booking Translations', ru: 'Тексты бронирования' },
  admin: {
    group: { cs: 'Překlady', en: 'Translations', ru: 'Переводы' },
    description:
      'Texty používané v rezervačním procesu. Prázdné pole = použije se výchozí text z JSON překladových souborů.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ─── Kroky (Steps) ─── */
        {
          label: { cs: 'Kroky', en: 'Steps', ru: 'Шаги' },
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis stránky rezervace (heroTitle)',
            },
            // Vehicle step
            {
              name: 'stepsVehicleLabel',
              type: 'text',
              localized: true,
              label: 'Krok vozidlo — popis',
            },
            {
              name: 'stepsVehicleShort',
              type: 'text',
              localized: true,
              label: 'Krok vozidlo — krátký',
            },
            {
              name: 'stepsVehicleSubtitle',
              type: 'text',
              localized: true,
              label: 'Krok vozidlo — podnadpis',
            },
            // Program step
            {
              name: 'stepsProgramLabel',
              type: 'text',
              localized: true,
              label: 'Krok program — popis',
            },
            {
              name: 'stepsProgramShort',
              type: 'text',
              localized: true,
              label: 'Krok program — krátký',
            },
            {
              name: 'stepsProgramSubtitle',
              type: 'text',
              localized: true,
              label: 'Krok program — podnadpis',
            },
            // Addons step
            {
              name: 'stepsAddonsLabel',
              type: 'text',
              localized: true,
              label: 'Krok doplňky — popis',
            },
            {
              name: 'stepsAddonsShort',
              type: 'text',
              localized: true,
              label: 'Krok doplňky — krátký',
            },
            {
              name: 'stepsAddonsSubtitle',
              type: 'text',
              localized: true,
              label: 'Krok doplňky — podnadpis',
            },
            // Datetime step
            {
              name: 'stepsDatetimeLabel',
              type: 'text',
              localized: true,
              label: 'Krok datum — popis',
            },
            {
              name: 'stepsDatetimeShort',
              type: 'text',
              localized: true,
              label: 'Krok datum — krátký',
            },
            {
              name: 'stepsDatetimeSubtitle',
              type: 'text',
              localized: true,
              label: 'Krok datum — podnadpis',
            },
            // Contact step
            {
              name: 'stepsContactLabel',
              type: 'text',
              localized: true,
              label: 'Krok kontakt — popis',
            },
            {
              name: 'stepsContactShort',
              type: 'text',
              localized: true,
              label: 'Krok kontakt — krátký',
            },
            {
              name: 'stepsContactSubtitle',
              type: 'text',
              localized: true,
              label: 'Krok kontakt — podnadpis',
            },
          ],
        },

        /* ─── Vozidlo (Vehicle) ─── */
        {
          label: { cs: 'Vozidlo', en: 'Vehicle', ru: 'Транспорт' },
          fields: [
            {
              name: 'vehicleTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis výběru vozidla',
            },
            {
              name: 'vehicleSubtitle',
              type: 'text',
              localized: true,
              label: 'Podnadpis výběru vozidla',
            },
          ],
        },

        /* ─── Program ─── */
        {
          label: { cs: 'Program', en: 'Program', ru: 'Программа' },
          fields: [
            {
              name: 'programTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis výběru programu',
            },
            {
              name: 'programSubtitle',
              type: 'text',
              localized: true,
              label: 'Podnadpis výběru programu',
            },
            {
              name: 'programChangeCategory',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Změnit kategorii"',
            },
            {
              name: 'programWhatsIncluded',
              type: 'text',
              localized: true,
              label: 'Odkaz „Více o programu?"',
            },
            {
              name: 'programHide',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Skrýt"',
            },
            {
              name: 'programAdd',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Přidat"',
            },
            {
              name: 'programRemove',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Odebrat"',
            },
            {
              name: 'programCart',
              type: 'text',
              localized: true,
              label: 'Nadpis košíku',
            },
            {
              name: 'programEmptyCart',
              type: 'text',
              localized: true,
              label: 'Text prázdného košíku',
            },
            {
              name: 'programPromoLabel',
              type: 'text',
              localized: true,
              label: 'Label slevového kódu',
            },
            {
              name: 'programPromoPlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder slevového kódu',
            },
            {
              name: 'programTotal',
              type: 'text',
              localized: true,
              label: 'Text „Celkem"',
            },
            {
              name: 'programBackToVehicle',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Zpět na výběr vozidla"',
            },
            {
              name: 'programProgramBadge',
              type: 'text',
              localized: true,
              label: 'Badge „Program"',
            },
            {
              name: 'programMostPopular',
              type: 'text',
              localized: true,
              label: 'Badge „Nejoblíbenější"',
            },
            {
              name: 'programDuration',
              type: 'text',
              localized: true,
              label: 'Šablona trvání (např. „{minutes} min")',
            },
          ],
        },

        /* ─── Doplňky (Addons) ─── */
        {
          label: { cs: 'Doplňky', en: 'Addons', ru: 'Допуслуги' },
          fields: [
            {
              name: 'addonsTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis doplňkových služeb',
            },
            {
              name: 'addonsSubtitle',
              type: 'text',
              localized: true,
              label: 'Podnadpis doplňkových služeb',
            },
            {
              name: 'addonsContinueWithout',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Pokračovat bez doplňku"',
            },
            {
              name: 'addonsCartTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis košíku v doplňcích',
            },
            {
              name: 'addonsEmptyCart',
              type: 'text',
              localized: true,
              label: 'Text prázdného košíku',
            },
            {
              name: 'addonsPromoPlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder promo kódu',
            },
            {
              name: 'addonsSelectDate',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Vyberte datum"',
            },
            {
              name: 'addonsAddonCount1',
              type: 'text',
              localized: true,
              label: 'Počet doplňků — 1 (doplňka)',
            },
            {
              name: 'addonsAddonCount2to4',
              type: 'text',
              localized: true,
              label: 'Počet doplňků — 2-4 (doplňky)',
            },
            {
              name: 'addonsAddonCount5plus',
              type: 'text',
              localized: true,
              label: 'Počet doplňků — 5+ (doplňků)',
            },
            {
              name: 'addonsSkipToAddons',
              type: 'text',
              localized: true,
              label: 'Odkaz „Pouze doplňkové služby"',
            },
            {
              name: 'addonsAddonOnlyMode',
              type: 'text',
              localized: true,
              label: 'Label „Záznam bez programu"',
            },
            {
              name: 'addonsCategoryInterior',
              type: 'text',
              localized: true,
              label: 'Kategorie „Péče o interiér"',
            },
            {
              name: 'addonsCategoryExterior',
              type: 'text',
              localized: true,
              label: 'Kategorie „Péče o exteriér"',
            },
            {
              name: 'addonsCategoryProtection',
              type: 'text',
              localized: true,
              label: 'Kategorie „Ochrana a vosky"',
            },
          ],
        },

        /* ─── Košík (Cart) ─── */
        {
          label: { cs: 'Košík', en: 'Cart', ru: 'Корзина' },
          fields: [
            {
              name: 'cartDiscount',
              type: 'text',
              localized: true,
              label: 'Text „Sleva"',
            },
            {
              name: 'cartPromoInvalid',
              type: 'text',
              localized: true,
              label: 'Chyba — neplatný promokód',
            },
            {
              name: 'cartPromoExpired',
              type: 'text',
              localized: true,
              label: 'Chyba — vypršelý promokód',
            },
            {
              name: 'cartPromoUsedUp',
              type: 'text',
              localized: true,
              label: 'Chyba — vyčerpaný promokód',
            },
            {
              name: 'cartTimeMorning',
              type: 'text',
              localized: true,
              label: 'Čas — dopoledne',
            },
            {
              name: 'cartTimeAfternoon',
              type: 'text',
              localized: true,
              label: 'Čas — odpoledne',
            },
            {
              name: 'cartTimeEvening',
              type: 'text',
              localized: true,
              label: 'Čas — večer',
            },
            {
              name: 'cartPromoBadge',
              type: 'text',
              localized: true,
              label: 'Badge „Akce"',
            },
          ],
        },

        /* ─── Kontaktní formulář (Contact Form) ─── */
        {
          label: { cs: 'Kontaktní formulář', en: 'Contact Form', ru: 'Контактная форма' },
          fields: [
            {
              name: 'contactFormTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis kontaktního formuláře',
            },
            {
              name: 'contactFormNameLabel',
              type: 'text',
              localized: true,
              label: 'Label jména',
            },
            {
              name: 'contactFormNamePlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder jména',
            },
            {
              name: 'contactFormPhoneLabel',
              type: 'text',
              localized: true,
              label: 'Label telefonu',
            },
            {
              name: 'contactFormPhonePlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder telefonu',
            },
            {
              name: 'contactFormEmailLabel',
              type: 'text',
              localized: true,
              label: 'Label e-mailu',
            },
            {
              name: 'contactFormEmailPlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder e-mailu',
            },
            {
              name: 'contactFormPromoLabel',
              type: 'text',
              localized: true,
              label: 'Label promo kódu',
            },
            {
              name: 'contactFormCommentLabel',
              type: 'text',
              localized: true,
              label: 'Label komentáře',
            },
            {
              name: 'contactFormCommentPlaceholder',
              type: 'text',
              localized: true,
              label: 'Placeholder komentáře',
            },
            {
              name: 'contactFormReminderLabel',
              type: 'text',
              localized: true,
              label: 'Label připomenutí',
            },
            {
              name: 'contactFormReminder1h',
              type: 'text',
              localized: true,
              label: 'Připomenutí — 1 hodina',
            },
            {
              name: 'contactFormReminder2h',
              type: 'text',
              localized: true,
              label: 'Připomenutí — 2 hodiny',
            },
            {
              name: 'contactFormReminder24h',
              type: 'text',
              localized: true,
              label: 'Připomenutí — 24 hodin',
            },
            {
              name: 'contactFormNoReminder',
              type: 'text',
              localized: true,
              label: 'Připomenutí — bez',
            },
            {
              name: 'contactFormGdprConsent',
              type: 'textarea',
              localized: true,
              label: 'Text souhlasu GDPR',
            },
            {
              name: 'contactFormGdprLink',
              type: 'text',
              localized: true,
              label: 'Text odkazu GDPR',
            },
            {
              name: 'contactFormMarketingConsent',
              type: 'textarea',
              localized: true,
              label: 'Text marketingového souhlasu',
            },
            {
              name: 'contactFormSubmitBooking',
              type: 'text',
              localized: true,
              label: 'Tlačítko odeslání rezervace',
            },
            {
              name: 'contactFormAddonBadge',
              type: 'text',
              localized: true,
              label: 'Badge „Doplněk"',
            },
            {
              name: 'contactFormSelectTime',
              type: 'text',
              localized: true,
              label: 'Placeholder „Vyberte čas"',
            },
            {
              name: 'contactFormNoTimeslots',
              type: 'text',
              localized: true,
              label: 'Text — žádné volné časy',
            },
            {
              name: 'contactFormErrorCreate',
              type: 'text',
              localized: true,
              label: 'Chyba — vytvoření rezervace',
            },
            {
              name: 'contactFormErrorNetwork',
              type: 'text',
              localized: true,
              label: 'Chyba — síťová chyba',
            },
          ],
        },

        /* ─── Potvrzení (Confirmation) ─── */
        {
          label: { cs: 'Potvrzení', en: 'Confirmation', ru: 'Подтверждение' },
          fields: [
            {
              name: 'confirmationDone',
              type: 'text',
              localized: true,
              label: 'Text „Hotovo"',
            },
            {
              name: 'confirmationThankYou',
              type: 'text',
              localized: true,
              label: 'Nadpis „Děkujeme za rezervaci"',
            },
            {
              name: 'confirmationServicesLabel',
              type: 'text',
              localized: true,
              label: 'Label „Služby"',
            },
            {
              name: 'confirmationAddonsLabel',
              type: 'text',
              localized: true,
              label: 'Label „Doplňkové služby"',
            },
            {
              name: 'confirmationTotalLabel',
              type: 'text',
              localized: true,
              label: 'Label „Celkem"',
            },
            {
              name: 'confirmationBookingRefLabel',
              type: 'text',
              localized: true,
              label: 'Label „Číslo rezervace"',
            },
            {
              name: 'confirmationStatusLabel',
              type: 'text',
              localized: true,
              label: 'Label „Stav"',
            },
            {
              name: 'confirmationStatusConfirmed',
              type: 'text',
              localized: true,
              label: 'Stav — potvrzeno',
            },
            {
              name: 'confirmationStatusPending',
              type: 'text',
              localized: true,
              label: 'Stav — čeká na potvrzení',
            },
            {
              name: 'confirmationContactsLabel',
              type: 'text',
              localized: true,
              label: 'Label „Kontakty"',
            },
            {
              name: 'confirmationBackHome',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Zpět na hlavní stránku"',
            },
            {
              name: 'confirmationNoBookingTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis — rezervace nenalezena',
            },
            {
              name: 'confirmationNoBookingText',
              type: 'text',
              localized: true,
              label: 'Text — rezervace nenalezena',
            },
            {
              name: 'confirmationGoToBooking',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Přejít na rezervaci"',
            },
            {
              name: 'confirmationAddToCalendar',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Přidat do kalendáře"',
            },
            {
              name: 'confirmationAddToGoogleCalendar',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Google Calendar"',
            },
            {
              name: 'confirmationDownloadICS',
              type: 'text',
              localized: true,
              label: 'Tlačítko „Stáhnout .ics"',
            },
            {
              name: 'confirmationCalendarEventTitle',
              type: 'text',
              localized: true,
              label: 'Šablona názvu události (např. „Automyčka — {service}")',
            },
            {
              name: 'confirmationDefaultService',
              type: 'text',
              localized: true,
              label: 'Výchozí název služby pro kalendář',
            },
          ],
        },
      ],
    },
  ],
}
