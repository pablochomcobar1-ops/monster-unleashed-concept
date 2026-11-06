import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Atmosphere } from "@/components/background/Atmosphere";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SkipLink } from "@/components/layout/SkipLink";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { site } from "@/content/site";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Monster Unleashed (concept)",
    template: "%s — Monster Unleashed (concept)",
  },
  description:
    "An unofficial concept redesign by Pablo Chomcobar. Not affiliated with Monster Energy.",
  authors: [{ name: site.author }],
  openGraph: { type: "website", siteName: "Monster Unleashed (concept)", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Monster Unleashed (concept)",
  url: site.url,
  description: "An unofficial concept redesign. Not affiliated with Monster Energy.",
  creator: { "@type": "Person", name: site.author },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <script
          type="application/ld+json"
          // Static data from this file only, no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SoundProvider>
          <SkipLink />
          <Atmosphere />
          <SmoothScroll />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
