import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  /** Optional "back" link at the top */
  backLink?: { href: string; label: string };
  /** Additional content below the subtitle (e.g. badges, metadata) */
  children?: React.ReactNode;
};

/**
 * Shared dark hero section used across all subpages.
 * Matches the Figma pattern: dark bg (#302e2f) with bokeh circles and centered text.
 */
export default function PageHero({
  title,
  subtitle,
  backLink,
  children,
}: Props) {
  return (
    <section className="relative bg-[#302e2f] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#302e2f] to-[#1a1919]" />

      {/* Decorative bokeh circles */}
      <div className="absolute top-[40px] left-[15%] w-64 h-64 bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />
      <div className="absolute top-[-40px] right-[20%] w-64 h-64 bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-24 pb-8 lg:pt-28 lg:pb-10">
        {backLink && (
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-1 font-clash text-[14px] font-medium text-[#b1b3b6] hover:text-[#f0eff0] transition-colors mb-6"
          >
            <ChevronLeft className="size-4" />
            {backLink.label}
          </Link>
        )}

        <div className="text-center">
          <h1 className="font-clash text-[30px] lg:text-[48px] font-bold text-[#f0eff0] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-clash text-[18px] lg:text-[36px] font-medium text-[#f0eff0] mt-2 lg:mt-3 max-w-[960px] mx-auto leading-tight lg:leading-[40px]">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
