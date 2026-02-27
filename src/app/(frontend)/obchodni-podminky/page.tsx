import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description:
    "Obchodní podmínky společnosti AUTOMYČKA KARLÍN pro poskytování služeb mytí a detailingu vozidel.",
};

export default function TermsOfServicePage() {
  return (
    <section className="bg-[#f0eff0] text-[#302e2f] py-20">
      <div className="max-w-[1536px] mx-auto px-8">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-clash text-[28px] lg:text-[40px] font-bold leading-tight mb-12">
            Obchodní podmínky
          </h1>

          {/* 1. Úvodní ustanovení */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              1. Úvodní ustanovení
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Tyto obchodní podmínky (dále jen &bdquo;Podmínky&ldquo;) upravují
              práva a povinnosti mezi společností AUTOMYČKA KARLÍN, se sídlem
              Sokolovská 694/98, 186 00 Praha 8 &ndash; Karlín, IČO: 12345678
              (dále jen &bdquo;Poskytovatel&ldquo;), a zákazníkem (dále jen
              &bdquo;Zákazník&ldquo;) při využívání služeb mytí, čištění a
              detailingu vozidel.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Objednáním služby nebo provedením rezervace Zákazník potvrzuje, že
              se seznámil s těmito Podmínkami a souhlasí s nimi.
            </p>
          </div>

          {/* 2. Objednávka a rezervace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              2. Objednávka a rezervace
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Rezervaci služeb lze provést následujícími způsoby:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 mb-4">
              <li>Online prostřednictvím rezervačního systému na webových stránkách.</li>
              <li>Telefonicky na čísle +420 775 009 033.</li>
              <li>Osobně na provozovně.</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Rezervace je závazná po jejím potvrzení ze strany Poskytovatele.
              Potvrzení je zasláno e-mailem nebo SMS na kontaktní údaje uvedené
              Zákazníkem.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Zákazník je povinen dostavit se na provozovnu v rezervovaném čase.
              V případě zpoždění delšího než 15 minut si Poskytovatel vyhrazuje
              právo rezervaci zrušit.
            </p>
          </div>

          {/* 3. Ceny a platby */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              3. Ceny a platby
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Všechny ceny jsou uvedeny v českých korunách (CZK) včetně DPH.
              Aktuální ceník je k dispozici na webových stránkách a na
              provozovně.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Konečná cena služby může být upravena v závislosti na skutečném
              stavu a znečištění vozidla, o čemž bude Zákazník informován před
              zahájením služby.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Platbu lze provést následujícími způsoby:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>Platební kartou (Visa, Mastercard) &ndash; na provozovně i online.</li>
              <li>Hotově &ndash; na provozovně.</li>
              <li>Bankovním převodem &ndash; pro firemní zákazníky na základě faktury.</li>
            </ul>
          </div>

          {/* 4. Zrušení a změna rezervace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              4. Zrušení a změna rezervace
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Zákazník může rezervaci bezplatně zrušit nebo změnit nejpozději 24
              hodin před plánovaným termínem služby.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              V případě zrušení rezervace méně než 24 hodin před plánovaným
              termínem si Poskytovatel vyhrazuje právo účtovat storno poplatek
              ve výši 50 % z ceny objednané služby.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Při opakovaném nedostavení se bez předchozího zrušení rezervace si
              Poskytovatel vyhrazuje právo vyžadovat od Zákazníka zálohu při
              budoucích rezervacích.
            </p>
          </div>

          {/* 5. Odpovědnost */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              5. Odpovědnost
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Poskytovatel odpovídá za škody způsobené prokazatelně jeho
              zaviněním při provádění služby. Zákazník je povinen případnou škodu
              nahlásit bezprostředně po převzetí vozidla, nejpozději však do 24
              hodin.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Poskytovatel neodpovídá za:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>
                Škody způsobené skrytými vadami vozidla (uvolněné díly, poškozený
                lak apod.).
              </li>
              <li>
                Předměty ponechané ve vozidle během poskytování služby.
              </li>
              <li>
                Škody vzniklé v důsledku nedodržení pokynů Poskytovatele
                Zákazníkem.
              </li>
            </ul>
          </div>

          {/* 6. Reklamace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              6. Reklamace
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Zákazník má právo reklamovat kvalitu poskytnuté služby.
              Reklamaci je nutné uplatnit neprodleně při převzetí vozidla nebo
              nejpozději do 24 hodin od dokončení služby.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Reklamaci lze uplatnit:
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 mb-4">
              <li>Osobně na provozovně.</li>
              <li>E-mailem na adrese automyckakarlin@email.cz.</li>
              <li>Telefonicky na čísle +420 775 009 033.</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Poskytovatel reklamaci posoudí a vyřídí nejpozději do 30 dnů od
              jejího obdržení. V případě oprávněné reklamace Poskytovatel
              zajistí bezplatné opakování služby nebo vrácení příslušné části
              ceny.
            </p>
          </div>

          {/* 7. Ochrana osobních údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              7. Ochrana osobních údajů
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              Informace o zpracování osobních údajů jsou uvedeny v samostatném
              dokumentu{" "}
              <Link
                href="/zasady-ochrany-osobnich-udaju"
                className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
              >
                Zásady ochrany osobních údajů
              </Link>
              , který je nedílnou součástí těchto Podmínek.
            </p>
          </div>

          {/* 8. Závěrečná ustanovení */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              8. Závěrečná ustanovení
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Tyto Podmínky se řídí právním řádem České republiky, zejména
              zákonem č. 89/2012 Sb., občanský zákoník, v platném znění.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Poskytovatel si vyhrazuje právo tyto Podmínky kdykoli změnit.
              Aktuální znění Podmínek je vždy k dispozici na webových stránkách
              Poskytovatele.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              Případné spory budou řešeny přednostně mimosoudní cestou. Pokud
              nedojde k dohodě, je příslušným soudem soud v Praze.
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              V případě, že některé ustanovení těchto Podmínek bude shledáno
              neplatným nebo nevymahatelným, nebude tím dotčena platnost a
              vymahatelnost ostatních ustanovení.
            </p>
          </div>

          <p className="font-clash text-[14px] font-medium text-[#b1b3b6]">
            Tyto obchodní podmínky jsou platné a účinné od 1. 1. 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
