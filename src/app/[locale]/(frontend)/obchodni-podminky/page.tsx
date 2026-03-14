import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.termsTitle"),
    description: t("metadata.termsDescription"),
  };
}

export default async function TermsOfServicePage() {
  const t = await getTranslations();

  return (
    <section className="bg-[#f0eff0] text-[#302e2f] py-20">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-clash text-[28px] lg:text-[40px] font-bold leading-tight mb-12">
            {t("legal.terms.title")}
          </h1>

          {/* 1. Úvodní ustanovení */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s1Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s1p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s1p2")}
            </p>
          </div>

          {/* 2. Objednávka a rezervace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s2Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s2p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 mb-4">
              <li>{t("legal.terms.s2l1")}</li>
              <li>{t("legal.terms.s2l2")}</li>
              <li>{t("legal.terms.s2l3")}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s2p2")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s2p3")}
            </p>
          </div>

          {/* 3. Ceny a platby */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s3Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s3p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s3p2")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s3p3")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t("legal.terms.s3l1")}</li>
              <li>{t("legal.terms.s3l2")}</li>
              <li>{t("legal.terms.s3l3")}</li>
            </ul>
          </div>

          {/* 4. Zrušení a změna rezervace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s4Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s4p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s4p2")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s4p3")}
            </p>
          </div>

          {/* 5. Odpovědnost */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s5Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s5p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s5p2")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t("legal.terms.s5l1")}</li>
              <li>{t("legal.terms.s5l2")}</li>
              <li>{t("legal.terms.s5l3")}</li>
            </ul>
          </div>

          {/* 6. Reklamace */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s6Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s6p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s6p2")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 mb-4">
              <li>{t("legal.terms.s6l1")}</li>
              <li>{t("legal.terms.s6l2")}</li>
              <li>{t("legal.terms.s6l3")}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s6p3")}
            </p>
          </div>

          {/* 7. Ochrana osobních údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s7Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t.rich("legal.terms.s7p1", {
                link: (chunks) => (
                  <Link
                    href="/zasady-ochrany-osobnich-udaju"
                    className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          {/* 8. Závěrečná ustanovení */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.terms.s8Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s8p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s8p2")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.terms.s8p3")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s8p4")}
            </p>
          </div>

          <p className="font-clash text-[14px] font-medium text-[#b1b3b6]">
            {t("legal.terms.effectiveDate")}
          </p>
        </div>
      </div>
    </section>
  );
}
