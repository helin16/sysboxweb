type iRatingByStars = {
  rating: number;
  size: number;
  className?: string;
};
const RatingByStars = ({ rating, size, className }: iRatingByStars) => {
  const gapSize = Math.ceil(size / 6);
  return (
    <span
      style={{
        width: `calc(calc(${size}px + ${gapSize}px) * ${rating} + calc(${size}px / 2) * 0)`,
        maxWidth: `${(size + gapSize) * 5}`,
        height: `${size}px`,
      }}
      className={`block bg-repeat-x google-review-stars my-2 ${className}`}
    ></span>
  );
};

export default RatingByStars;
