import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Shield } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import NewsletterSection from "@/components/home/NewsletterSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
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
    <>
      {/* Hero */}
      <PageHero
        title={t("legal.terms.title")}
        subtitle={t("legal.terms.subtitle")}
        backLink={{ href: "/", label: t("legal.terms.backToHome") }}
      >
        <div className="flex justify-center mt-6">
          <div className="w-14 h-14 rounded-full bg-[#7960a9]/20 flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#9b7ec4]" />
          </div>
        </div>
      </PageHero>

      {/* Content */}
      <section className="bg-[#f0eff0] text-[#302e2f] py-12 lg:py-16">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
          {/* Data Controller card */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.controllerTitle")}
            </h2>
            <p className="font-clash text-[16px] font-semibold leading-relaxed mb-2">
              {t("legal.terms.controllerName")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed text-[#302e2f]/80 space-y-1">
              <li>{t("legal.terms.controllerIco")}</li>
              <li>{t("legal.terms.controllerReg")}</li>
              <li>{t("legal.terms.controllerAddress")}</li>
              <li>{t("legal.terms.controllerEmail")}</li>
            </ul>
          </div>

          {/* Section 1 — Purposes and Legal Grounds */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.s1Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.s1p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80">
              <li>{t("legal.terms.s1l1")}</li>
              <li>{t("legal.terms.s1l2")}</li>
              <li>{t("legal.terms.s1l3")}</li>
              <li>{t("legal.terms.s1l4")}</li>
            </ul>
          </div>

          {/* Section 2 — Methods and Means */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.s2Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.s2p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80 mb-4">
              <li>{t("legal.terms.s2l1")}</li>
              <li>{t("legal.terms.s2l2")}</li>
              <li>{t("legal.terms.s2l3")}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s2p2")}
            </p>
          </div>

          {/* Section 3 — Categories of Recipients */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.s3Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.s3p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80 mb-4">
              <li>{t("legal.terms.s3l1")}</li>
              <li>{t("legal.terms.s3l2")}</li>
              <li>{t("legal.terms.s3l3")}</li>
              <li>{t("legal.terms.s3l4")}</li>
            </ul>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.s3p2")}
            </p>
          </div>

          {/* Rights intro */}
          <div className="bg-[#7960a9]/10 rounded-[10px] border border-[#7960a9]/20 p-6 lg:p-8">
            <p className="font-clash text-[16px] font-semibold leading-relaxed text-[#302e2f]">
              {t("legal.terms.rightsIntro")}
            </p>
          </div>

          {/* Right 1 — Access */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r1Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.r1p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80">
              <li>{t("legal.terms.r1l1")}</li>
              <li>{t("legal.terms.r1l2")}</li>
              <li>{t("legal.terms.r1l3")}</li>
              <li>{t("legal.terms.r1l4")}</li>
              <li>{t("legal.terms.r1l5")}</li>
            </ul>
          </div>

          {/* Right 2 — Rectification */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r2Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.r2p1")}
            </p>
          </div>

          {/* Right 3 — Erasure */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r3Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.r3p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80">
              <li>{t("legal.terms.r3l1")}</li>
              <li>{t("legal.terms.r3l2")}</li>
              <li>{t("legal.terms.r3l3")}</li>
              <li>{t("legal.terms.r3l4")}</li>
            </ul>
          </div>

          {/* Right 4 — Restriction */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r4Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.r4p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80">
              <li>{t("legal.terms.r4l1")}</li>
              <li>{t("legal.terms.r4l2")}</li>
              <li>{t("legal.terms.r4l3")}</li>
              <li>{t("legal.terms.r4l4")}</li>
            </ul>
          </div>

          {/* Right 5 — Portability */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r5Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.r5p1")}
            </p>
          </div>

          {/* Right 6 — Object */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r6Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.r6p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed list-disc list-inside space-y-2 ml-2 text-[#302e2f]/80">
              <li>{t("legal.terms.r6l1")}</li>
              <li>{t("legal.terms.r6l2")}</li>
            </ul>
          </div>

          {/* Right 7 — Withdraw Consent */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r7Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.r7p1")}
            </p>
          </div>

          {/* Right 8 — Filing a Complaint */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r8Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-3">
              {t("legal.terms.r8p1")}
            </p>
            <p className="font-clash text-[16px] font-medium leading-relaxed">
              {t("legal.terms.r8p2")}
            </p>
          </div>

          {/* Right 9 — Contact */}
          <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
            <h2 className="font-clash text-[20px] lg:text-[24px] font-bold mb-4">
              {t("legal.terms.r9Title")}
            </h2>
            <p className="font-clash text-[16px] font-medium leading-relaxed mb-2">
              {t("legal.terms.r9p1")}
            </p>
            <ul className="font-clash text-[15px] font-medium leading-relaxed space-y-1 text-[#302e2f]/80">
              <li>{t("legal.terms.r9Email")}</li>
              <li>{t("legal.terms.r9Address")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}
