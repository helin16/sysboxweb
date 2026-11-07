import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow, mockExternalServices, trackPageErrors } from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockExternalServices(page);
});

test("has the heading, intro and contact links", async ({ page }) => {
  const errors = trackPageErrors(page);
  await page.goto("/contact");
  await expect(page).toHaveTitle("Contact us - Sysbox");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let’s Talk About Your Project");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: /Find us on Google Maps/ })).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/uXo4yhTZxRb5tQGp6"
  );
  await expect(main.getByRole("link", { name: /Facebook/ })).toHaveAttribute("target", "_blank");
  await expect(main.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("target", "_blank");
  await expect(main.getByRole("link", { name: /Twitter/ })).toHaveCount(0);
  await expect(page.locator("#hbform form")).toBeVisible();
  expect(errors).toEqual([]);
});

test("loads the right HubSpot form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("#hbform form")).toBeVisible();
  expect(await page.evaluate(() => (window as any).__hubspotOptions)).toEqual({
    portalId: "14545640",
    formId: "08d84a8d-7587-4de9-b206-1aa798db62ce",
  });
});

test("restyles the HubSpot form with our labels, placeholders and button", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("#hbform form");
  await expect(form.locator('label[for="firstname-1"]')).toContainText("Full Name");
  await expect(form.locator('[name="firstname"]')).toHaveAttribute("placeholder", "Your full name");
  await expect(form.locator('[name="email"]')).toHaveAttribute("placeholder", "name@example.com");
  await expect(form.locator('[name="message"]')).toHaveAttribute("placeholder", "Add message...");
  await expect(form.locator('input[type="submit"]')).toHaveValue("Get in touch");
  // Fields appear name, email, message, then the button.
  const order = await form.locator(".hs-form-field, .hs_submit").evaluateAll((els) =>
    els.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).map((e) => e.className.split(" ")[0])
  );
  expect(order).toEqual(["hs_firstname", "hs_email", "hs_message", "hs_submit"]);
});

test("hides HubSpot's 'create your own free forms' link and the 'how can we help' field", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("#hbform form")).toBeVisible();
  await expect(page.locator(".hs-form__virality-link")).toBeHidden();
  await expect(page.locator("#hbform")).not.toContainText(/how can we help/i);
});

test("form fields use the site's rounded, blue-focus style", async ({ page }) => {
  await page.goto("/contact");
  const email = page.locator('#hbform [name="email"]');
  await expect(email).toHaveCSS("border-radius", "8px");
  await email.focus();
  await expect(email).toHaveCSS("border-color", "rgb(37, 99, 235)");
  await expect(page.locator("#hbform .hs-button")).toHaveCSS("background-color", "rgb(37, 99, 235)");
});

test("sits on a light blue background", async ({ page }) => {
  await page.goto("/contact");
  const bg = await page.getByRole("main").locator("> div").first().evaluate((el) => getComputedStyle(el).backgroundImage);
  // Tailwind blue-50 is rgb(239, 246, 255).
  expect(bg).toContain("rgb(239, 246, 255)");
});

test("never scrolls sideways", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("#hbform form")).toBeVisible();
  expect(await hasHorizontalOverflow(page)).toBe(false);
});
