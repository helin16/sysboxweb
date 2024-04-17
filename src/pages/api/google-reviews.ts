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
  time: number;
  translated: boolean;
};

export type iGoogleReviewSummary = {
    name: string;
    rating: number;
    reviews: iGoogleReview[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const YOUR_PLACE_ID = "ChIJ9cGMmq1q1moRXOPmi0WQx24";
  const YOUR_API_KEY = "AIzaSyBC_cA9sff2FPDVRHqY6eXyiOfz57c_m9U";
  try {
    // Fetch Google Reviews using server-side code
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${YOUR_PLACE_ID}&fields=name,rating,reviews&key=${YOUR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google Reviews");
    }

    const data = await response.json();

    // Filter reviews with rating >= 4
    const filteredReviews = data.result.reviews.filter(
      (review: any) => review.rating >= 4
    );

    res.status(200).json({
      ...(data.result || {}),
      reviews: filteredReviews,
    });
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
