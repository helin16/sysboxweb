import { expect, test } from "@playwright/test";
import { mockExternalServices } from "./helpers";

// These checks don't depend on screen size, so run them once.
test.skip(({ isMobile }) => isMobile, "runs on desktop only");

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
});

const PAGES = [
  {
    path: "/",
    title: "Sysbox Digital | Websites, Custom Software & eCommerce",
    canonical: "https://sysbox.com.au/",
  },
  {
    path: "/contact",
    title: "Contact Sysbox Digital | Let’s Talk About Your Project",
    canonical: "https://sysbox.com.au/contact",
  },
];

for (const p of PAGES) {
  test(`${p.path} has a title, description, canonical link and share tags`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(p.title);
    const head = page.locator("head");
    const description = await head.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length).toBeGreaterThan(100);
    expect(description!.length).toBeLessThanOrEqual(160);
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute("href", p.canonical);
    await expect(head.locator('meta[property="og:url"]')).toHaveAttribute("content", p.canonical);
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute("content", p.title);
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://sysbox.com.au/og-image.png");
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
    // Exactly one main heading per page.
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });
}

test("every visible image has alt text (or is marked decorative)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#news li a")).toHaveCount(3);
  const missing = await page.$$eval("img", (imgs) =>
    imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc || i.src)
  );
  expect(missing).toEqual([]);
});

test("home page has valid structured data for the business", async ({ page }) => {
  await page.goto("/");
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw!);
  const org = data["@graph"].find((n: any) => n["@type"] === "Organization");
  expect(org.name).toBe("Sysbox Digital");
  expect(org.url).toBe("https://sysbox.com.au/");
  expect(org.logo.url).toBe("https://sysbox.com.au/images/logo-sysbox-digital.png");
});

test("the share image, logo, robots.txt and sitemap are served", async ({ request }) => {
  const og = await request.get("/og-image.png");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  const png = await og.body();
  // PNG header: width and height are big-endian at bytes 16 and 20.
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://sysbox.com.au/sitemap.xml");
  expect(robots).toContain("Disallow: /api/");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://sysbox.com.au/</loc>");
  expect(xml).toContain("<loc>https://sysbox.com.au/contact</loc>");
});
