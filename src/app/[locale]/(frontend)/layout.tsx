import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import PopupBannerWrapper from "@/components/shared/PopupBannerWrapper";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      {/* Global decorative purple wave background — visible on all sections including footer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      >
        <Image
          src="/images/wave-bg.png"
          alt=""
          fill
          className="object-cover opacity-[0.08]"
          priority={false}
        />
      </div>
      <div className="relative z-[1] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {/* Popup banner modal — shows once per session */}
      <PopupBannerWrapper />
    </div>
  );
}
