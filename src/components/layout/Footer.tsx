import Link from "next/link";
import { credits } from "@/content/credits";
import { navLinks, site } from "@/content/site";

export function Footer() {
  const author = site.portfolioUrl ? (
    <a href={site.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:text-brand hover:underline">
      {site.author}
    </a>
  ) : (
    <span className="text-foreground">{site.author}</span>
  );

  return (
    <footer className="border-t border-border-subtle bg-background">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-14">
        <div className="flex flex-col gap-5">
          <p className="font-display text-heading01 font-bold uppercase leading-none">
            Unleash <span className="text-brand">the beast.</span>
          </p>
          <p className="max-w-md text-body02 text-foreground-secondary">
            Concept by {author}. Not affiliated with Monster Energy.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-4 text-caption01 uppercase tracking-[0.25em] text-foreground-subtle">Explore</h2>
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1.5 text-body02 text-foreground-secondary hover:text-brand">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 text-body02 text-foreground-secondary hover:text-brand">
                Official Monster site (opens in new tab)
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-caption01 uppercase tracking-[0.25em] text-foreground-subtle">Credits</h2>
          {credits.length === 0 ? (
            <p className="text-body02 text-foreground-subtle">Photo and video credits appear here.</p>
          ) : (
            <ul className="flex flex-col text-body02 text-foreground-secondary">
              {credits.map((c) => (
                <li key={c.url}>
                  {c.usedFor}:{" "}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 hover:text-brand">
                    {c.who} / {c.source}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
