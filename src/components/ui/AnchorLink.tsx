"use client";

import { scrollToHash } from "@/lib/smoothScroll";

/**
 * A link to a section on the same page (href="#…").
 * It needs its own click handler: a tap made while the page is still starting up is
 * held by React and replayed only to React handlers, so a plain #link would be dropped.
 */
export function AnchorLink({ href, onClick, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (scrollToHash(href)) e.preventDefault();
      }}
      {...rest}
    />
  );
}
