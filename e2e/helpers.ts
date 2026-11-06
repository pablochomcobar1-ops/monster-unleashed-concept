import { expect, type Page } from "@playwright/test";

/**
 * Opens a page and waits until it's interactive (React has started and set html[data-ready]).
 * Clicking earlier than that tests the browser's startup, not our site.
 */
export async function gotoReady(page: Page, path: string) {
  const res = await page.goto(path);
  await expect(page.locator("html[data-ready='true']")).toHaveCount(1, { timeout: 15_000 });
  return res;
}
