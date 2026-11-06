"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks } from "@/content/site";
import { cn } from "@/lib/cn";
import { SoundToggle } from "@/components/sound/SoundToggle";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // Escape closes; page behind doesn't scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 inline-flex size-11 items-center justify-center"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-7">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-full bg-foreground transition-transform duration-300",
              open && "translate-y-1.5 rotate-45 bg-brand",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-full bg-foreground transition-transform duration-300",
              open && "-translate-y-1.5 -rotate-45 bg-brand",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-background px-6 pb-10 pt-28"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduceMotion ? 0 : 0.15 + i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => close(false)}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={cn(
                        "block py-2 font-display text-hero02 font-bold uppercase",
                        pathname === link.href ? "text-brand" : "text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <SoundToggle className="self-start" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
