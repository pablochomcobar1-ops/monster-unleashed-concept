import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

const PAGES = ["/", "/about", "/ingredients", "/used-by", "/nope"];

/** Scrolls top to bottom so every scroll-revealed section is rendered, then back up. */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
}

for (const viewport of [
  { name: "tablet", width: 820, height: 1180 },
  { name: "default", width: 0, height: 0 },
]) {
  test.describe(`at ${viewport.name} size`, () => {
    if (viewport.width) test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const path of PAGES) {
      test(`${path}: no WCAG 2.2 AA violations`, async ({ page }) => {
        await gotoReady(page, path);
        await revealAll(page);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`,
        );
        expect(summary).toEqual([]);
      });

      test(`${path}: nothing wider than the screen`, async ({ page }) => {
        await gotoReady(page, path);
        await revealAll(page);
        const overflow = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          return {
            page: document.documentElement.scrollWidth - vw,
            offenders: [...document.querySelectorAll("body *")]
              .filter((el) => {
                const r = el.getBoundingClientRect();
                const style = getComputedStyle(el);
                // Decorative layers inside clipped containers don't cause sideways scrolling.
                return r.right > vw + 1 && style.position !== "fixed" && !el.closest("[aria-hidden='true'], .overflow-hidden, .overflow-x-auto");
              })
              .slice(0, 5)
              .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}`),
          };
        });
        expect(overflow.page, `page scrolls sideways; widest: ${overflow.offenders.join(", ")}`).toBeLessThanOrEqual(0);
      });
    }
  });
}

test("every link on every page goes somewhere real", async ({ page, request }) => {
  const seen = new Map<string, number>();
  for (const path of PAGES.slice(0, 4)) {
    await gotoReady(page, path);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(page.url()).origin) continue; // external: checked separately
      const key = url.pathname;
      if (!seen.has(key)) seen.set(key, (await request.get(key)).status());
      if (url.hash) {
        const target = await request.get(key).then((r) => r.text());
        expect(target, `${href} points to a missing #${url.hash.slice(1)}`).toContain(`id="${url.hash.slice(1)}"`);
      }
    }
  }
  const broken = [...seen].filter(([, status]) => status >= 400);
  expect(broken).toEqual([]);
});

test("external links all go to the official site and open safely", async ({ page }) => {
  for (const path of PAGES.slice(0, 4)) {
    await gotoReady(page, path);
    const external = await page.$$eval("a[href^='http']", (as) =>
      as
        .filter((a) => new URL((a as HTMLAnchorElement).href).origin !== location.origin)
        .map((a) => ({ href: (a as HTMLAnchorElement).href, target: a.getAttribute("target"), rel: a.getAttribute("rel") })),
    );
    for (const link of external) {
      expect(link.href).toMatch(/^https:\/\/(www\.)?(monsterenergy\.com|pexels\.com)\//);
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
    }
  }
});

test("keyboard focus brings the hidden header back", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav only");
  await gotoReady(page, "/about");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(600); // header slides away on scroll-down
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Ingredients" }).focus();
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Ingredients" })).toBeInViewport();
});

test("every button and standalone link is at least 24px tall (WCAG 2.2 target size)", async ({ page }) => {
  for (const path of PAGES.slice(0, 4)) {
    await gotoReady(page, path);
    const small = await page.$$eval("a[href], button", (els) =>
      els
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false; // hidden (e.g. the other layout)
          if (el.closest("p")) return false; // links inside a sentence are exempt
          if (el.textContent?.trim() === "Skip to content") return false; // visually hidden until focused
          return r.height < 24 || r.width < 24;
        })
        .map((el) => `${el.textContent?.trim().slice(0, 30)} (${Math.round(el.getBoundingClientRect().height)}px)`),
    );
    expect(small, path).toEqual([]);
  }
});

test("nothing scrolls by itself while a page loads (it would break the LCP speed metric)", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __scrolls: string[] }).__scrolls = [];
    addEventListener(
      "scroll",
      (e) => {
        const t = e.target as Element | Document;
        (window as unknown as { __scrolls: string[] }).__scrolls.push(t === document ? "page" : (t as Element).tagName);
      },
      true,
    );
  });
  for (const path of PAGES.slice(0, 4)) {
    await gotoReady(page, path);
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => (window as unknown as { __scrolls: string[] }).__scrolls), path).toEqual([]);
  }
});
