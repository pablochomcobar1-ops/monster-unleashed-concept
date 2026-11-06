import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "The attitude behind the beast: no fear, no brakes. An unofficial concept redesign by Pablo Chomcobar.",
};

const chapters = [
  {
    n: "01",
    title: "The attitude",
    body: "Some people check the forecast. Others check the swell, the dirt, the ramp. This is for the second kind: the ones who'd rather fall trying than watch from the fence.",
  },
  {
    n: "02",
    title: "The claw",
    body: "Three marks. Torn, not printed. The claw is what's left behind when something wild has been through. On a can, on a helmet, on a stage at 2 AM.",
  },
  {
    n: "03",
    title: "No fear",
    body: "Not no fear of anything. No fear of starting, of looking stupid, of the first drop. Respect the line, wear the helmet, then send it.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Manifesto */}
      <section className="mx-auto flex min-h-[88dvh] max-w-[1440px] flex-col justify-end gap-8 px-6 pb-16 pt-32 md:px-14">
        <Reveal>
          <p className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">About the beast</p>
        </Reveal>
        <h1 className="font-display text-hero01 font-bold uppercase">
          <Reveal as="span" delay={0.05} className="block">
            Born
          </Reveal>
          <Reveal as="span" delay={0.12} className="block text-brand">
            loud.
          </Reveal>
        </h1>
        <Reveal delay={0.2} className="max-w-xl">
          <p className="text-body01 text-foreground-secondary">
            Not built for the couch. Built for the ones who ride first and think about it on the way home.
          </p>
        </Reveal>
      </section>

      <Marquee items={["No fear", "No brakes", "No limits", "Full send"]} />

      {/* Three chapters */}
      <section aria-label="The story" className="mx-auto max-w-[1440px] px-6 py-section md:px-14">
        <ol className="flex flex-col">
          {chapters.map((c, i) => (
            <li key={c.n} className="border-t border-border-subtle py-14 last:border-b md:py-20">
              <Reveal delay={i * 0.05} className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-14">
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-heading02 text-brand">{c.n}</span>
                  <h2 className="font-display text-heading01 font-bold uppercase md:text-hero02">{c.title}</h2>
                </div>
                <p className="max-w-2xl self-end text-body01 text-foreground-secondary md:text-heading03 md:leading-snug">
                  {c.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Concept note */}
      <section aria-labelledby="concept-title" className="mx-auto max-w-[1440px] px-6 pb-section md:px-14">
        <Reveal className="grid gap-8 rounded-[6px] border border-border-subtle bg-background-secondary p-8 md:grid-cols-[1fr_2fr] md:p-14">
          <h2 id="concept-title" className="font-display text-heading02 font-bold uppercase">
            About this <span className="text-brand">concept</span>
          </h2>
          <div className="flex flex-col gap-4 text-body01 text-foreground-secondary">
            <p className="text-foreground">{site.disclaimer}</p>
            <p>
              This is an unofficial portfolio project: a redesign of what a Monster site could feel like. It isn&apos;t
              made, approved or sponsored by Monster Energy. Product names and trademarks belong to their owners.
            </p>
            <p>
              Built with Next.js, Tailwind CSS, Three.js and GSAP. Photos and videos are free-licence stock, credited in
              the footer.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/ingredients"
                className="inline-flex min-h-12 items-center rounded-pill bg-brand px-6 font-display text-body02 font-semibold uppercase tracking-[0.15em] text-background transition-colors hover:bg-brand-accent"
              >
                See what&apos;s inside
              </Link>
              <a
                href={site.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-pill border border-foreground-subtle px-6 font-display text-body02 uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground"
              >
                Official Monster site
                <span className="sr-only">, opens in a new tab</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
