import type { Metadata } from "next";
import { flavors } from "@/content/flavors";
import { ingredients } from "@/content/ingredients";
import { StatStrip } from "@/components/ingredients/StatStrip";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "What's inside each can, in plain words: caffeine, taurine, B-vitamins and more, plus the label numbers for every flavour.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function IngredientsPage() {
  const anyMissing = flavors.some((f) => f.caffeineMg === null || f.sugarG === null || f.kcal === null);

  return (
    <>
      {/* Intro */}
      <section className="mx-auto flex min-h-[70dvh] max-w-[1440px] flex-col justify-end gap-8 px-6 pb-16 pt-32 md:px-14">
        <Reveal>
          <p className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">Ingredients</p>
        </Reveal>
        <h1 className="font-display text-hero01 font-bold uppercase">
          <Reveal as="span" delay={0.05} className="block">
            What&apos;s
          </Reveal>
          <Reveal as="span" delay={0.12} className="block text-brand">
            inside.
          </Reveal>
        </h1>
        <Reveal delay={0.2} className="max-w-xl">
          <p className="text-body01 text-foreground-secondary">
            No magic. Just a label. Here&apos;s what&apos;s on it, in plain words.
          </p>
        </Reveal>
      </section>

      {/* The blend */}
      <section aria-labelledby="blend-title" className="mx-auto max-w-[1440px] px-6 py-section md:px-14">
        <Reveal className="mb-10 flex flex-col gap-3">
          <h2 id="blend-title" className="font-display text-heading01 font-bold uppercase">
            The blend
          </h2>
          <p className="max-w-xl text-body02 text-foreground-secondary">
            The main ingredients listed on the can. Amounts vary by flavour.
          </p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <li key={ing.id}>
              <Reveal delay={(i % 3) * 0.08} className="group flex h-full flex-col gap-5 rounded-[6px] border border-border-subtle bg-background-secondary p-7 transition-colors hover:border-brand">
                <span className="font-display text-caption01 tracking-[0.3em] text-brand">{pad(i + 1)}</span>
                <h3 className="font-display text-heading02 font-bold uppercase">{ing.name}</h3>
                <p className="text-body02 text-foreground-secondary">{ing.what}</p>
                <p className="mt-auto border-t border-border-subtle pt-4 text-caption01 uppercase tracking-[0.2em] text-foreground-subtle">
                  Also in: <span className="text-foreground-secondary">{ing.alsoIn}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Per-flavour numbers */}
      <section aria-labelledby="numbers-title" className="mx-auto max-w-[1440px] px-6 py-section md:px-14">
        <Reveal className="mb-10 flex flex-col gap-3">
          <h2 id="numbers-title" className="font-display text-heading01 font-bold uppercase">
            By the <span className="text-brand">numbers</span>
          </h2>
          {anyMissing && (
            <p className="max-w-xl text-body02 text-foreground-secondary">
              A dash means the number hasn&apos;t been confirmed from the can label yet.
            </p>
          )}
        </Reveal>
        <ul className="flex flex-col">
          {flavors.map((f) => (
            <li key={f.id} id={f.id} className="scroll-mt-24 border-t border-border-subtle py-10 last:border-b">
              <Reveal className="grid items-center gap-6 md:grid-cols-[1fr_1.4fr] md:gap-14">
                <div className="flex items-center gap-5">
                  <span aria-hidden="true" className="h-16 w-2 rounded-full" style={{ background: f.color }} />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-heading01 font-bold uppercase">{f.name}</h3>
                    <p className="text-caption01 uppercase tracking-[0.25em] text-foreground-subtle">
                      {f.sugarFree ? "Zero sugar" : "Full sugar"}
                    </p>
                  </div>
                </div>
                <StatStrip flavor={f} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Responsible use */}
      <section aria-labelledby="responsible-title" className="mx-auto max-w-[1440px] px-6 pb-section md:px-14">
        <Reveal className="grid gap-8 rounded-[6px] border border-brand/40 bg-background-secondary p-8 md:grid-cols-[1fr_2fr] md:p-14">
          <h2 id="responsible-title" className="font-display text-heading02 font-bold uppercase">
            Ride smart. <span className="text-brand">Drink smart.</span>
          </h2>
          <ul className="flex flex-col gap-4 text-body01 text-foreground-secondary">
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-brand">✕</span>
              Not for anyone under 18, or for pregnant or breastfeeding people.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-brand">✕</span>
              Not for people who are sensitive to caffeine.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-brand">✕</span>
              Watch your daily caffeine. Coffee, tea and other drinks all add up.
            </li>
            <li className="flex gap-3">
              <span aria-hidden="true" className="text-brand">✕</span>
              Don&apos;t mix it with alcohol. Always read the label on the can.
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
