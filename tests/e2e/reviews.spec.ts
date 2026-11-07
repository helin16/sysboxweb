import { expect, Page, test } from "@playwright/test";
import { isMobile, mockExternalServices } from "./helpers";

const carousel = (page: Page) => page.getByRole("region", { name: "Google reviews" });
const frontCard = (page: Page) => carousel(page).locator('> [aria-hidden="false"]');
const status = (page: Page) => page.locator("#testimonials .sr-only", { hasText: /^Review \d of \d$/ });

test.describe("with reviews", () => {
  test.beforeEach(async ({ page }) => {
    await mockExternalServices(page);
    await page.goto("/");
    await carousel(page).scrollIntoViewIfNeeded();
  });

  test("shows the Google rating summary and the first review in front", async ({ page }) => {
    const summary = page.locator("#testimonials a", { hasText: "reviews" });
    await expect(summary).toContainText("4.9");
    await expect(summary).toContainText("3 reviews");
    await expect(summary).toHaveAttribute("href", "https://maps.app.goo.gl/uXo4yhTZxRb5tQGp6");
    await expect(frontCard(page)).toContainText("Alice Nguyen");
    await expect(status(page)).toHaveText("Review 1 of 3");
  });

  test("draws stars to match the rating", async ({ page }) => {
    // 16px stars with a 3px gap: 4.9 stars = 19 * 4.9 = 93.1px wide.
    const width = await page
      .locator("#testimonials a .google-review-stars")
      .evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeCloseTo(93.1, 0);
  });

  test("arrow buttons move the cards", async ({ page }) => {
    await page.getByRole("button", { name: "Move reviews right" }).click();
    await expect(frontCard(page)).toContainText("Chloe Smith");
    await page.getByRole("button", { name: "Move reviews left" }).click();
    await page.getByRole("button", { name: "Move reviews left" }).click();
    await expect(frontCard(page)).toContainText("Ben Carter");
    await expect(status(page)).toHaveText("Review 2 of 3");
  });

  test("keyboard arrows move the cards", async ({ page }) => {
    await carousel(page).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(frontCard(page)).toContainText("Ben Carter");
    await page.keyboard.press("ArrowRight");
    await expect(frontCard(page)).toContainText("Alice Nguyen");
  });

  test("dots jump straight to a review", async ({ page }) => {
    const dot = page.getByRole("button", { name: "Show review by Chloe Smith" });
    await dot.click();
    await expect(frontCard(page)).toContainText("Chloe Smith");
    await expect(dot).toHaveClass(/bg-blue-600/);
  });

  test("cards can be dragged sideways", async ({ page }, info) => {
    test.skip(isMobile(info), "mouse dragging is a desktop interaction");
    const box = (await carousel(page).boundingBox())!;
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.7, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.45, y, { steps: 8 });
    await page.mouse.move(box.x + box.width * 0.3, y, { steps: 8 });
    await page.mouse.up();
    await expect(frontCard(page)).toContainText("Ben Carter");
  });

  test("animates the move rather than jumping", async ({ page }) => {
    const first = carousel(page).locator("> div").first();
    await page.getByRole("button", { name: "Move reviews right" }).click();
    // Part-way through the glide the old front card is fading, not gone.
    await page.waitForTimeout(250);
    const opacity = Number(await first.evaluate((el) => (el as HTMLElement).style.opacity));
    expect(opacity).toBeGreaterThan(0.4);
    expect(opacity).toBeLessThan(1);
    await expect.poll(async () => Number(await first.evaluate((el) => (el as HTMLElement).style.opacity))).toBeCloseTo(0.45, 2);
  });
});

test("shows the fallback testimonial if reviews can't be loaded", async ({ page }) => {
  await mockExternalServices(page, { reviews: "error" });
  await page.goto("/");
  await expect(page.locator("#testimonials")).toContainText("Sysbox has been a game-changer for us");
  await expect(carousel(page)).toHaveCount(0);
});
