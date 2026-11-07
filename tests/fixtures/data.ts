// Shared, fixed test data used by both the unit and end-to-end tests, so the
// tests never depend on what Google or the blog happen to return today.
import type {
  iGoogleReview,
  iGoogleReviewSummary,
} from "../../src/pages/api/google-reviews";

const review = (
  author_name: string,
  text: string,
  rating: number,
  time: number
): iGoogleReview => ({
  author_name,
  author_url: `https://www.google.com/maps/contrib/${author_name.replace(/\s/g, "")}`,
  language: "en",
  original_language: "en",
  // A local image, so Next's image optimiser never needs the internet.
  profile_photo_url: "/images/MERP.webp",
  rating,
  relative_time_description: "a month ago",
  text,
  time,
  translated: false,
});

export const REVIEWS: iGoogleReview[] = [
  review("Alice Nguyen", "Fantastic team, delivered on time.", 5, 1700000000),
  review("Ben Carter", "Great support after launch.", 5, 1710000000),
  review("Chloe Smith", "Our new system saves us hours every week.", 4, 1720000000),
];

export const REVIEW_SUMMARY: iGoogleReviewSummary = {
  name: "Sysbox Pty Ltd",
  rating: 4.9,
  reviews: REVIEWS,
};

export const NEWS_ITEMS = [
  {
    id: "news-1",
    title: "How we rebuilt a childcare website",
    excerpt: "<p>First paragraph.</p><p>Second <strong>bold</strong> line.</p>",
    publishedAt: "2026-10-01T00:00:00.000Z",
    CoverAsset: { url: "/images/MERP.webp" },
  },
  {
    id: "news-2",
    title: "Five tips for faster WordPress sites",
    excerpt: "Plain text excerpt<br/>with a break",
    publishedAt: "2026-09-15T00:00:00.000Z",
    CoverAsset: { url: "/images/ShowMine.webp" },
  },
  {
    id: "news-3",
    title: "Why custom ERP beats spreadsheets",
    excerpt: "<ul><li>One</li><li>Two</li></ul>",
    publishedAt: "2026-08-20T00:00:00.000Z",
    CoverAsset: { url: "/images/Shamrock.webp" },
  },
];

export const newsResponse = (items = NEWS_ITEMS) => ({
  data: items,
  currentPage: 1,
  from: 1,
  to: items.length,
  perPage: 3,
  total: items.length,
  pages: 1,
});
