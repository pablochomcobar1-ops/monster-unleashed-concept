export function SkipLink() {
  return (
    <a
      href="#main"
      className={[
        "sr-only focus:not-sr-only",
        "focus:fixed focus:left-4 focus:top-4 focus:z-50",
        "focus:bg-brand focus:px-5 focus:py-3 focus:text-background",
        "font-display text-caption01 uppercase tracking-[0.2em]",
      ].join(" ")}
    >
      Skip to content
    </a>
  );
}
