import { render, screen } from "@testing-library/react";
import AppLogo from "@/components/AppLogo";
import ContactUsBtn, { CONTACT_PAGE_URL } from "@/components/ContactUsBtn";
import PageHeroPanel from "@/components/PageHeroPanel";
import PageSection from "@/components/PageSection";
import RatingByStars from "@/components/RatingByStars";
import SectionHeading from "@/components/SectionHeading";
import Spinner from "@/components/Spinner";

describe("AppLogo", () => {
  it("keeps the logo's proportions for the requested width", () => {
    render(<AppLogo width={383} className="logo" />);
    const img = screen.getByRole("img", { name: /sysbox digital/i });
    expect(img).toHaveAttribute("width", "383");
    // 383 * 597 / 1915 = 119.4 -> 119
    expect(img).toHaveAttribute("height", "119");
    expect(img).toHaveClass("logo");
    expect(img.getAttribute("src")).toContain("logo-sysbox-digital.png");
  });

  it("defaults to 200px wide", () => {
    render(<AppLogo />);
    expect(screen.getByRole("img")).toHaveAttribute("width", "200");
  });
});

describe("ContactUsBtn", () => {
  it("links to the contact page with an arrow by default", () => {
    const { container } = render(<ContactUsBtn />);
    const link = screen.getByRole("link", { name: "Get in Touch" });
    expect(link).toHaveAttribute("href", CONTACT_PAGE_URL);
    expect(link).toHaveClass("bg-blue-600", "px-6");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it.each([
    ["outline", "border-slate-300"],
    ["light", "text-blue-700"],
  ] as const)("supports the %s variant", (variant, expectedClass) => {
    render(<ContactUsBtn variant={variant} />);
    expect(screen.getByRole("link")).toHaveClass(expectedClass);
  });

  it("supports a custom label, link, size and no arrow", () => {
    const { container } = render(
      <ContactUsBtn
        label="View Our Work"
        href="/#our-work"
        size="sm"
        withArrow={false}
        className="extra"
        style={{ color: "red" }}
      />
    );
    const link = screen.getByRole("link", { name: "View Our Work" });
    expect(link).toHaveAttribute("href", "/#our-work");
    expect(link).toHaveClass("px-4", "text-sm", "extra");
    expect(link.style.color).toBe("red");
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});

describe("PageSection", () => {
  it("wraps content in a centred container", () => {
    const { container } = render(
      <PageSection id="s1" className="outer" innerClassName="inner" style={{ color: "red" }}>
        <p>hello</p>
      </PageSection>
    );
    const outer = container.querySelector("#s1")!;
    expect(outer).toHaveClass("outer");
    expect((outer as HTMLElement).style.color).toBe("red");
    expect(outer.firstElementChild).toHaveClass("mx-auto", "container", "inner");
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("works without an inner class", () => {
    const { container } = render(<PageSection>x</PageSection>);
    expect(container.firstElementChild!.firstElementChild!.className).toBe(
      "mx-auto container "
    );
  });
});

describe("PageHeroPanel", () => {
  it("adds vertical padding around a section", () => {
    const { container } = render(
      <PageHeroPanel id="hero" className="bg-blue-50">
        content
      </PageHeroPanel>
    );
    expect(container.querySelector("#hero")).toHaveClass("py-16", "bg-blue-50");
  });

  it("works without a class", () => {
    const { container } = render(<PageHeroPanel>content</PageHeroPanel>);
    expect(container.firstElementChild!.className).toBe("py-16 ");
  });
});

describe("RatingByStars", () => {
  it("sizes the star strip from the rating", () => {
    const { container } = render(
      <RatingByStars rating={4} size={12} className="mine" />
    );
    const stars = container.firstElementChild as HTMLElement;
    // jsdom can't parse the nested calc() width, so the width is checked in
    // the browser by the end-to-end tests instead.
    expect(stars.style.height).toBe("12px");
    expect(stars).toHaveClass("google-review-stars", "mine");
  });
});

describe("SectionHeading", () => {
  it("renders a centred h2 with eyebrow and description by default", () => {
    const { container } = render(
      <SectionHeading eyebrow="Our Services" title="What we do" description="Intro" />
    );
    expect(screen.getByRole("heading", { level: 2, name: "What we do" })).toBeInTheDocument();
    expect(screen.getByText("Our Services")).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("text-center", "mx-auto");
  });

  it("can render a left-aligned h1 without a description", () => {
    const { container } = render(
      <SectionHeading eyebrow="Contact" title="Talk to us" as="h1" align="left" className="x" />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Talk to us" })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("text-left", "x");
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});

describe("Spinner", () => {
  it("renders a spinning icon", () => {
    const { container } = render(<Spinner className="h-5" />);
    expect(container.querySelector("svg")).toHaveClass("animate-spin", "h-5");
  });

  it("works without a class", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toHaveClass("animate-spin");
  });
});
