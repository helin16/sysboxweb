import { expect, Page, TestInfo } from "@playwright/test";
import { REVIEW_SUMMARY, newsResponse } from "../fixtures/data";

const NEWS_API = "https://i.showmine66.com/item**";
const HUBSPOT_SCRIPT = "https://js.hsforms.net/forms/v2.js";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET, OPTIONS",
};

/**
 * A small stand-in for HubSpot's forms script. It builds a form shaped like
 * HubSpot's (same class names, field names and promo link) and then calls the
 * site's onFormReady, so the site's own restyling is what gets tested.
 */
const FAKE_HUBSPOT = `
window.hbspt = { forms: { create: function (opts) {
  var target = document.querySelector(opts.target);
  target.innerHTML =
    '<form class="hs-form" novalidate>' +
      '<div class="hs_email hs-form-field"><label for="email-1"><span>Email</span><span class="hs-form-required">*</span></label>' +
        '<div class="input"><input id="email-1" name="email" type="email" class="hs-input"></div></div>' +
      '<div class="hs_firstname hs-form-field"><label for="firstname-1"><span>First Name</span></label>' +
        '<div class="input"><input id="firstname-1" name="firstname" class="hs-input"></div></div>' +
      '<div class="hs_message hs-form-field"><label for="message-1"><span>Message</span></label>' +
        '<div class="input"><textarea id="message-1" name="message" class="hs-input"></textarea></div></div>' +
      '<div class="hs_submit"><div class="actions"><input type="submit" class="hs-button" value="Submit"></div></div>' +
      '<a class="hs-form__virality-link" href="https://www.hubspot.com/">Create your own free forms</a>' +
    '</form>';
  window.__hubspotOptions = { portalId: opts.portalId, formId: opts.formId };
  opts.onFormReady(target.querySelector("form"));
} } };
`;

type MockOptions = {
  reviews?: "ok" | "error";
  news?: "ok" | "error" | "empty";
};

/** Replace every outside service the site calls with fixed test data. */
export async function mockExternalServices(page: Page, opts: MockOptions = {}) {
  const { reviews = "ok", news = "ok" } = opts;

  await page.route("**/api/google-reviews", (route) =>
    reviews === "ok"
      ? route.fulfill({ json: REVIEW_SUMMARY })
      : route.fulfill({ status: 500, json: { error: "Internal Server Error" } })
  );

  await page.route(NEWS_API, (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: CORS_HEADERS });
    }
    if (news === "error") return route.fulfill({ status: 500, headers: CORS_HEADERS, body: "" });
    return route.fulfill({
      headers: CORS_HEADERS,
      json: news === "empty" ? newsResponse([]) : newsResponse(),
    });
  });

  await page.route(HUBSPOT_SCRIPT, (route) =>
    route.fulfill({ contentType: "application/javascript", body: FAKE_HUBSPOT })
  );

  // Vercel analytics isn't part of what we're testing.
  await page.route("**/_vercel/**", (route) => route.abort());
}

/** Collect page errors so a test can assert the page ran cleanly. */
export function trackPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error" && !/Failed to load resource|_vercel|Download the React DevTools/.test(msg.text())) {
      errors.push(msg.text());
    }
  });
  return errors;
}

export const isMobile = (testInfo: TestInfo) => testInfo.project.name === "mobile";

/**
 * Scroll through the page so lazy-loaded images load, then return to the top.
 * Images hidden at this screen size (e.g. laptop-only photos) are skipped,
 * since browsers never load those.
 */
export async function loadAllImages(page: Page) {
  // Reviews and news arrive after the page loads, so keep scrolling any
  // still-unloaded image into view until every visible one has loaded.
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          const pending = Array.from(document.images)
            .filter((i) => i.checkVisibility())
            .filter((i) => !(i.complete && i.naturalWidth > 0));
          for (const img of pending) {
            img.scrollIntoView({ block: "center" });
            await new Promise((r) => setTimeout(r, 100));
          }
          return pending.map((i) => i.currentSrc || i.src);
        }),
      { timeout: 60_000, intervals: [500] }
    )
    .toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
}

/** Top edge (px) of each element, to check how cards are laid out in rows. */
export async function rowTops(page: Page, selector: string) {
  return page.$$eval(selector, (els) => els.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY)));
}

export async function hasHorizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
}
