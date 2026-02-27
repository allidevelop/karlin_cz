// ────────────────────────────────────────────────────────────────────────────
// Seed script for Automycka Karlin Payload CMS
// Run with: npm run seed
// Requires the dev server to be running on SEED_URL (default http://localhost:3231)
// ────────────────────────────────────────────────────────────────────────────

const BASE = process.env.SEED_URL || 'http://localhost:3231'
const API = `${BASE}/api`

let TOKEN = ''

async function api(collection: string, data: Record<string, unknown>) {
  const res = await fetch(`${API}/${collection}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `JWT ${TOKEN}` } : {}),
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(JSON.stringify(json.errors || json))
  }
  return json
}

async function login(email: string, password: string) {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error('Login failed: ' + JSON.stringify(json))
  TOKEN = json.token
  console.log('  Logged in as', json.user.email)
}

async function seed() {
  console.log(`Seeding Payload CMS at ${API}\n`)

  // Login
  console.log('── Authenticating ──')
  await login('admin@automycka.cz', 'SecurePass123')

  // ──────────── SERVICE CATEGORIES ────────────
  console.log('\n── Seeding Service Categories ──')
  const serviceCategories = [
    { name: 'Exteriér', slug: 'exterior', description: 'Služby zaměřené na exteriér vozidla.', sortOrder: 1 },
    { name: 'Interiér', slug: 'interior', description: 'Služby zaměřené na interiér vozidla.', sortOrder: 2 },
    { name: 'Express', slug: 'express', description: 'Rychlé programy mytí.', sortOrder: 3 },
    { name: 'Detailing', slug: 'detailing', description: 'Profesionální detailing.', sortOrder: 4 },
  ]

  const categoryMap: Record<string, number> = {}
  for (const cat of serviceCategories) {
    try {
      const created = await api('service-categories', cat)
      categoryMap[cat.slug] = created.doc.id
      console.log(`  + ${cat.name}`)
    } catch (e) {
      console.log(`  ~ ${cat.name} (skipped)`)
    }
  }

  // ──────────── VEHICLE CATEGORIES ────────────
  console.log('\n── Seeding Vehicle Categories ──')
  const vehicleCategories = [
    { name: 'Hatchback / Sedan', slug: 'hatchback-sedan', priceMultiplier: 1, sortOrder: 1, examples: 'Škoda Octavia, BMW 3, VW Golf', description: 'Standardní osobní automobily.' },
    { name: 'SUV', slug: 'suv', priceMultiplier: 1.15, sortOrder: 2, examples: 'Škoda Kodiaq, BMW X3, VW Tiguan', description: 'SUV střední velikosti.' },
    { name: 'G-Class / V-Class / Pickup', slug: 'g-class-v-class-pickup', priceMultiplier: 1.3, sortOrder: 3, examples: 'Mercedes G-Class, VW Multivan, Toyota Hilux', description: 'Velká SUV, dodávky a pickupy.' },
    { name: 'Motocykly', slug: 'motocykly', priceMultiplier: 0.7, sortOrder: 4, examples: 'Harley-Davidson, BMW R1250, Ducati Monster', description: 'Motocykly všech typů.' },
  ]

  const vehicleMap: Record<string, number> = {}
  for (const veh of vehicleCategories) {
    try {
      const created = await api('vehicle-categories', veh)
      vehicleMap[veh.slug] = created.doc.id
      console.log(`  + ${veh.name}`)
    } catch (e) {
      console.log(`  ~ ${veh.name} (skipped)`)
    }
  }

  // ──────────── SERVICES ────────────
  console.log('\n── Seeding Services ──')
  const services = [
    {
      name: 'Exteriér Komplet', slug: 'exterior-komplet', subtitle: 'Péče o exteriér',
      description: 'Kompletní mytí exteriéru včetně ručního mytí karoserie, čištění disků, leštění skel a ošetření pneumatik.',
      price: 985, duration: '2–3 hodiny', categorySlug: 'exterior', isActive: true, sortOrder: 1,
      features: ['Předmytí a ruční mytí karoserie', 'Čištění disků a podběhů', 'Ošetření pneumatik', 'Mytí oken a zrcátek', 'Ošetření vnějších plastových prvků', 'Sušení mikrovláknem'],
      pricing: [{ v: 'hatchback-sedan', p: 985 }, { v: 'suv', p: 1185 }, { v: 'g-class-v-class-pickup', p: 1385 }, { v: 'motocykly', p: 585 }],
    },
    {
      name: 'Interiér Komplet', slug: 'interior-komplet', subtitle: 'Péče o interiér',
      description: 'Důkladné vyčištění celého interiéru – vysávání, čištění čalounění, plastů, kůže a dezinfekce klimatizace.',
      price: 1085, duration: '2–3 hodiny', categorySlug: 'interior', isActive: true, sortOrder: 2,
      features: ['Kompletní vysávání interiéru', 'Čištění palubní desky a panelů', 'Čištění a ošetření sedadel', 'Čištění podlahových koberců', 'Čištění oken zevnitř', 'Ošetření plastových a gumových prvků', 'Vůně interiéru'],
      pricing: [{ v: 'hatchback-sedan', p: 1085 }, { v: 'suv', p: 1285 }, { v: 'g-class-v-class-pickup', p: 1485 }],
    },
    {
      name: 'To Go', slug: 'to-go', subtitle: 'Expresní mytí',
      description: 'Rychlé a efektivní mytí pro ty, kteří nemají čas čekat.',
      price: 985, duration: '45 minut', categorySlug: 'express', isActive: true, sortOrder: 3,
      features: ['Ruční mytí karoserie', 'Základní čištění disků', 'Ošetření pneumatik', 'Rychlé vysávání interiéru', 'Otření palubní desky', 'Sušení karoserie'],
      pricing: [{ v: 'hatchback-sedan', p: 985 }, { v: 'suv', p: 1185 }, { v: 'g-class-v-class-pickup', p: 1385 }, { v: 'motocykly', p: 585 }],
    },
    {
      name: 'To Glow', slug: 'to-glow', subtitle: 'Standardní péče',
      description: 'Standardní program péče kombinující mytí exteriéru a interiéru.',
      price: 1085, duration: '1,5–2 hodiny', categorySlug: 'exterior', isActive: true, sortOrder: 4,
      features: ['Kompletní ruční mytí karoserie', 'Čištění disků a podběhů', 'Ošetření pneumatik a plastů', 'Kompletní vysávání interiéru', 'Čištění palubní desky a panelů', 'Čištění sedadel', 'Mytí oken zevnitř i zvenku', 'Vůně interiéru'],
      pricing: [{ v: 'hatchback-sedan', p: 1085 }, { v: 'suv', p: 1285 }, { v: 'g-class-v-class-pickup', p: 1485 }, { v: 'motocykly', p: 685 }],
    },
    {
      name: 'To Wow', slug: 'to-wow', subtitle: 'Prémiová péče',
      description: 'Kompletní prémiový program pro náročné zákazníky. Exteriér i interiér v jednom.',
      price: 1085, duration: '3–4 hodiny', categorySlug: 'exterior', isActive: true, sortOrder: 5,
      features: ['Kompletní ruční mytí karoserie', 'Čištění disků a podběhů', 'Kompletní vysávání interiéru', 'Čištění a ošetření sedadel', 'Ošetření plastových prvků', 'Mytí oken', 'Ošetření laku voskem', 'Vůně interiéru'],
      pricing: [{ v: 'hatchback-sedan', p: 1085 }, { v: 'suv', p: 1285 }, { v: 'g-class-v-class-pickup', p: 1485 }],
    },
    {
      name: 'Premium Detailing', slug: 'premium-detailing', subtitle: 'Ultimátní péče',
      description: 'Profesionální detailing s keramickou ochranou, korekce laku a kompletní renovace interiéru i exteriéru.',
      price: 4500, duration: '6–8 hodin', categorySlug: 'detailing', isActive: true, sortOrder: 6,
      features: ['Kompletní předmytí a ruční mytí', 'Dekontaminace laku (clay bar)', 'Vícevrstvé strojní leštění', 'Keramický coating / prémiový vosk', 'Čištění motorového prostoru', 'Kompletní renovace interiéru', 'Hloubkové čištění sedadel a koberců', 'Ošetření kůže speciálními přípravky', 'Mytí oken s hydrofobní úpravou', 'Prémiová vůně interiéru'],
      pricing: [{ v: 'hatchback-sedan', p: 4500 }, { v: 'suv', p: 5200 }, { v: 'g-class-v-class-pickup', p: 6000 }, { v: 'motocykly', p: 2500 }],
    },
  ]

  for (const svc of services) {
    try {
      const { categorySlug, pricing, features, ...rest } = svc
      const data: Record<string, unknown> = { ...rest }
      if (categorySlug && categoryMap[categorySlug]) data.category = categoryMap[categorySlug]
      data.features = features.map((f) => ({ feature: f }))
      if (pricing && Object.keys(vehicleMap).length > 0) {
        data.pricingByVehicle = pricing
          .filter((p) => vehicleMap[p.v])
          .map((p) => ({ vehicleCategory: vehicleMap[p.v], price: p.p }))
      }
      await api('services', data)
      console.log(`  + ${svc.name}`)
    } catch (e) {
      console.log(`  ~ ${svc.name} (skipped)`)
    }
  }

  // ──────────── FAQ ────────────
  console.log('\n── Seeding FAQ ──')
  const faqItems = [
    { question: 'Jak dlouho trvá mytí?', answer: 'Doba mytí závisí na zvoleném programu. Expresní mytí trvá přibližně 30 minut, kompletní programy 2-4 hodiny.', sortOrder: 1, isActive: true },
    { question: 'Potřebuji rezervaci?', answer: 'Doporučujeme rezervaci předem přes náš online systém, ale přijímáme i zákazníky bez rezervace dle aktuální dostupnosti.', sortOrder: 2, isActive: true },
    { question: 'Jaké platební metody přijímáte?', answer: 'Přijímáme hotovost, platební karty a bankovní převody. Pro firemní zákazníky nabízíme také fakturaci.', sortOrder: 3, isActive: true },
    { question: 'Nabízíte odvoz a přistavení vozu?', answer: 'Ano, v rámci Prahy nabízíme službu pick-up & delivery za příplatek.', sortOrder: 4, isActive: true },
    { question: 'Jsou vaše přípravky ekologické?', answer: 'Ano, používáme výhradně ekologické a biologicky odbouratelné přípravky šetrné k životnímu prostředí.', sortOrder: 5, isActive: true },
  ]
  for (const faq of faqItems) {
    try {
      await api('faq', faq)
      console.log(`  + ${faq.question}`)
    } catch (e) {
      console.log(`  ~ ${faq.question} (skipped)`)
    }
  }

  // ──────────── REVIEWS ────────────
  console.log('\n── Seeding Reviews ──')
  const reviews = [
    { authorName: 'Jan Novák', text: 'Skvělá služba! Auto vypadá jako nové. Personál je velmi profesionální a příjemný. Určitě se vrátím.', rating: 5, source: 'google', date: '2024-01-15', isApproved: true },
    { authorName: 'Petra Dvořáková', text: 'Nejlepší automyčka v Praze. Vyzkoušela jsem Premium Detailing a výsledek předčil moje očekávání. Doporučuji všem!', rating: 5, source: 'google', date: '2024-02-20', isApproved: true },
    { authorName: 'Martin Svoboda', text: 'Expresní mytí je přesně to, co potřebuji. Za 30 minut mám čisté auto. Výborný poměr cena/výkon.', rating: 5, source: 'google', date: '2024-03-08', isApproved: true },
    { authorName: 'Lucie Černá', text: 'Profesionální přístup a skvělé výsledky. Interiér mého vozu nebyl nikdy čistší. Děkuji celému týmu!', rating: 5, source: 'google', date: '2024-04-12', isApproved: true },
  ]
  for (const review of reviews) {
    try {
      await api('reviews', review)
      console.log(`  + ${review.authorName}`)
    } catch (e) {
      console.log(`  ~ ${review.authorName} (skipped)`)
    }
  }

  // ──────────── PROMOTIONS ────────────
  console.log('\n── Seeding Promotions ──')
  const promotions = [
    {
      title: 'Zimní kompletní péče', slug: 'zimni-kompletni-pece',
      description: 'Kompletní ochrana vašeho vozu před zimním počasím. Včetně ošetření laku a podvozku.',
      discountedPrice: 1750, badge: 'Zimní akce', isActive: true,
      includedItems: [{ item: 'Předmytí a ruční mytí karoserie' }, { item: 'Ošetření laku voskem' }, { item: 'Ochrana podvozku' }, { item: 'Ošetření pneumatik' }, { item: 'Kompletní interiérová péče' }],
      terms: [{ term: 'Akce platí v zimním období.' }, { term: 'Cena je za kategorii Hatchback/Sedan.' }, { term: 'Nelze kombinovat s jinými slevami.' }],
    },
    {
      title: 'Jarní refresh balíček', slug: 'jarni-refresh',
      description: 'Důkladné mytí po zimě, odstranění solných usazenin a obnovení lesku karoserie.',
      discountedPrice: 1490, badge: 'Jarní akce', isActive: true,
      includedItems: [{ item: 'Důkladné mytí karoserie' }, { item: 'Odstranění solných usazenin' }, { item: 'Dekontaminace laku' }, { item: 'Obnovení lesku karoserie' }, { item: 'Ošetření plastových prvků' }],
      terms: [{ term: 'Akce platí v jarním období.' }, { term: 'Cena je za kategorii Hatchback/Sedan.' }, { term: 'Nutná rezervace předem.' }],
    },
    {
      title: 'Keramická ochrana', slug: 'keramicka-ochrana',
      description: 'Profesionální keramický coating pro dlouhodobou ochranu laku až na 2 roky.',
      discountedPrice: 4990, badge: 'Ochrana laku', isActive: true,
      includedItems: [{ item: 'Dekontaminace laku' }, { item: 'Strojní leštění' }, { item: 'Aplikace keramického coatingu' }, { item: 'Ochrana laku až na 2 roky' }, { item: 'Hydrofobní efekt' }],
      terms: [{ term: 'Cena je za kategorii Hatchback/Sedan.' }, { term: 'Pro větší vozy příplatek dle kategorie.' }, { term: 'Nutná rezervace předem.' }],
    },
    {
      title: 'Rodinný balíček', slug: 'rodinny-balicek',
      description: 'Kompletní péče o 2 vozy se slevou 20 %. Ideální pro páry a rodiny.',
      discountedPrice: 2990, badge: 'Sleva 20%', isActive: true,
      includedItems: [{ item: 'Kompletní péče o 2 vozy' }, { item: 'Mytí exteriéru i interiéru' }, { item: 'Ošetření pneumatik a plastů' }, { item: 'Sleva 20 % oproti jednotlivým programům' }],
      terms: [{ term: 'Platí při objednávce pro 2 vozy současně.' }, { term: 'Cena je za 2 vozy kategorie Hatchback/Sedan.' }, { term: 'Nelze kombinovat s jinými slevami.' }],
    },
  ]
  for (const promo of promotions) {
    try {
      await api('promotions', promo)
      console.log(`  + ${promo.title}`)
    } catch (e) {
      console.log(`  ~ ${promo.title} (skipped)`)
    }
  }

  // ──────────── BLOG POSTS ────────────
  console.log('\n── Seeding Blog Posts ──')

  function lexicalContent(paragraphs: string[]) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: paragraphs.map((text) => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
        })),
        direction: 'ltr',
      },
    }
  }

  const blogPosts = [
    {
      title: 'Jak často byste měli mýt svůj vůz?', slug: 'jak-casto-myt-auto',
      excerpt: 'Pravidelné mytí vozu není jen o vzhledu — chrání lak, zvyšuje hodnotu vozidla a prodlužuje jeho životnost.',
      category: 'car-care', author: 'Tým Automyčka Karlín', readingTime: 5, publishedAt: '2026-02-15', isPublished: true,
      content: lexicalContent([
        'Pravidelné mytí vozu je jedním z nejdůležitějších kroků pro udržení jeho hodnoty a vzhledu.',
        'V městském provozu doporučujeme mytí alespoň jednou za dva týdny. V zimě jednou týdně kvůli soli.',
        'Profesionální ruční mytí je vždy šetrnější k laku než automatická myčka.',
      ]),
    },
    {
      title: 'Keramický coating: Vyplatí se investice?', slug: 'keramicky-coating-vyhody',
      excerpt: 'Keramický coating je jednou z nejpopulárnějších ochran laku.',
      category: 'technology', author: 'Tým Automyčka Karlín', readingTime: 7, publishedAt: '2026-02-08', isPublished: true,
      content: lexicalContent([
        'Keramický coating se stal jedním z nejžádanějších produktů v oblasti detailingu.',
        'Hlavní výhodou je výdrž — kvalitní coating vydrží 2 až 5 let.',
        'Investice se vyplatí především u novějších vozidel nebo po profesionálním leštění.',
      ]),
    },
    {
      title: 'Zimní údržba auta: Kompletní průvodce', slug: 'zimni-udrzba-auta',
      excerpt: 'Zima je pro váš vůz náročné období.',
      category: 'car-care', author: 'Tým Automyčka Karlín', readingTime: 6, publishedAt: '2026-02-01', isPublished: true,
      content: lexicalContent([
        'Zimní měsíce představují pro váš vůz jednu z největších výzev.',
        'Před zimou doporučujeme důkladné mytí a aplikaci kvalitní ochrany laku.',
        'Během zimy myjte vůz pravidelně, ideálně každý týden.',
      ]),
    },
    {
      title: 'Jak správně pečovat o lak vašeho vozu', slug: 'jak-spravne-pecovat-o-lak',
      excerpt: 'Správná péče o lak je klíčová pro zachování hodnoty vašeho automobilu.',
      category: 'car-care', author: 'Tým Automyčka Karlín', readingTime: 5, publishedAt: '2024-01-15', isPublished: true,
      content: lexicalContent([
        'Správná péče o lak je jedním z nejdůležitějších faktorů pro zachování hodnoty a vzhledu vašeho vozidla.',
        'Pravidelné mytí je základem péče o lak. Doporučujeme ruční mytí každé dva týdny.',
        'Po mytí je důležité lak chránit vrstvou vosku nebo sealantu.',
      ]),
    },
    {
      title: '5 důvodů proč zvolit ruční mytí', slug: '5-duvodu-proc-zvolit-rucni-myti',
      excerpt: 'Ruční mytí nabízí mnoho výhod oproti automatickým mycím linkám.',
      category: 'tips', author: 'Tým Automyčka Karlín', readingTime: 4, publishedAt: '2024-02-28', isPublished: true,
      content: lexicalContent([
        'Ruční mytí nabízí celou řadu výhod, které automatické mycí linky nemohou poskytnout.',
        'Šetrnost k laku, důkladnost, individuální přístup, kvalitní přípravky a kontrola stavu.',
      ]),
    },
    {
      title: 'Keramický coating: Kompletní průvodce', slug: 'keramicky-coating-pruvodce',
      excerpt: 'Vše co potřebujete vědět o keramické ochraně laku.',
      category: 'technology', author: 'Tým Automyčka Karlín', readingTime: 7, publishedAt: '2024-03-10', isPublished: true,
      content: lexicalContent([
        'Keramický coating je jednou z nejmodernějších technologií ochrany laku.',
        'Příprava povrchu je klíčová — před aplikací coatingu je nutné lak důkladně dekontaminovat.',
        'Údržba je jednoduchá — stačí pravidelné šetrné mytí.',
      ]),
    },
  ]

  for (const post of blogPosts) {
    try {
      await api('blog-posts', post)
      console.log(`  + ${post.title}`)
    } catch (e) {
      console.log(`  ~ ${post.title} (skipped)`)
    }
  }

  // ──────────── PARTNERS ────────────
  console.log('\n── Seeding Partners ──')
  const partners = [
    { name: 'AutoPro', website: 'https://autopro.cz', sortOrder: 1, isActive: true },
    { name: 'CarChem', website: 'https://carchem.co.uk', sortOrder: 2, isActive: true },
    { name: 'Koch Chemie', website: 'https://koch-chemie.com', sortOrder: 3, isActive: true },
    { name: 'Sonax', website: 'https://sonax.com', sortOrder: 4, isActive: true },
    { name: "Meguiar's", website: 'https://meguiars.com', sortOrder: 5, isActive: true },
    { name: 'Gyeon', website: 'https://gyeonquartz.com', sortOrder: 6, isActive: true },
  ]
  for (const partner of partners) {
    try {
      await api('partners', partner)
      console.log(`  + ${partner.name}`)
    } catch (e) {
      console.log(`  ~ ${partner.name} (skipped)`)
    }
  }

  console.log('\nSeed complete!')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
