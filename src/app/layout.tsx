import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { SoundProvider } from "@/components/sound/SoundProvider";
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
  title: {
    default: "Monster Unleashed (concept)",
    template: "%s — Monster Unleashed (concept)",
  },
  description:
    "An unofficial concept redesign by Pablo Chomcobar. Not affiliated with Monster Energy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <SoundProvider>
          <SkipLink />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}
