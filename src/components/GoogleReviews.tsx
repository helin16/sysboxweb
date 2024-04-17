import { useEffect, useState } from "react";
import Image from "next/image";
import { iGoogleReviewSummary } from "@/pages/api/google-reviews";
import RatingByStars from "./RatingByStars";
import moment from "moment";

const GoogleReviews = () => {
  const [reviewSum, setReviewSum] = useState<iGoogleReviewSummary | null>(null);
  const reviewWidthRem = 22.3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        const data = await response.json();
        setReviewSum(data);
      } catch (error) {
        console.error("Error fetching Google Reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  if ((reviewSum?.reviews || []).length === 0) {
    return null;
  }

  return (
    <div className="flex lg:flex-row flex-col gap-6 items-center">
      <a
        className="lg:w-3/12 text-center block"
        href={"https://maps.app.goo.gl/uXo4yhTZxRb5tQGp6"}
      >
        <h2 className="font-semibold text-2xl">Excellent</h2>
        <RatingByStars
          rating={reviewSum?.rating || 0}
          size={23}
          className={"mx-auto"}
        />
        <p>Based on {(reviewSum?.reviews || []).length} reviews</p>
        <Image
          src={"/images/google_logo.svg"}
          className="mx-auto mt-4"
          height={25}
          width={110}
          alt="Google"
        />
      </a>
      <div className="w-full overflow-x-auto">
        <ul
          className={`flex gap-4 items-stretch w-[${
            Math.round((reviewSum?.reviews || []).length * (reviewWidthRem + 10))
          }rem]`}
        >
          {(reviewSum?.reviews || []).map((review) => (
            <li
              key={review.author_name}
              className={`inline-block bg-white p-6 rounded w-[${reviewWidthRem}rem] w-full max-w-max hover:bg-slate-50`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <Image
                    src={review.profile_photo_url || ""}
                    alt={review.author_name}
                    width={45}
                    height={45}
                  />
                  <div>
                    <div className="font-semibold text-nowrap text-ellipsis overflow-hidden w-[200px]">
                      {review.author_name}
                    </div>
                    <div className="text-xs">
                      {moment.unix(review.time).format("ll")}
                    </div>
                  </div>
                </div>
                <Image
                  src={"/images/google_icon.svg"}
                  alt={"google"}
                  width={20}
                  height={20}
                />
              </div>
              <RatingByStars
                rating={review.rating || 0}
                size={14}
                className="mt-5"
              />
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GoogleReviews;
