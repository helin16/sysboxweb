import { NextApiRequest, NextApiResponse } from "next";

export type iGoogleReview = {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  /** Unix time in seconds. */
  time: number;
  translated: boolean;
};

export type iGoogleReviewSummary = {
  name: string;
  rating: number;
  reviews: iGoogleReview[];
};

/** Sysbox Pty Ltd on Google Maps. */
export const PLACE_ID = "ChIJ9cGMmq1q1moRXOPmi0WQx24";
/** Only reviews with at least this many stars are shown. */
const MIN_RATING = 4;
/**
 * Reviews rarely change, so the CDN keeps a copy for a day (and serves the
 * old copy while refreshing). This keeps Google Places API costs to roughly
 * one request a day instead of one per visitor.
 */
export const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=86400";

/** A review as returned by Places API (New). */
type iPlacesReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

type iPlacesResponse = {
  displayName?: { text?: string };
  rating?: number;
  reviews?: iPlacesReview[];
};

/** Convert a Places API (New) review into the shape the site displays. */
export const toReview = (r: iPlacesReview): iGoogleReview => {
  const language = r.text?.languageCode || r.originalText?.languageCode || "";
  const originalLanguage = r.originalText?.languageCode || language;
  const published = r.publishTime ? Date.parse(r.publishTime) : NaN;
  return {
    author_name: r.authorAttribution?.displayName || "Google user",
    author_url: r.authorAttribution?.uri || "",
    language,
    original_language: originalLanguage,
    profile_photo_url: r.authorAttribution?.photoUri || "",
    rating: r.rating || 0,
    relative_time_description: r.relativePublishTimeDescription || "",
    text: r.text?.text || r.originalText?.text || "",
    time: Number.isNaN(published) ? 0 : Math.floor(published / 1000),
    translated: language !== originalLanguage,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Set in Vercel → Settings → Environment Variables (and in .env.local
    // for local development). Never commit the key itself.
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_PLACES_API_KEY is not set");
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          // Only ask for (and pay for) the fields the site uses.
          "X-Goog-FieldMask": "displayName,rating,reviews",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Google Reviews: ${response.status} ${await response.text()}`
      );
    }

    const data: iPlacesResponse = await response.json();
    const reviews = (data.reviews || [])
      .map(toReview)
      .filter((review) => review.rating >= MIN_RATING);

    const summary: iGoogleReviewSummary = {
      name: data.displayName?.text || "",
      rating: data.rating || 0,
      reviews,
    };
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
