import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";
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
    title: t("metadata.privacyTitle"),
    description: t("metadata.privacyDescription"),
  };
}

/* ── Reusable card wrapper ─────────────────────────────────── */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#b1b3b6]/30 shadow-sm p-6 lg:p-8">
      {children}
    </div>
  );
}

/* ── Bullet list ───────────────────────────────────────────── */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="font-clash text-[15px] lg:text-[16px] font-medium leading-relaxed list-disc list-outside ml-5 space-y-1.5 text-[#302e2f]/85">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/* ── Paragraph ─────────────────────────────────────────────── */
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-clash text-[15px] lg:text-[16px] font-medium leading-relaxed text-[#302e2f]/85">
      {children}
    </p>
  );
}

/* ── Section title inside card ─────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f] mb-4">
      {children}
    </h2>
  );
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <PageHero
        title={t("legal.privacy.title")}
        subtitle={t("legal.privacy.subtitle")}
      >
        <div className="flex justify-center mt-6">
          <div className="w-14 h-14 rounded-full bg-[#7960a9]/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#9b7ec4]" />
          </div>
        </div>
      </PageHero>

      {/* ── Content ───────────────────────────────────────── */}
      <section className="bg-[#f0eff0] py-12 lg:py-16">
        <div className="max-w-[1536px] mx-auto px-4 lg:px-8">
          <div className="max-w-[900px] mx-auto">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-clash text-[14px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mb-8"
            >
              <ChevronLeft className="size-4" />
              {t("legal.privacy.backButton")}
            </Link>

            <div className="flex flex-col gap-5">
              {/* ── About us card ─────────────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.aboutTitle")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.aboutP1")}</P>
                  <P>{t("legal.privacy.aboutP2")}</P>
                </div>
              </Card>

              {/* ── 1. General information ────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s1Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s1p1")}</P>
                  <P>{t("legal.privacy.s1p2")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s1l1"),
                      t("legal.privacy.s1l2"),
                      t("legal.privacy.s1l3"),
                      t("legal.privacy.s1l4"),
                    ]}
                  />
                  <P>{t("legal.privacy.s1p3")}</P>
                  <P>{t("legal.privacy.s1p4")}</P>
                </div>
              </Card>

              {/* ── 2. General provisions ─────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s2Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s2p1")}</P>
                  <P>{t("legal.privacy.s2p2")}</P>
                  <P>{t("legal.privacy.s2p3")}</P>
                </div>
              </Card>

              {/* ── 3. Information we collect ─────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s3Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s3p1")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s3l1"),
                      t("legal.privacy.s3l2"),
                      t("legal.privacy.s3l3"),
                      t("legal.privacy.s3l4"),
                      t("legal.privacy.s3l5"),
                      t("legal.privacy.s3l6"),
                      t("legal.privacy.s3l7"),
                      t("legal.privacy.s3l8"),
                      t("legal.privacy.s3l9"),
                    ]}
                  />
                  <P>{t("legal.privacy.s3p2")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s3l10"),
                      t("legal.privacy.s3l11"),
                      t("legal.privacy.s3l12"),
                      t("legal.privacy.s3l13"),
                      t("legal.privacy.s3l14"),
                      t("legal.privacy.s3l15"),
                      t("legal.privacy.s3l16"),
                      t("legal.privacy.s3l17"),
                      t("legal.privacy.s3l18"),
                      t("legal.privacy.s3l19"),
                    ]}
                  />
                  <P>{t("legal.privacy.s3p3")}</P>
                  <P>{t("legal.privacy.s3p4")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s3l20"),
                      t("legal.privacy.s3l21"),
                      t("legal.privacy.s3l22"),
                      t("legal.privacy.s3l23"),
                      t("legal.privacy.s3l24"),
                      t("legal.privacy.s3l25"),
                      t("legal.privacy.s3l26"),
                      t("legal.privacy.s3l27"),
                      t("legal.privacy.s3l28"),
                    ]}
                  />
                </div>
              </Card>

              {/* ── 4. Data storage and protection ────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s4Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s4p1")}</P>
                  <P>{t("legal.privacy.s4p2")}</P>
                  <p className="font-clash text-[15px] lg:text-[16px] font-bold text-[#302e2f] mt-2">
                    {t("legal.privacy.s4p3")}
                  </p>
                  <BulletList
                    items={[
                      t("legal.privacy.s4l1"),
                      t("legal.privacy.s4l2"),
                      t("legal.privacy.s4l3"),
                      t("legal.privacy.s4l4"),
                      t("legal.privacy.s4l5"),
                      t("legal.privacy.s4l6"),
                    ]}
                  />
                </div>
              </Card>

              {/* ── 5. Access to personal information ─────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s5Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s5p1")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s5l1"),
                      t("legal.privacy.s5l2"),
                      t("legal.privacy.s5l3"),
                      t("legal.privacy.s5l4"),
                      t("legal.privacy.s5l5"),
                    ]}
                  />
                  <P>{t("legal.privacy.s5p2")}</P>
                </div>
              </Card>

              {/* ── 6. Deletion and updating ──────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s6Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s6p1")}</P>
                  <P>{t("legal.privacy.s6p2")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s6l1"),
                      t("legal.privacy.s6l2"),
                      t("legal.privacy.s6l3"),
                      t("legal.privacy.s6l4"),
                    ]}
                  />
                </div>
              </Card>

              {/* ── 7. Data recipients ────────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s7Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s7p1")}</P>
                  <P>{t("legal.privacy.s7p2")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s7l1"),
                      t("legal.privacy.s7l2"),
                      t("legal.privacy.s7l3"),
                      t("legal.privacy.s7l4"),
                    ]}
                  />
                  <P>{t("legal.privacy.s7p3")}</P>
                  <BulletList
                    items={[
                      t("legal.privacy.s7l5"),
                      t("legal.privacy.s7l6"),
                      t("legal.privacy.s7l7"),
                      t("legal.privacy.s7l8"),
                    ]}
                  />
                </div>
              </Card>

              {/* ── 8. Scope of application ───────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s8Title")}</SectionTitle>
                <P>{t("legal.privacy.s8p1")}</P>
              </Card>

              {/* ── 9. Cookies ────────────────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s9Title")}</SectionTitle>
                <P>{t("legal.privacy.s9p1")}</P>
              </Card>

              {/* ── 10. Policy compliance ─────────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s10Title")}</SectionTitle>
                <div className="space-y-3">
                  <P>{t("legal.privacy.s10p1")}</P>
                  <P>{t("legal.privacy.s10p2")}</P>
                </div>
              </Card>

              {/* ── 11. Changes to the policy ─────────────── */}
              <Card>
                <SectionTitle>{t("legal.privacy.s11Title")}</SectionTitle>
                <P>{t("legal.privacy.s11p1")}</P>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}
