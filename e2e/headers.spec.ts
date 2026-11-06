import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

test("security headers are sent on every page", async ({ request }) => {
  for (const path of ["/", "/about", "/ingredients", "/used-by"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const h = res.headers();
    expect(h["content-security-policy"], path).toContain("default-src 'self'");
    expect(h["content-security-policy"], path).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"], path).toBe("nosniff");
    expect(h["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(h["permissions-policy"], path).toContain("camera=()");
    expect(h["x-powered-by"], path).toBeUndefined();
  }
});

test("unknown pages show the themed 404", async ({ page }) => {
  const res = await gotoReady(page, "/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/you rode off the map/i);
  await page.getByRole("link", { name: "Back to base" }).click();
  await expect(page).toHaveURL("/");
});

test("sitemap lists the 4 pages and robots points to it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["", "/about", "/ingredients", "/used-by"]) {
    expect(sitemap).toContain(`<loc>https://monster-unleashed-concept.vercel.app${p}</loc>`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://monster-unleashed-concept.vercel.app/sitemap.xml");
});

test("share image renders", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("no Content-Security-Policy violations on any page", async ({ page }) => {
  const violations: string[] = [];
  page.on("console", (msg) => {
    if (/content security policy|refused to (load|execute|apply)/i.test(msg.text())) violations.push(msg.text());
  });
  for (const path of ["/", "/about", "/ingredients", "/used-by"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  expect(violations).toEqual([]);
});

test("no page errors (e.g. hydration mismatches), even on repeat visits", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  for (let visit = 0; visit < 2; visit++) {
    for (const path of ["/", "/about", "/ingredients", "/used-by", "/nope"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
  }
  expect(errors).toEqual([]);
});
