import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů",
  description:
    "Zásady ochrany osobních údajů společnosti AUTOMYČKA KARLÍN. Informace o zpracování osobních údajů.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-[#f0eff0] text-[#302e2f] py-20">
      <div className="max-w-[1536px] mx-auto px-8">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-clash text-[28px] lg:text-[40px] font-bold leading-tight mb-12">
            Zásady ochrany osobních údajů
          </h1>

          {/* 1. Úvod */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">1. Úvod</h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Společnost AUTOMYČKA KARLÍN (dále jen &bdquo;Správce&ldquo;) si
              váží Vaší důvěry a je zavázána chránit Vaše osobní údaje. Tyto
              zásady ochrany osobních údajů popisují, jakým způsobem
              shromažďujeme, používáme, uchováváme a chráníme Vaše osobní údaje
              při využívání našich služeb, webových stránek a rezervačního
              systému.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Zpracování osobních údajů probíhá v souladu s nařízením Evropského
              parlamentu a Rady (EU) 2016/679, obecným nařízením o ochraně
              osobních údajů (GDPR), a příslušnými právními předpisy České
              republiky.
            </p>
          </div>

          {/* 2. Správce osobních údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              2. Správce osobních údajů
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Správcem Vašich osobních údajů je:
            </p>
            <div className="font-clash text-[16px] font-medium leading-relaxed bg-white rounded-xl p-6 space-y-1">
              <p className="font-bold">AUTOMYČKA KARLÍN</p>
              <p>Sokolovská 694/98</p>
              <p>186 00 Praha 8 &ndash; Karlín</p>
              <p>Česká republika</p>
              <p className="mt-2">
                IČO: 12345678 {/* placeholder */}
              </p>
              <p>
                E-mail:{" "}
                <a
                  href="mailto:automyckakarlin@email.cz"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  automyckakarlin@email.cz
                </a>
              </p>
              <p>
                Telefon:{" "}
                <a
                  href="tel:+420775009033"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  +420 775 009 033
                </a>
              </p>
            </div>
          </div>

          {/* 3. Účel zpracování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              3. Účel zpracování
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Vaše osobní údaje zpracováváme pro následující účely:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Rezervace a objednávky</strong> &ndash; zpracování
                rezervací mytí a detailingu, správa objednávek a komunikace
                ohledně poskytovaných služeb.
              </li>
              <li>
                <strong>Zasílání newsletterů</strong> &ndash; informování o
                novinkách, akcích a speciálních nabídkách (pouze s Vaším
                souhlasem).
              </li>
              <li>
                <strong>Zlepšování služeb</strong> &ndash; analýza preferencí
                zákazníků a optimalizace nabídky služeb a uživatelského zážitku
                na webových stránkách.
              </li>
              <li>
                <strong>Zákonné povinnosti</strong> &ndash; plnění daňových,
                účetních a dalších zákonných povinností.
              </li>
              <li>
                <strong>Komunikace</strong> &ndash; odpovědi na Vaše dotazy
                a&nbsp;žádosti prostřednictvím kontaktního formuláře, e-mailu
                nebo telefonu.
              </li>
            </ul>
          </div>

          {/* 4. Právní základ zpracování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              4. Právní základ zpracování
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Osobní údaje zpracováváme na základě následujících právních
              titulů:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Plnění smlouvy</strong> (čl. 6 odst. 1 písm. b) GDPR)
                &ndash; zpracování je nezbytné pro plnění smlouvy o poskytování
                služeb, jejíž smluvní stranou jste Vy.
              </li>
              <li>
                <strong>Souhlas</strong> (čl. 6 odst. 1 písm. a) GDPR) &ndash;
                pro zasílání marketingových sdělení a newsletterů. Souhlas
                můžete kdykoli odvolat.
              </li>
              <li>
                <strong>Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f) GDPR)
                &ndash; zlepšování služeb a ochrana našich oprávněných zájmů.
              </li>
              <li>
                <strong>Zákonná povinnost</strong> (čl. 6 odst. 1 písm. c) GDPR)
                &ndash; plnění povinností vyplývajících z právních předpisů.
              </li>
            </ul>
          </div>

          {/* 5. Doba uchování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              5. Doba uchování
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Vaše osobní údaje uchováváme pouze po dobu nezbytně nutnou pro
              splnění účelu zpracování:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Údaje o rezervacích a objednávkách</strong> &ndash; po
                dobu trvání smluvního vztahu a následně 3 roky pro případné
                reklamace.
              </li>
              <li>
                <strong>Účetní a daňové doklady</strong> &ndash; 10 let dle
                zákonných požadavků.
              </li>
              <li>
                <strong>Marketingové souhlasy</strong> &ndash; do odvolání
                souhlasu.
              </li>
              <li>
                <strong>Údaje z kontaktních formulářů</strong> &ndash; 1 rok od
                posledního kontaktu.
              </li>
            </ul>
          </div>

          {/* 6. Příjemci údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              6. Příjemci údajů
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Vaše osobní údaje mohou být sdíleny s následujícími třetími
              stranami:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Altegio</strong> &ndash; provozovatel rezervačního
                systému, který zajišťuje technickou správu rezervací.
              </li>
              <li>
                <strong>Platební procesory</strong> &ndash; zpracovatelé
                karetních plateb pro bezpečné provádění platebních transakcí.
              </li>
              <li>
                <strong>Účetní a daňoví poradci</strong> &ndash; pro plnění
                zákonných povinností.
              </li>
              <li>
                <strong>Poskytovatelé IT služeb</strong> &ndash; hosting,
                správa webových stránek a e-mailové komunikace.
              </li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              Vaše údaje nepředáváme do třetích zemí mimo Evropský hospodářský
              prostor bez odpovídajících záruk.
            </p>
          </div>

          {/* 7. Vaše práva */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              7. Vaše práva
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              V souvislosti se zpracováním osobních údajů máte následující
              práva:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Právo na přístup</strong> &ndash; máte právo získat
                potvrzení o tom, zda jsou Vaše osobní údaje zpracovávány, a
                pokud ano, získat k nim přístup.
              </li>
              <li>
                <strong>Právo na opravu</strong> &ndash; máte právo požadovat
                opravu nepřesných nebo doplnění neúplných osobních údajů.
              </li>
              <li>
                <strong>Právo na výmaz</strong> &ndash; máte právo požadovat
                vymazání svých osobních údajů, pokud pro jejich zpracování
                neexistuje zákonný důvod.
              </li>
              <li>
                <strong>Právo na přenositelnost</strong> &ndash; máte právo
                získat osobní údaje, které jste nám poskytli, ve strukturovaném
                a strojově čitelném formátu.
              </li>
              <li>
                <strong>Právo vznést námitku</strong> &ndash; máte právo vznést
                námitku proti zpracování osobních údajů na základě oprávněného
                zájmu.
              </li>
              <li>
                <strong>Právo na omezení zpracování</strong> &ndash; máte právo
                požadovat omezení zpracování osobních údajů.
              </li>
              <li>
                <strong>Právo odvolat souhlas</strong> &ndash; pokud je
                zpracování založeno na souhlasu, máte právo tento souhlas
                kdykoli odvolat.
              </li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              Svá práva můžete uplatnit zasláním žádosti na e-mailovou adresu{" "}
              <a
                href="mailto:automyckakarlin@email.cz"
                className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
              >
                automyckakarlin@email.cz
              </a>
              . Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních
              údajů (ÚOOÚ).
            </p>
          </div>

          {/* 8. Cookies */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              8. Cookies
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Naše webové stránky používají soubory cookies pro zajištění správné
              funkčnosti webu, analýzu návštěvnosti a personalizaci obsahu.
              Cookies jsou malé textové soubory, které se ukládají ve Vašem
              prohlížeči.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Používáme následující typy cookies:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Nezbytné cookies</strong> &ndash; zajišťují základní
                funkčnost webu a nelze je deaktivovat.
              </li>
              <li>
                <strong>Analytické cookies</strong> &ndash; pomáhají nám
                pochopit, jak návštěvníci používají webové stránky.
              </li>
              <li>
                <strong>Marketingové cookies</strong> &ndash; slouží k zobrazení
                relevantních reklamních sdělení.
              </li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              Nastavení cookies můžete kdykoli změnit v nastavení svého
              prohlížeče.
            </p>
          </div>

          {/* 9. Kontakt */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              9. Kontakt
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              V případě jakýchkoli dotazů ohledně zpracování Vašich osobních
              údajů nás neváhejte kontaktovat:
            </p>
            <div className="font-clash text-[16px] font-medium leading-relaxed bg-white rounded-xl p-6 space-y-1">
              <p className="font-bold">AUTOMYČKA KARLÍN</p>
              <p>
                E-mail:{" "}
                <a
                  href="mailto:automyckakarlin@email.cz"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  automyckakarlin@email.cz
                </a>
              </p>
              <p>
                Telefon:{" "}
                <a
                  href="tel:+420775009033"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  +420 775 009 033
                </a>
              </p>
              <p>Sokolovská 694/98, 186 00 Praha 8 &ndash; Karlín</p>
            </div>
          </div>

          <p className="font-clash text-[14px] font-medium text-[#b1b3b6]">
            Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. 1.
            2026.
          </p>
        </div>
      </div>
    </section>
  );
}
