"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/cn";
import { SoundToggle } from "@/components/sound/SoundToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > lastY.current && y > 120);
    setScrolled(y > 24);
    lastY.current = y;
  });

  return (
    <motion.header
      // Keyboard users tabbing into a hidden header must see it.
      onFocusCapture={() => setHidden(false)}
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 md:px-14">
        <Link
          href="/"
          aria-label="Monster Unleashed, home"
          className="font-display text-heading03 font-bold uppercase tracking-[0.12em] text-brand"
        >
          Monster
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 font-display text-body02 uppercase tracking-[0.18em] transition-colors",
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-brand after:transition-transform after:duration-300",
                      active
                        ? "text-foreground after:scale-x-100"
                        : "text-foreground-secondary after:scale-x-0 hover:text-foreground hover:after:scale-x-100",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <SoundToggle className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
