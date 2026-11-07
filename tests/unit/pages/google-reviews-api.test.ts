/**
 * @jest-environment node
 */
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/google-reviews";

const mockResponse = () => {
  const res: Partial<NextApiResponse> & { body?: unknown; statusCode?: number } = {};
  res.status = jest.fn((code: number) => {
    res.statusCode = code;
    return res as NextApiResponse;
  });
  res.json = jest.fn((body: unknown) => {
    res.body = body;
  });
  return res;
};

const call = async () => {
  const res = mockResponse();
  await handler({} as NextApiRequest, res as NextApiResponse);
  return res;
};

const googleReplies = (body: unknown, ok = true) =>
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  } as Response);

afterEach(() => jest.restoreAllMocks());

describe("GET /api/google-reviews", () => {
  it("asks Google Places for the business's name, rating and reviews", async () => {
    const fetchSpy = googleReplies({ result: { name: "Sysbox", rating: 4.9, reviews: [] } });
    await call();
    const url = new URL(String(fetchSpy.mock.calls[0][0]));
    expect(url.origin + url.pathname).toBe("https://maps.googleapis.com/maps/api/place/details/json");
    expect(url.searchParams.get("place_id")).toBe("ChIJ9cGMmq1q1moRXOPmi0WQx24");
    expect(url.searchParams.get("fields")).toBe("name,rating,reviews");
  });

  it("returns only reviews rated 4 stars or more", async () => {
    googleReplies({
      result: {
        name: "Sysbox",
        rating: 4.6,
        reviews: [
          { author_name: "A", rating: 5 },
          { author_name: "B", rating: 3 },
          { author_name: "C", rating: 4 },
          { author_name: "D", rating: 1 },
        ],
      },
    });
    const res = await call();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      name: "Sysbox",
      rating: 4.6,
      reviews: [
        { author_name: "A", rating: 5 },
        { author_name: "C", rating: 4 },
      ],
    });
  });

  it("returns a 500 error if Google responds with an error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    googleReplies({}, false);
    const res = await call();
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });

  it("returns a 500 error if Google can't be reached", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const res = await call();
    expect(res.statusCode).toBe(500);
    expect(error).toHaveBeenCalled();
  });

  // Current behaviour: a place with no reviews (or an unexpected reply) is
  // treated as an error rather than an empty list. The site then shows the
  // fallback testimonial, so visitors still see something sensible.
  it("returns a 500 error if Google's reply has no reviews", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    googleReplies({ result: { name: "Sysbox", rating: 5 } });
    const res = await call();
    expect(res.statusCode).toBe(500);
  });
});
