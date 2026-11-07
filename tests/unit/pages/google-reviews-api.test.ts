/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from "next";
import handler, { CACHE_CONTROL, PLACE_ID, toReview } from "@/pages/api/google-reviews";

const mockResponse = () => {
  const res: Partial<NextApiResponse> & {
    body?: unknown;
    statusCode?: number;
    headers: Record<string, string>;
  } = { headers: {} };
  res.status = jest.fn((code: number) => {
    res.statusCode = code;
    return res as NextApiResponse;
  });
  res.json = jest.fn((body: unknown) => {
    res.body = body;
  });
  res.setHeader = jest.fn((name: string, value: string) => {
    res.headers[name] = value;
    return res as NextApiResponse;
  }) as any;
  return res;
};

const call = async () => {
  const res = mockResponse();
  await handler({} as NextApiRequest, res as NextApiResponse);
  return res;
};

const googleReplies = (body: unknown, ok = true, status = 200) =>
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

/** A review in Places API (New) format. */
const placesReview = (name: string, rating: number, extra: object = {}) => ({
  rating,
  relativePublishTimeDescription: "2 months ago",
  publishTime: "2026-09-01T10:00:00Z",
  text: { text: `${name} says hi`, languageCode: "en" },
  originalText: { text: `${name} says hi`, languageCode: "en" },
  authorAttribution: {
    displayName: name,
    uri: `https://www.google.com/maps/contrib/${name}`,
    photoUri: `https://lh3.googleusercontent.com/${name}.png`,
  },
  ...extra,
});

const ORIGINAL_KEY = process.env.GOOGLE_PLACES_API_KEY;
beforeEach(() => {
  process.env.GOOGLE_PLACES_API_KEY = "test-key";
});
afterEach(() => {
  process.env.GOOGLE_PLACES_API_KEY = ORIGINAL_KEY;
  jest.restoreAllMocks();
});

describe("GET /api/google-reviews", () => {
  it("asks Places API (New) for only the fields it needs, using the key from the environment", async () => {
    const fetchSpy = googleReplies({ displayName: { text: "Sysbox" }, rating: 4.9, reviews: [] });
    await call();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`);
    expect(init.headers).toEqual({
      "X-Goog-Api-Key": "test-key",
      "X-Goog-FieldMask": "displayName,rating,reviews",
    });
  });

  it("never sends a key written into the code", async () => {
    const fetchSpy = googleReplies({ reviews: [] });
    await call();
    expect(JSON.stringify(fetchSpy.mock.calls)).not.toContain("AIza");
  });

  it("returns the name, rating and reviews rated 4 stars or more, in the site's format", async () => {
    googleReplies({
      displayName: { text: "Sysbox Pty Ltd" },
      rating: 4.6,
      reviews: [
        placesReview("Ann", 5),
        placesReview("Bob", 3),
        placesReview("Cat", 4),
        placesReview("Dan", 1),
      ],
    });
    const res = await call();
    expect(res.statusCode).toBe(200);
    const body = res.body as any;
    expect(body.name).toBe("Sysbox Pty Ltd");
    expect(body.rating).toBe(4.6);
    expect(body.reviews.map((r: any) => r.author_name)).toEqual(["Ann", "Cat"]);
    expect(body.reviews[0]).toEqual({
      author_name: "Ann",
      author_url: "https://www.google.com/maps/contrib/Ann",
      language: "en",
      original_language: "en",
      profile_photo_url: "https://lh3.googleusercontent.com/Ann.png",
      rating: 5,
      relative_time_description: "2 months ago",
      text: "Ann says hi",
      time: Date.parse("2026-09-01T10:00:00Z") / 1000,
      translated: false,
    });
  });

  it("lets the CDN cache the reviews for a day", async () => {
    googleReplies({ reviews: [] });
    const res = await call();
    expect(res.headers["Cache-Control"]).toBe(CACHE_CONTROL);
    expect(CACHE_CONTROL).toContain("s-maxage=86400");
  });

  it("returns an empty list when the place has no reviews", async () => {
    googleReplies({ displayName: { text: "Sysbox" } });
    const res = await call();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "Sysbox", rating: 0, reviews: [] });
  });

  it("copes with an empty reply", async () => {
    googleReplies({});
    const res = await call();
    expect(res.body).toEqual({ name: "", rating: 0, reviews: [] });
  });

  it("returns a 500 error if the API key isn't set", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.GOOGLE_PLACES_API_KEY;
    const fetchSpy = jest.spyOn(global, "fetch");
    const res = await call();
    expect(res.statusCode).toBe(500);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(String(error.mock.calls[0][1])).toContain("GOOGLE_PLACES_API_KEY is not set");
  });

  it("returns a 500 error, without caching, if Google responds with an error", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    googleReplies({ error: { message: "API key not valid" } }, false, 400);
    const res = await call();
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
    expect(res.headers["Cache-Control"]).toBeUndefined();
    // Google's reason is logged, to make problems easy to diagnose in Vercel.
    expect(String(error.mock.calls[0][1])).toContain("API key not valid");
  });

  it("returns a 500 error if Google can't be reached", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const res = await call();
    expect(res.statusCode).toBe(500);
    expect(error).toHaveBeenCalled();
  });
});

describe("toReview", () => {
  it("marks translated reviews and keeps both languages", () => {
    const review = toReview(
      placesReview("Li", 5, {
        text: { text: "Great team", languageCode: "en" },
        originalText: { text: "很棒的团队", languageCode: "zh" },
      })
    );
    expect(review).toMatchObject({ text: "Great team", language: "en", original_language: "zh", translated: true });
  });

  it("falls back to the original text when there is no translation", () => {
    const review = toReview({ originalText: { text: "Only original", languageCode: "en" } });
    expect(review.text).toBe("Only original");
    expect(review.language).toBe("en");
    expect(review.translated).toBe(false);
  });

  it("fills in safe defaults for missing fields", () => {
    expect(toReview({})).toEqual({
      author_name: "Google user",
      author_url: "",
      language: "",
      original_language: "",
      profile_photo_url: "",
      rating: 0,
      relative_time_description: "",
      text: "",
      time: 0,
      translated: false,
    });
  });

  it("ignores an unreadable publish date", () => {
    expect(toReview({ publishTime: "not a date" }).time).toBe(0);
  });
});
