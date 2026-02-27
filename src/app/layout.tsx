import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3231'),
  title: {
    default: 'Automyčka Karlín | Profesionální ruční mytí aut Praha',
    template: '%s | Automyčka Karlín',
  },
  description:
    'Profesionální ruční mytí a detailing vozidel v Praze Karlíně. Expresní mytí, kompletní péče, keramický coating. Online rezervace.',
  keywords: [
    'automyčka',
    'ruční mytí',
    'Praha',
    'Karlín',
    'detailing',
    'keramický coating',
    'mytí aut',
    'autopéče',
  ],
  authors: [{ name: 'Automyčka Karlín' }],
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    siteName: 'Automyčka Karlín',
    title: 'Automyčka Karlín | Profesionální ruční mytí aut Praha',
    description:
      'Profesionální ruční mytí a detailing vozidel v Praze Karlíně.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${clashDisplay.variable} bg-brand-black text-brand-white font-clash antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
