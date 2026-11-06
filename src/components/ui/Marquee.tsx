/** Endless scrolling strip of words. Stops (and shows one static row) with reduced motion. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 font-display text-heading01 font-bold uppercase whitespace-nowrap">
          {item}
          <span aria-hidden="true" className="text-brand">
            ✕
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-border-subtle bg-background-secondary py-6">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
