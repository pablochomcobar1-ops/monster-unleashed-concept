import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

const PAGES = [
  { link: "About", path: "/about", h1: /born\s*loud/i },
  { link: "Ingredients", path: "/ingredients", h1: /what's\s*inside/i },
  { link: "Used By", path: "/used-by", h1: /the ones\s*who go/i },
  { link: "Home", path: "/", h1: /fear is optional/i },
];

test("the main nav reaches every page and the heading changes", async ({ page, isMobile }) => {
  test.skip(isMobile, "phones use the menu: covered by the mobile menu test");
  await gotoReady(page, "/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/fear is optional/i);

  for (const p of PAGES) {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: p.link, exact: true }).click();
    await expect(page).toHaveURL(p.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
    await expect(page.getByRole("navigation", { name: "Main" }).locator('[aria-current="page"]')).toHaveText(p.link);
  }
});

test("pick your beast: 3 answers give a flavour, Again restarts", async ({ page }) => {
  await gotoReady(page, "/#picker");
  const picker = page.locator("#picker");

  await picker.getByRole("button", { name: /2 am\. lights off\./i }).click();
  await picker.getByRole("button", { name: /zero\. keep it clean\./i }).click();
  await picker.getByRole("button", { name: /screens & stages/i }).click();

  const result = picker.getByRole("heading", { level: 3, name: /your beast:/i });
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  await expect(result).toHaveText(/ultra white|original|ultra paradise|mango loco|pipeline punch/i);

  const official = picker.getByRole("link", { name: /official site/i });
  await expect(official).toHaveAttribute("target", "_blank");

  await picker.getByRole("button", { name: "Again" }).click();
  await expect(picker.getByRole("heading", { level: 3, name: "WHEN DO YOU RIDE?" })).toBeFocused();
});

test("the hero button jumps to the picker", async ({ page }) => {
  await gotoReady(page, "/");
  await page.getByRole("link", { name: /pick your beast/i }).first().click();
  await expect(page.locator("#picker").getByRole("heading", { level: 2 })).toBeInViewport();
});

test("phone menu opens, navigates, and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone-only");
  await gotoReady(page, "/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const menu = page.getByRole("navigation", { name: "Mobile" });
  await expect(menu).toBeVisible();

  await menu.getByRole("link", { name: "Ingredients" }).click();
  await expect(page).toHaveURL("/ingredients");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/what's\s*inside/i);
  await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
});

test("world cards on Home open the right Used By section", async ({ page }) => {
  await gotoReady(page, "/");
  await page.getByRole("link", { name: /surf/i }).first().click();
  await expect(page).toHaveURL("/used-by#surf");
  await expect(page.locator("#surf")).toBeInViewport();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("all 5 flavours show as plain sections, nothing pinned", async ({ page }) => {
    await gotoReady(page, "/");
    await expect(page.locator('[data-pinned="true"]')).toHaveCount(0);
    const names = ["Original", "Ultra White", "Ultra Paradise", "Mango Loco", "Pipeline Punch"];
    for (const name of names) {
      const heading = page.getByRole("heading", { level: 2, name, exact: true });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
  });

  test("background stays still", async ({ page }) => {
    await gotoReady(page, "/");
    await expect(page.locator('[data-motion="off"]')).toHaveCount(1);
  });
});
