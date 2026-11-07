import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow, mockExternalServices, trackPageErrors } from "./helpers";
import { SERVICES } from "../../src/components/services";

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
});

for (const service of SERVICES) {
  test(`${service.title} page loads with its own SEO details`, async ({ page }) => {
    const errors = trackPageErrors(page);
    const response = await page.goto(`/services/${service.slug}`);
    expect(response!.status()).toBe(200);
    await expect(page).toHaveTitle(service.metaTitle);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(service.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://sysbox.com.au/services/${service.slug}`
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", service.metaDescription);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(ld["@graph"][0]["@type"]).toBe("Service");
    await expect(page.locator("#included li")).toHaveCount(service.includes.length);
    await expect(page.locator("#work li a")).toHaveCount(8);
    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(errors).toEqual([]);
  });
}

test("an unknown service shows the 404 page", async ({ page }) => {
  const response = await page.goto("/services/not-a-service");
  expect(response!.status()).toBe(404);
});

test("moves between services, and back to the home page via the breadcrumb", async ({ page }) => {
  await page.goto("/services/web-development");
  await page.locator("#other-services").getByRole("link", { name: "SEO & Online Growth" }).click();
  await expect(page).toHaveURL(/\/services\/seo$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("SEO & Online Growth");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.locator("#services").getByRole("heading", { level: 2 })).toBeInViewport();
});

test("Get in Touch on a service page opens the contact page", async ({ page }) => {
  await page.goto("/services/ecommerce");
  await page.getByRole("main").getByRole("link", { name: "Get in Touch" }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
});

test("What's included shows two per row on phones and three on laptops", async ({ page, isMobile }) => {
  await page.goto("/services/custom-software");
  const tops = await page.$$eval("#included li", (els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  const perRow = tops.filter((t) => t === tops[0]).length;
  expect(perRow).toBe(isMobile ? 2 : 3);
});
