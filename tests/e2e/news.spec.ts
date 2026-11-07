import { expect, test } from "@playwright/test";
import { mockExternalServices } from "./helpers";
import { NEWS_ITEMS } from "../fixtures/data";

test("shows the three latest posts as cards", async ({ page }) => {
  await mockExternalServices(page);
  await page.goto("/");
  const cards = page.locator("#news li a");
  await expect(cards).toHaveCount(3);
  await expect(cards.getByRole("heading")).toHaveText(NEWS_ITEMS.map((n) => n.title));
  const first = cards.first();
  await expect(first).toHaveAttribute("href", "https://r.showmine66.com/item/news-1");
  await expect(first).toHaveAttribute("target", "_blank");
  await expect(first.locator("time")).toHaveText("1 October 2026");
  // The excerpt is shown as plain text, not HTML.
  await expect(first.locator("p")).toHaveText("First paragraph. Second bold line.");
  await expect(first.locator("strong")).toHaveCount(0);
});

test("hides the news section if the blog is unavailable", async ({ page }) => {
  await mockExternalServices(page, { news: "error" });
  await page.goto("/");
  await expect(page.locator("#news")).toBeAttached();
  await expect(page.getByRole("heading", { name: "Latest News" })).toHaveCount(0);
});

test("hides the news section if there are no posts", async ({ page }) => {
  await mockExternalServices(page, { news: "empty" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Latest News" })).toHaveCount(0);
});
