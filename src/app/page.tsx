// Temporary home page: proves the tokens work. Replaced in Task 6.
export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col justify-center gap-6 px-6 md:px-14">
      <p className="text-caption01 uppercase tracking-[0.3em] text-foreground-subtle">
        Concept build · Task 1
      </p>
      <h1 className="font-display text-hero02 font-bold uppercase">
        Fear is <span className="text-brand">optional.</span>
      </h1>
      <p className="max-w-md text-body01 text-foreground-secondary">
        Tokens, fonts and tests are wired. The beast comes next.
      </p>
    </section>
  );
}
