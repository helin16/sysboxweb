# Sysbox Digital website

The website for [Sysbox Digital](https://sysbox.com.au): Sysbox Pty Ltd's websites, eCommerce and custom software services.

Built with [Next.js](https://nextjs.org/) 16 (pages router), React 19, TypeScript and Tailwind CSS. Hosted on Vercel, behind Cloudflare.

## Getting started

Requires Node.js 20.9 or newer and Yarn 1.

```bash
yarn install
cp .env.example .env.local   # then fill in the values (see below)
yarn dev                     # http://localhost:3000
```

### Environment variables

| Name | Used for |
| --- | --- |
| `GOOGLE_PLACES_API_KEY` | Google reviews in the Testimonials section (`/api/google-reviews`). A Google Cloud key restricted to **Places API (New)**. Without it, the site shows a fallback testimonial instead. |
| `NEXT_PUBLIC_SITE_URL` | Optional. The main web address used in canonical links and social previews. Defaults to `https://sysbox.com.au`. |

In production these are set in Vercel → Project → Settings → Environment Variables. Never commit real keys: `.env.local` is git-ignored.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Run the site locally with hot reload |
| `yarn build` / `yarn start` | Production build, and serve it |
| `yarn lint` | ESLint (Next.js core-web-vitals rules) |
| `yarn test` | Unit tests (Jest + React Testing Library) |
| `yarn test:coverage` | Unit tests with a coverage report in `coverage/` |
| `yarn test:e2e` | End-to-end tests in Chromium at desktop and phone sizes (Playwright) |
| `yarn test:e2e:ui` | The end-to-end tests in Playwright's interactive UI |
| `yarn test:all` | Unit tests with coverage, then the end-to-end tests |

The first time you run the end-to-end tests, install the browser with `yarn playwright install chromium`. They reuse a dev server already running on port 3000, or start one.

GitHub Actions runs type-checking, linting, the unit tests and the end-to-end tests on every push (`.github/workflows/ci.yml`).

## Project layout

```
src/
  pages/            index (home), contact, services/[slug], api/google-reviews
  components/       page sections and shared pieces
    services.tsx    content for the service cards and the /services pages
    seo.ts          site address, default title/description, structured data
  app/globals.css   Tailwind and global styles
public/             images, favicons, og-image.png, robots.txt, sitemap.xml
tests/
  unit/             Jest tests
  e2e/              Playwright tests (outside services are stubbed)
  fixtures/         shared test data
```

## Common changes

- **Edit a service** (text, tags, page title or description): `src/components/services.tsx`. The home page cards, the service pages and the footer all update from it.
- **Add a service page**: add an entry to `SERVICES` in `src/components/services.tsx`, then add its address to `public/sitemap.xml`. A unit test fails if the sitemap is missing a page.
- **Add or remove a portfolio project**: `src/components/LatestWork.tsx` (images in `public/images/`, links in `src/components/Url.ts`).
- **Change the stats** (15+ years, etc.): `src/pages/index.tsx` and the "Why Sysbox?" box in `src/pages/services/[slug].tsx`.

## SEO

Every page has its own title, description, canonical address and social preview tags (via `PageLayout`). The home page includes Organization structured data and each service page includes Service and breadcrumb structured data. `public/sitemap.xml` is submitted in Google Search Console. Update its `lastmod` dates when pages change significantly.
