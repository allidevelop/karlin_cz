import type { Metadata } from "next";

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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
