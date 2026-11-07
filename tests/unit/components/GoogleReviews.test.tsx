import { act, fireEvent, render, screen } from "@testing-library/react";
import GoogleReviews, { GOOGLE_MAPS_URL } from "@/components/GoogleReviews";
import { REVIEWS, REVIEW_SUMMARY } from "../../fixtures/data";
import type { iGoogleReviewSummary } from "@/pages/api/google-reviews";

const mockFetch = (summary: Partial<iGoogleReviewSummary> | Promise<never>) => {
  global.fetch = jest.fn(() =>
    summary instanceof Promise
      ? summary
      : Promise.resolve({ json: () => Promise.resolve(summary) })
  ) as jest.Mock;
};

/** Run every pending animation frame and timer, as if a second has passed. */
const finishAnimations = () =>
  act(() => {
    jest.advanceTimersByTime(3000);
  });

const renderLoaded = async (summary: Partial<iGoogleReviewSummary> = REVIEW_SUMMARY) => {
  mockFetch(summary);
  const utils = render(<GoogleReviews fallback={<p>fallback quote</p>} />);
  await screen.findByRole("region", { name: "Google reviews" });
  return utils;
};

const stage = () => screen.getByRole("region", { name: "Google reviews" });
const cards = () => Array.from(stage().children) as HTMLElement[];
const status = () =>
  screen.getByText((_, el) => !!el && el.classList.contains("sr-only") && /^Review \d+ of \d+$/.test(el.textContent || ""))
    .textContent;

const setReducedMotion = (reduce: boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

beforeEach(() => {
  jest.useFakeTimers();
  setReducedMotion(false);
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("GoogleReviews loading and fallback", () => {
  it("renders nothing while the reviews are loading", () => {
    mockFetch(new Promise<never>(() => {}));
    const { container } = render(<GoogleReviews fallback={<p>fallback quote</p>} />);
    expect(container).toBeEmptyDOMElement();
    expect(global.fetch).toHaveBeenCalledWith("/api/google-reviews");
  });

  it("shows the fallback quote if the reviews can't be fetched", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});
    mockFetch(Promise.reject(new Error("offline")) as Promise<never>);
    render(<GoogleReviews fallback={<p>fallback quote</p>} />);
    expect(await screen.findByText("fallback quote")).toBeInTheDocument();
    expect(error).toHaveBeenCalledWith("Error fetching Google Reviews:", expect.any(Error));
  });

  it("shows the fallback quote if there are no reviews", async () => {
    mockFetch({ rating: 5, reviews: [] });
    render(<GoogleReviews fallback={<p>fallback quote</p>} />);
    expect(await screen.findByText("fallback quote")).toBeInTheDocument();
  });

  it("renders nothing without a fallback when there are no reviews", async () => {
    mockFetch({});
    const { container } = render(<GoogleReviews />);
    await act(async () => {});
    expect(container).toBeEmptyDOMElement();
  });
});

describe("GoogleReviews content", () => {
  it("shows the overall rating, the review count and a Google Maps link", async () => {
    await renderLoaded();
    const summary = screen.getByRole("link");
    expect(summary).toHaveAttribute("href", GOOGLE_MAPS_URL);
    expect(summary).toHaveAttribute("target", "_blank");
    expect(summary).toHaveTextContent("4.9");
    expect(summary).toHaveTextContent("3 reviews");
  });

  it("renders a card per review with author, quote and date", async () => {
    await renderLoaded();
    expect(cards()).toHaveLength(3);
    REVIEWS.forEach((r, i) => {
      expect(cards()[i]).toHaveTextContent(r.author_name);
      expect(cards()[i]).toHaveTextContent(`“${r.text}”`);
    });
    expect(cards()[0]).toHaveTextContent(/2023/);
  });

  it("only exposes the front card to screen readers", async () => {
    await renderLoaded();
    expect(status()).toBe("Review 1 of 3");
    expect(cards().map((c) => c.getAttribute("aria-hidden"))).toEqual([
      "false",
      "true",
      "true",
    ]);
  });

  it("copes with a missing rating, photo and overall score", async () => {
    const error = jest.spyOn(console, "error");
    await renderLoaded({
      reviews: [{ ...REVIEWS[0], rating: 0, profile_photo_url: "" }],
    });
    expect(screen.getByRole("link")).toHaveTextContent("0.0");
    expect(screen.getByRole("link")).toHaveTextContent("1 reviews");
    // A grey circle stands in for the photo, with no image errors.
    expect(cards()[0].querySelector("span.rounded-full")).toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();
  });

  it("hides the arrows and dots when there is only one review", async () => {
    await renderLoaded({ rating: 5, reviews: [REVIEWS[0]] });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("tucks cards beyond the side slots out of sight", async () => {
    const five = [...REVIEWS, { ...REVIEWS[0], author_name: "Dan" }, { ...REVIEWS[1], author_name: "Eve" }];
    await renderLoaded({ rating: 5, reviews: five });
    // Positions: 0 front, 1 right, 2 hidden, -2 hidden, -1 left.
    const opacities = cards().map((c) => Number(c.style.opacity));
    expect(opacities[0]).toBe(1);
    expect(opacities[1]).toBeCloseTo(0.45);
    expect(opacities[2]).toBe(0);
    expect(opacities[3]).toBe(0);
    expect(opacities[4]).toBeCloseTo(0.45);
    expect(cards()[1].style.transform).toContain("translateX(28%)");
    expect(cards()[4].style.transform).toContain("translateX(-28%)");
  });
});

describe("GoogleReviews navigation", () => {
  it("moves with the arrow buttons", async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
    fireEvent.click(screen.getByRole("button", { name: "Move reviews left" }));
    finishAnimations();
    fireEvent.click(screen.getByRole("button", { name: "Move reviews left" }));
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
  });

  it("animates smoothly instead of jumping", async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    const midway = Number(cards()[0].style.opacity);
    expect(midway).toBeGreaterThan(0.45);
    expect(midway).toBeLessThan(1);
    finishAnimations();
    expect(Number(cards()[2].style.opacity)).toBe(1);
  });

  it("counts every click, even mid-animation", async () => {
    await renderLoaded();
    const right = screen.getByRole("button", { name: "Move reviews right" });
    fireEvent.click(right);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    fireEvent.click(right);
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
  });

  it("moves with the left and right arrow keys only", async () => {
    await renderLoaded();
    fireEvent.keyDown(stage(), { key: "ArrowLeft" });
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
    fireEvent.keyDown(stage(), { key: "ArrowRight" });
    finishAnimations();
    expect(status()).toBe("Review 1 of 3");
    fireEvent.keyDown(stage(), { key: "Enter" });
    finishAnimations();
    expect(status()).toBe("Review 1 of 3");
  });

  it("jumps to a review from its dot and highlights that dot", async () => {
    await renderLoaded();
    const dot = screen.getByRole("button", { name: "Show review by Chloe Smith" });
    fireEvent.click(dot);
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
    expect(dot).toHaveClass("w-6", "bg-blue-600");
    // Clicking the current dot again does nothing.
    fireEvent.click(dot);
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("brings a side card to the front when it is clicked", async () => {
    await renderLoaded();
    // Card 2 sits on the right, card 3 on the left.
    fireEvent.click(cards()[1]);
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
    fireEvent.click(cards()[1]); // now the front card: no change
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
    // Card 1 is now on the left.
    fireEvent.click(cards()[0]);
    finishAnimations();
    expect(status()).toBe("Review 1 of 3");
    fireEvent.click(cards()[2]);
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("snaps instantly for people who prefer reduced motion", async () => {
    setReducedMotion(true);
    await renderLoaded();
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    expect(status()).toBe("Review 3 of 3");
  });
});

describe("GoogleReviews dragging and scrolling", () => {
  // jsdom reports a 0px stage, so one card's worth of drag is 600 * 0.35 = 210px.
  const SLOT = 210;

  it("follows a drag and settles on the nearest card", async () => {
    await renderLoaded();
    fireEvent.pointerDown(stage(), { button: 0, clientX: 400 });
    fireEvent.pointerMove(stage(), { clientX: 400 - SLOT });
    fireEvent.pointerUp(stage());
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
  });

  it("treats a short flick as a one-card move", async () => {
    await renderLoaded();
    fireEvent.pointerDown(stage(), { button: 0, clientX: 400 });
    fireEvent.pointerMove(stage(), { clientX: 400 + 60 });
    fireEvent.pointerUp(stage());
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("ignores the click that ends a drag", async () => {
    await renderLoaded();
    fireEvent.pointerDown(stage(), { button: 0, clientX: 400 });
    fireEvent.pointerMove(stage(), { clientX: 400 - SLOT });
    fireEvent.pointerCancel(stage());
    fireEvent.click(cards()[2]);
    finishAnimations();
    expect(status()).toBe("Review 2 of 3");
  });

  it("treats a tiny movement as a click, not a drag", async () => {
    await renderLoaded();
    fireEvent.pointerDown(cards()[2], { button: 0, clientX: 400 });
    fireEvent.pointerMove(cards()[2], { clientX: 403 });
    fireEvent.pointerUp(cards()[2]);
    fireEvent.click(cards()[2]);
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("ignores right-clicks and stray pointer moves", async () => {
    await renderLoaded();
    fireEvent.pointerMove(stage(), { clientX: 100 });
    fireEvent.pointerDown(stage(), { button: 2, clientX: 400 });
    fireEvent.pointerMove(stage(), { clientX: 400 - SLOT });
    fireEvent.pointerUp(stage());
    finishAnimations();
    expect(status()).toBe("Review 1 of 3");
  });

  it("lets an interrupted glide finish when the cards are pressed", async () => {
    await renderLoaded();
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    fireEvent.pointerDown(stage(), { button: 0, clientX: 400 });
    fireEvent.pointerUp(stage());
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("moves with sideways trackpad scrolling, then settles", async () => {
    await renderLoaded();
    fireEvent.wheel(stage(), { deltaX: SLOT / 2, deltaY: 0 });
    fireEvent.wheel(stage(), { deltaX: SLOT / 2, deltaY: 0 });
    finishAnimations();
    expect(status()).toBe("Review 3 of 3");
  });

  it("leaves vertical scrolling to the page", async () => {
    await renderLoaded();
    fireEvent.wheel(stage(), { deltaX: 5, deltaY: 100 });
    finishAnimations();
    expect(status()).toBe("Review 1 of 3");
    expect(Number(cards()[0].style.opacity)).toBe(1);
  });

  it("stops animations and timers when it is removed from the page", async () => {
    const { unmount } = await renderLoaded();
    const cancel = jest.spyOn(window, "cancelAnimationFrame");
    const clear = jest.spyOn(global, "clearTimeout");
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    fireEvent.wheel(stage(), { deltaX: 50, deltaY: 0 });
    fireEvent.click(screen.getByRole("button", { name: "Move reviews right" }));
    unmount();
    expect(cancel).toHaveBeenCalled();
    expect(clear).toHaveBeenCalled();
    expect(() => finishAnimations()).not.toThrow();
  });
});
