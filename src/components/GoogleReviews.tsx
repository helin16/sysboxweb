import {
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { iGoogleReview, iGoogleReviewSummary } from "@/pages/api/google-reviews";
import RatingByStars from "./RatingByStars";
import moment from "moment";

export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/uXo4yhTZxRb5tQGp6";
/** Duration of a one-card move; longer jumps take a little longer. */
const MOVE_DURATION_MS = 850;
/** Settling after a drag or trackpad scroll, when cards are already moving. */
const SETTLE_DURATION_MS = 600;
/** Fraction of a card the user must drag before it moves on. */
const DRAG_COMMIT = 0.2;
/** Pixels of movement before a press counts as a drag instead of a click. */
const DRAG_CLICK_SLOP_PX = 6;
/** Pause after the last trackpad scroll before the cards settle. */
const WHEEL_SETTLE_MS = 140;

type iGoogleReviews = {
  /** Rendered instead of the reviews if none could be loaded. */
  fallback?: ReactNode;
};

/** Gentle start, glide, gentle stop: for moves that begin from rest. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** Soft landing: for settling cards the user has already set moving. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Where card `index` sits relative to the front card for a (fractional)
 * carousel shift, wrapped so cards spread evenly to both sides:
 * 0 = front, -1 = left, 1 = right, anything past ±1.5 is hidden behind.
 */
const relativePosition = (index: number, shift: number, count: number) => {
  let p = (((index + shift) % count) + count) % count;
  if (p >= count / 2) p -= count;
  return p;
};

/** Visual state of a card at continuous position `p`. */
const cardStyle = (p: number) => {
  const a = Math.abs(p);
  const side = Math.sign(p);
  let x: number, scale: number, opacity: number;
  if (a <= 1) {
    x = p * 28;
    scale = 1 - 0.14 * a;
    opacity = 1 - 0.55 * a;
  } else {
    // Beyond the side slot the card tucks in behind the front card and
    // fades out, so cards wrapping round pass behind rather than across.
    const k = Math.min((a - 1) / 0.5, 1);
    x = side * (28 - 16 * k);
    scale = 0.86 - 0.1 * k;
    opacity = 0.45 * (1 - k);
  }
  const lift = Math.min(a, 1) * 14;
  const tilt = side * Math.min(a, 1) * 3;
  return {
    transform: `translateX(${x}%) translateY(${lift}px) rotate(${tilt}deg) scale(${scale})`,
    opacity,
    zIndex: Math.round(100 - a * 20),
  };
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={direction === "left" ? "Move reviews left" : "Move reviews right"}
    className="w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-700 flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-90"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  </button>
);

const ReviewCard = ({ review }: { review: iGoogleReview }) => (
  <article className="h-full bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/60 p-7 flex flex-col">
    <div className="flex items-center justify-between">
      <RatingByStars rating={review.rating || 0} size={16} />
      <Image
        src={"/images/google_icon.svg"}
        alt={"Google review"}
        width={20}
        height={20}
        draggable={false}
      />
    </div>
    <p className="mt-3 flex-1 text-base leading-7 text-slate-600">
      “{review.text}”
    </p>
    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 min-w-0">
      <Image
        src={review.profile_photo_url || ""}
        alt=""
        width={40}
        height={40}
        draggable={false}
        className="rounded-full shrink-0"
      />
      <div className="min-w-0">
        <div className="font-semibold text-slate-900 truncate">
          {review.author_name}
        </div>
        <div className="text-xs text-slate-500">
          {moment.unix(review.time).format("ll")}
        </div>
      </div>
    </div>
  </article>
);

const GoogleReviews = ({ fallback = null }: iGoogleReviews) => {
  const [reviewSum, setReviewSum] = useState<iGoogleReviewSummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  /**
   * Continuous carousel position. Moving right adds 1: every card shifts one
   * slot right, the left card comes to the front and the right-most card
   * wraps round behind to the far left.
   */
  const [shift, setShift] = useState(0);
  const shiftRef = useRef(0);
  const targetRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(
    null
  );
  const suppressClick = useRef(false);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/google-reviews");
        const data = await response.json();
        setReviewSum(data);
      } catch (error) {
        console.error("Error fetching Google Reviews:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchReviews();
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (wheelTimer.current !== null) clearTimeout(wheelTimer.current);
    },
    []
  );

  const setShiftNow = useCallback((value: number) => {
    shiftRef.current = value;
    setShift(value);
  }, []);

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  /** Glide from wherever the cards are now to `target`. */
  const animateTo = useCallback(
    (target: number, settling = false) => {
      // Joining a glide already under way: land softly instead of
      // restarting from rest, so rapid clicks don't stutter.
      const inMotion = frameRef.current !== null;
      stopAnimation();
      targetRef.current = target;
      const from = shiftRef.current;
      const distance = target - from;
      if (distance === 0) return;
      if (prefersReducedMotion()) {
        setShiftNow(target);
        return;
      }
      const soft = settling || inMotion;
      const base = soft ? SETTLE_DURATION_MS : MOVE_DURATION_MS;
      const duration =
        base * Math.min(Math.max(Math.abs(distance), 0.5), 2) ** 0.6;
      const ease = soft ? easeOutCubic : easeInOutCubic;
      const startedAt = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - startedAt) / duration, 1);
        setShiftNow(from + distance * ease(t));
        frameRef.current = t < 1 ? requestAnimationFrame(step) : null;
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [setShiftNow, stopAnimation]
  );

  const reviews = reviewSum?.reviews || [];
  const count = reviews.length;

  if (count === 0) {
    return loaded ? <>{fallback}</> : null;
  }

  // Successive presses queue up from the last target, so rapid clicks still
  // move one card per click without waiting for the previous glide.
  const moveRight = () => animateTo(Math.round(targetRef.current) + 1);
  const moveLeft = () => animateTo(Math.round(targetRef.current) - 1);
  const goTo = (index: number) => {
    // Pick the nearest shift that puts `index` in front.
    const current = targetRef.current;
    const base = -index;
    const k = Math.round((current - base) / count);
    animateTo(base + k * count);
  };
  const frontIndex =
    ((-Math.round(shift) % count) + count) % count;

  /** Pixels of drag that move the cards by one slot. */
  const slotWidth = () =>
    Math.max((stageRef.current?.clientWidth || 600) * 0.35, 120);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    stopAnimation();
    drag.current = { x: e.clientX, start: shiftRef.current, moved: false };
    suppressClick.current = false;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > DRAG_CLICK_SLOP_PX) {
      drag.current.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) {
      setShiftNow(drag.current.start + dx / slotWidth());
    }
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) {
      // A plain click: let a paused glide finish where it was heading.
      if (shiftRef.current !== targetRef.current) {
        animateTo(targetRef.current, true);
      }
      return;
    }
    suppressClick.current = true;
    const moved = shiftRef.current - d.start;
    const base = Math.round(d.start);
    let target = Math.round(shiftRef.current);
    // A short, deliberate flick still advances one card.
    if (target === base && Math.abs(moved) > DRAG_COMMIT) {
      target = base + Math.sign(moved);
    }
    animateTo(target, true);
  };

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    stopAnimation();
    // Trackpad scrolling moves the cards directly, like dragging.
    setShiftNow(shiftRef.current + e.deltaX / slotWidth());
    if (wheelTimer.current !== null) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      animateTo(Math.round(shiftRef.current), true);
    }, WHEEL_SETTLE_MS);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveRight();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveLeft();
    }
  };

  return (
    <div>
      <a
        className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full bg-white px-4 py-2 shadow-sm"
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={"/images/google_logo.svg"}
          height={18}
          width={58}
          alt="Google"
        />
        <span className="font-semibold text-slate-900">
          {(reviewSum?.rating || 0).toFixed(1)}
        </span>
        <RatingByStars
          rating={reviewSum?.rating || 0}
          size={16}
          className="!my-0"
        />
        <span className="text-sm text-slate-500">{count} reviews</span>
      </a>

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Google reviews"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mt-8 pb-4 grid select-none touch-pan-y cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
      >
        {reviews.map((review, index) => {
          const position = relativePosition(index, shift, count);
          const isFront = index === frontIndex;
          return (
            <div
              key={review.author_name}
              aria-hidden={!isFront}
              onClick={() => {
                if (suppressClick.current || isFront) return;
                if (position < 0) moveRight();
                else moveLeft();
              }}
              style={cardStyle(position)}
              className="[grid-area:1/1] justify-self-center w-[78%] lg:w-[72%] will-change-transform"
            >
              <ReviewCard review={review} />
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5">
          <ArrowButton direction="left" onClick={moveLeft} />
          <div className="flex gap-2" aria-live="polite">
            <span className="sr-only">
              Review {frontIndex + 1} of {count}
            </span>
            {reviews.map((review, index) => (
              <button
                key={review.author_name}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show review by ${review.author_name}`}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === frontIndex
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <ArrowButton direction="right" onClick={moveRight} />
        </div>
      )}
    </div>
  );
};

export default GoogleReviews;
