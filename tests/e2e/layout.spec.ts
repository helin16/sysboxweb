import { expect, test } from "@playwright/test";
import { isMobile, mockExternalServices, rowTops } from "./helpers";

/** Group card top edges into rows and return how many cards each row has. */
const perRow = (tops: number[]) => {
  const rows = new Map<number, number>();
  tops.forEach((t) => {
    const key = Array.from(rows.keys()).find((k) => Math.abs(k - t) < 4) ?? t;
    rows.set(key, (rows.get(key) || 0) + 1);
  });
  return Array.from(rows.values());
};

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
  await page.goto("/");
  await expect(page.locator("#news li a")).toHaveCount(3);
});

test("services, portfolio and news show two per row on phones", async ({ page }, info) => {
  test.skip(!isMobile(info), "phone layout");
  expect(perRow(await rowTops(page, "#services > div > div > ul > li"))).toEqual([2, 2, 2]);
  expect(perRow(await rowTops(page, "#our-work ul > li"))).toEqual([2, 2, 2, 2]);
  expect(perRow(await rowTops(page, "#news ul > li"))).toEqual([2, 1]);
});

test("the odd last news card is centred on phones", async ({ page }, info) => {
  test.skip(!isMobile(info), "phone layout");
  const list = (await page.locator("#news ul").boundingBox())!;
  const last = (await page.locator("#news ul > li").last().boundingBox())!;
  const listCentre = list.x + list.width / 2;
  const cardCentre = last.x + last.width / 2;
  expect(Math.abs(listCentre - cardCentre)).toBeLessThan(2);
});

test("portfolio names wrap instead of being cut off on phones", async ({ page }, info) => {
  test.skip(!isMobile(info), "phone layout");
  const clipped = await page.locator("#our-work li a .font-semibold").evaluateAll((els) =>
    els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent)
  );
  expect(clipped).toEqual([]);
});

test("laptop layout: 3 services, 4 projects and 3 posts per row", async ({ page }, info) => {
  test.skip(isMobile(info), "laptop layout");
  expect(perRow(await rowTops(page, "#services > div > div > ul > li"))).toEqual([3, 3]);
  expect(perRow(await rowTops(page, "#our-work ul > li"))).toEqual([4, 4]);
  expect(perRow(await rowTops(page, "#news ul > li"))).toEqual([3]);
});

test("laptop menu uses the larger font", async ({ page }, info) => {
  test.skip(isMobile(info), "laptop layout");
  const size = await page
    .getByRole("navigation", { name: "Global" })
    .getByText("Services", { exact: true })
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  // text-lg at xl widths (1440px).
  expect(size).toBe(18);
});
