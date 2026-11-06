import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Off the map",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-dvh max-w-[1440px] flex-col justify-center gap-8 px-6 pt-24 md:px-14">
      <p className="font-display text-caption01 uppercase tracking-[0.35em] text-foreground-subtle">Error 404</p>
      <h1 className="font-display text-hero02 font-bold uppercase">
        You rode off <span className="text-brand">the map.</span>
      </h1>
      <p className="max-w-md text-body01 text-foreground-secondary">
        This trail doesn&apos;t exist. Turn around before the battery dies.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-12 w-fit items-center rounded-pill bg-brand px-7 font-display text-body02 font-semibold uppercase tracking-[0.15em] text-background transition-colors hover:bg-brand-accent"
      >
        Back to base
      </Link>
    </section>
  );
}
