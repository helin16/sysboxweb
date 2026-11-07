import { expect, test } from "@playwright/test";
import {
  hasHorizontalOverflow,
  loadAllImages,
  mockExternalServices,
  trackPageErrors,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
});

test("loads cleanly with the right title and hero", async ({ page }) => {
  const errors = trackPageErrors(page);
  await page.goto("/");
  await expect(page).toHaveTitle("Sysbox - make your ideas shine since 2017");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Make Your Ideas Shine");
  await expect(page.getByRole("region", { name: "Google reviews" })).toBeVisible();
  await expect(page.locator("#news").getByText("Read more").first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("shows the four headline stats", async ({ page }) => {
  await page.goto("/");
  for (const [value, label] of [
    ["15+", "Years Experience"],
    ["60+", "Happy Clients"],
    ["100+", "Projects Delivered"],
    ["99%", "Client Satisfaction"],
  ]) {
    const stat = page.getByText(value, { exact: true });
    await expect(stat).toBeVisible();
    await expect(stat.locator("..")).toContainText(label);
  }
});

test("has every section, in order", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main > [id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["about", "services", "our-work", "why-us", "testimonials", "news", "partners"]);
  await expect(page.getByRole("heading", { name: "Our Expertise" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "End-to-End Digital Solutions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest Work" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /A Long-Term Digital Partner/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latest News" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contact Us", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Partners", exact: true })).toBeVisible();
});

test("lists the eight portfolio projects, each opening its site in a new tab", async ({ page }) => {
  await page.goto("/");
  const tiles = page.locator("#our-work li a");
  await expect(tiles).toHaveCount(8);
  const hrefs = await tiles.evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  expect(hrefs).toEqual([
    "https://MIESoft.com.au/",
    "https://showmine.com.au/",
    "https://merp.com.au/",
    "https://shamrockpoly.com.au/",
    "https://xjslibrary.org.au",
    "https://snugglepotts.com.au",
    "https://happyseedselc.com.au/",
    "https://www.frenkenhomes.com.au/",
  ]);
  for (const tile of await tiles.all()) {
    await expect(tile).toHaveAttribute("target", "_blank");
  }
  await expect(page.locator("#our-work")).not.toContainText(/artchain|great oceania/i);
});

test("shows every image at its natural shape (nothing stretched)", async ({ page }) => {
  await page.goto("/");
  await loadAllImages(page);
  const distorted = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => getComputedStyle(img).objectFit !== "cover" && img.offsetWidth > 0)
      .map((img) => {
        const natural = img.naturalWidth / img.naturalHeight;
        const shown = img.offsetWidth / img.offsetHeight;
        return { src: img.currentSrc, off: Math.abs(shown - natural) / natural };
      })
      .filter((r) => r.off > 0.03)
  );
  expect(distorted).toEqual([]);
});

test("partner cards link to each partner in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("#partners a");
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute("href", /vultr\.com/);
  await expect(links.nth(1)).toHaveAttribute("href", /bluehost/);
  await expect(links.nth(2)).toHaveAttribute("href", "https://aws.amazon.com/");
});

test("footer has Quick Links and Contact, without an Our Work column", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("heading")).toHaveText(["Quick Links", "Contact"]);
  await expect(footer.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://www.facebook.com/sysboxteam/");
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://au.linkedin.com/company/sysbox");
  await expect(footer).toContainText("© Copyright Sysbox Pty Ltd");
});

test("uses the Sysbox Digital logo and favicon", async ({ page, request }) => {
  await page.goto("/");
  const logo = page.getByRole("banner").getByRole("img", { name: /Sysbox Digital/ });
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute("src", /logo-sysbox-digital\.png/);
  for (const href of ["/favicon.ico", "/favicon-32.png", "/icon-192.png", "/apple-touch-icon.png"]) {
    await expect(page.locator(`link[href="${href}"]`)).toHaveCount(1);
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test("never scrolls sideways", async ({ page }) => {
  await page.goto("/");
  await loadAllImages(page);
  expect(await hasHorizontalOverflow(page)).toBe(false);
});
