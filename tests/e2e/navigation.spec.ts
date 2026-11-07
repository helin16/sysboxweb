import { expect, test } from "@playwright/test";
import { mockExternalServices } from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
});

const HEADER_HEIGHT = 80;

/**
 * The section has scrolled to the top of the screen and its heading is fully
 * visible below the fixed header (not hidden behind it).
 */
const expectSectionAtTop = async (page: import("@playwright/test").Page, id: string) => {
  const section = page.locator(`#${id}`);
  await expect(section.getByRole("heading").first()).toBeVisible();
  await expect
    .poll(async () => Math.round((await section.boundingBox())!.y), { timeout: 5000 })
    .toBeLessThanOrEqual(HEADER_HEIGHT + 10);
  expect((await section.boundingBox())!.y).toBeGreaterThan(-10);
  const heading = (await section.getByRole("heading").first().boundingBox())!;
  expect(heading.y).toBeGreaterThanOrEqual(HEADER_HEIGHT);
};

test.describe("desktop menu", () => {
  test.skip(({ isMobile }) => isMobile, "desktop only");

  test("scrolls smoothly to each section and highlights it", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Global" });
    for (const [label, id] of [
      ["About", "about"],
      ["Services", "services"],
      ["Our Work", "our-work"],
      ["Testimonials", "testimonials"],
    ]) {
      await nav.getByText(label, { exact: true }).click();
      await expectSectionAtTop(page, id);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(nav.getByText(label, { exact: true })).toHaveClass(/text-blue-600/);
    }
    await nav.getByText("Home", { exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("adds a shadow to the header once the page scrolls", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveClass(/shadow-md/);
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveClass(/shadow-md/);
  });

  test("Contact and Get in Touch open the contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Global" }).getByText("Contact", { exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.goto("/");
    await page.getByRole("banner").getByRole("link", { name: "Get in Touch" }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("section links on the contact page go back to that home page section", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("navigation", { name: "Global" }).getByText("Our Work", { exact: true }).click();
    await expect(page).toHaveURL(/\/#our-work$/);
    await expectSectionAtTop(page, "our-work");
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("opens, jumps to a section and closes", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(page.getByRole("navigation", { name: "Global" }).getByText("Services")).toBeHidden();
    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    await menu.getByText("Testimonials").click();
    await expect(menu).toBeHidden();
    await expectSectionAtTop(page, "testimonials");
  });

  test("Close button hides the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });

  test("Get in Touch in the menu opens the contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-menu").getByRole("link", { name: "Get in Touch" }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});

test("hero buttons go to the contact page and the portfolio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "View Our Work" }).click();
  await expectSectionAtTop(page, "our-work");
  await page.getByRole("heading", { name: "Contact Us", exact: true }).scrollIntoViewIfNeeded();
  await page.locator("main").getByRole("link", { name: "Get in Touch" }).last().click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("logo returns to the home page", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("banner").getByRole("link", { name: /Sysbox/ }).first().click();
  await expect(page).toHaveURL(/\/$/);
});

test("service cards link to the contact page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Custom Software/ }).click();
  await expect(page).toHaveURL(/\/contact$/);
});
