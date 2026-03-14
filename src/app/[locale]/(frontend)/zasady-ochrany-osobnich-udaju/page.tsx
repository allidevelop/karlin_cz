import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.privacyTitle"),
    description: t("metadata.privacyDescription"),
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations();

  const richB = { b: (chunks: React.ReactNode) => <strong>{chunks}</strong> };

  return (
    <section className="bg-[#f0eff0] text-[#302e2f] py-20">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-8">
        <div className="max-w-[900px] mx-auto">
          <h1 className="font-clash text-[28px] lg:text-[40px] font-bold leading-tight mb-12">
            {t("legal.privacy.title")}
          </h1>

          {/* 1. Úvod */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s1Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s1p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.privacy.s1p2")}
            </p>
          </div>

          {/* 2. Správce osobních údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s2Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s2p1")}
            </p>
            <div className="font-clash text-[16px] font-medium leading-relaxed bg-white rounded-xl p-6 space-y-1">
              <p className="font-bold">AUTOMYČKA KARLÍN</p>
              <p>{t("common.address")}</p>
              <p className="mt-2">
                IČO: 12345678 {/* placeholder */}
              </p>
              <p>
                {t("contact.emailLabel")}:{" "}
                <a
                  href={`mailto:${t("common.email")}`}
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  {t("common.email")}
                </a>
              </p>
              <p>
                {t("contact.phoneLabel")}:{" "}
                <a
                  href="tel:+420775009033"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  {t("common.phone")}
                </a>
              </p>
            </div>
          </div>

          {/* 3. Účel zpracování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s3Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s3p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s3l1", richB)}</li>
              <li>{t.rich("legal.privacy.s3l2", richB)}</li>
              <li>{t.rich("legal.privacy.s3l3", richB)}</li>
              <li>{t.rich("legal.privacy.s3l4", richB)}</li>
              <li>{t.rich("legal.privacy.s3l5", richB)}</li>
            </ul>
          </div>

          {/* 4. Právní základ zpracování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s4Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s4p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s4l1", richB)}</li>
              <li>{t.rich("legal.privacy.s4l2", richB)}</li>
              <li>{t.rich("legal.privacy.s4l3", richB)}</li>
              <li>{t.rich("legal.privacy.s4l4", richB)}</li>
            </ul>
          </div>

          {/* 5. Doba uchování */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s5Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s5p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s5l1", richB)}</li>
              <li>{t.rich("legal.privacy.s5l2", richB)}</li>
              <li>{t.rich("legal.privacy.s5l3", richB)}</li>
              <li>{t.rich("legal.privacy.s5l4", richB)}</li>
            </ul>
          </div>

          {/* 6. Příjemci údajů */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s6Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s6p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s6l1", richB)}</li>
              <li>{t.rich("legal.privacy.s6l2", richB)}</li>
              <li>{t.rich("legal.privacy.s6l3", richB)}</li>
              <li>{t.rich("legal.privacy.s6l4", richB)}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              {t("legal.privacy.s6p2")}
            </p>
          </div>

          {/* 7. Vaše práva */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s7Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s7p1")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s7l1", richB)}</li>
              <li>{t.rich("legal.privacy.s7l2", richB)}</li>
              <li>{t.rich("legal.privacy.s7l3", richB)}</li>
              <li>{t.rich("legal.privacy.s7l4", richB)}</li>
              <li>{t.rich("legal.privacy.s7l5", richB)}</li>
              <li>{t.rich("legal.privacy.s7l6", richB)}</li>
              <li>{t.rich("legal.privacy.s7l7", richB)}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              {t("legal.privacy.s7p2")}
            </p>
          </div>

          {/* 8. Cookies */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s8Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s8p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s8p2")}
            </p>
            <ul className="font-clash text-[16px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2">
              <li>{t.rich("legal.privacy.s8l1", richB)}</li>
              <li>{t.rich("legal.privacy.s8l2", richB)}</li>
              <li>{t.rich("legal.privacy.s8l3", richB)}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed mt-4">
              {t("legal.privacy.s8p3")}
            </p>
          </div>

          {/* 9. Kontakt */}
          <div className="mb-10">
            <h2 className="font-clash text-[24px] font-bold mb-4">
              {t("legal.privacy.s9Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-4">
              {t("legal.privacy.s9p1")}
            </p>
            <div className="font-clash text-[16px] font-medium leading-relaxed bg-white rounded-xl p-6 space-y-1">
              <p className="font-bold">AUTOMYČKA KARLÍN</p>
              <p>
                {t("contact.emailLabel")}:{" "}
                <a
                  href={`mailto:${t("common.email")}`}
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  {t("common.email")}
                </a>
              </p>
              <p>
                {t("contact.phoneLabel")}:{" "}
                <a
                  href="tel:+420775009033"
                  className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
                >
                  {t("common.phone")}
                </a>
              </p>
              <p>{t("common.address")}</p>
            </div>
          </div>

          <p className="font-clash text-[14px] font-medium text-[#b1b3b6]">
            {t("legal.privacy.effectiveDate")}
          </p>
        </div>
      </div>
    </section>
  );
}
