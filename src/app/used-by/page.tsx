import type { Metadata } from "next";
import { worlds } from "@/content/worlds";
import { GlitchTitle } from "@/components/media/GlitchTitle";
import { LoopVideo } from "@/components/media/LoopVideo";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Used By",
  description: "Motocross, skate, BMX, surf, esports and music: the worlds where the beast runs.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function UsedByPage() {
  return (
    <>
      {/* Intro */}
      <section className="mx-auto flex min-h-[70dvh] max-w-[1440px] flex-col justify-end gap-8 px-6 pb-16 pt-32 md:px-14">
        <Reveal>
          <p className="text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">Used by</p>
        </Reveal>
        <h1 className="font-display text-hero01 font-bold uppercase">
          <Reveal as="span" delay={0.05} className="block">
            The ones
          </Reveal>
          <Reveal as="span" delay={0.12} className="block text-brand">
            who go.
          </Reveal>
        </h1>
        <Reveal delay={0.2}>
          <nav aria-label="Worlds">
            <ul className="flex flex-wrap gap-2">
              {worlds.map((w) => (
                <li key={w.id}>
                  <a
                    href={`#${w.id}`}
                    className="inline-flex min-h-11 items-center rounded-pill border border-foreground-subtle px-5 font-display text-caption01 uppercase tracking-[0.2em] text-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    {w.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </section>

      {/* One full-screen block per world */}
      {worlds.map((w, i) => (
        <section
          key={w.id}
          id={w.id}
          aria-labelledby={`${w.id}-title`}
          className="relative flex min-h-[92dvh] scroll-mt-0 items-end overflow-hidden border-t border-border-subtle"
        >
          <div className="absolute inset-0 -z-10">
            {w.video ? (
              <LoopVideo src={w.video} label={`${w.title} clip`} />
            ) : (
              <div
                aria-hidden="true"
                data-placeholder="video"
                className="relative h-full w-full bg-background-secondary"
              >
                <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgb(166_255_0/0.12),transparent_60%)]" />
                <span className="absolute -right-[4vw] top-1/2 -translate-y-1/2 select-none font-display text-[clamp(10rem,34vw,32rem)] font-bold leading-none text-transparent opacity-35 [-webkit-text-stroke:2px_var(--color-foreground-subtle)]">
                  {pad(i + 1)}
                </span>
              </div>
            )}
            {/* Keeps the text readable over any footage */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
          </div>

          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-6 pb-16 md:px-14 md:pb-24">
            <p className="font-display text-caption01 uppercase tracking-[0.35em] text-foreground-secondary">
              <span className="text-brand">{pad(i + 1)}</span> / {pad(worlds.length)}
            </p>
            <GlitchTitle className="font-display text-hero01 font-bold uppercase">
              <span id={`${w.id}-title`}>{w.title}</span>
            </GlitchTitle>
            <Reveal delay={0.1} className="flex max-w-2xl flex-col gap-4">
              <p className="text-body01 text-foreground-secondary md:text-heading03 md:leading-snug">{w.line}</p>
              <p className="font-display text-body01 uppercase tracking-[0.25em] text-brand">{w.stat}</p>
              {w.credit && <p className="text-caption02 text-foreground-subtle">Footage: {w.credit}</p>}
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
