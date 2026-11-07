import { render, screen, within } from "@testing-library/react";
import axios from "axios";
import PageLayout from "@/components/PageLayout";
import HomePage from "@/pages/index";
import ContactPage from "@/pages/contact";
import { GOOGLE_MAPS_URL } from "@/components/GoogleReviews";
import { REVIEW_SUMMARY, newsResponse } from "../../fixtures/data";

// next/head only works inside a full Next app; render its children inline so
// the page title and description can be checked.
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="head">{children}</div>,
}));
jest.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => null }));
jest.mock("axios");

beforeEach(() => {
  (axios.get as jest.Mock).mockResolvedValue({ data: newsResponse() });
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(REVIEW_SUMMARY) })
  ) as jest.Mock;
});
afterEach(() => {
  document.querySelectorAll('script[src*="hsforms"]').forEach((n) => n.remove());
});

describe("PageLayout", () => {
  it("sets the title and description and wraps content with header and footer", () => {
    render(
      <PageLayout pageTitle="My title" pageDescription="My description">
        <p>page body</p>
      </PageLayout>
    );
    // React 19 moves <title>, <meta> and <link> into document.head itself.
    const head = document;
    expect(head.querySelector("title")).toHaveTextContent("My title");
    expect(head.querySelector('meta[name="description"]')).toHaveAttribute("content", "My description");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("page body");
    expect(screen.getByRole("main").style.minHeight).toBe("calc(100vh - 18rem)");
  });

  it("adds a canonical link, social preview tags and structured data", () => {
    render(
      <PageLayout pageTitle="T" pageDescription="D" path="/contact" jsonLd={{ "@type": "Thing", name: "</script>" }}>
        x
      </PageLayout>
    );
    // React 19 moves <title>, <meta> and <link> into document.head itself.
    const head = document;
    const meta = (attr: string, key: string) =>
      head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute("content");
    expect(head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://sysbox.com.au/contact");
    expect(meta("property", "og:url")).toBe("https://sysbox.com.au/contact");
    expect(meta("property", "og:title")).toBe("T");
    expect(meta("property", "og:description")).toBe("D");
    expect(meta("property", "og:image")).toBe("https://sysbox.com.au/og-image.png");
    expect(meta("property", "og:locale")).toBe("en_AU");
    expect(meta("name", "twitter:card")).toBe("summary_large_image");
    expect(meta("name", "robots")).toContain("index, follow");
    const ld = head.querySelector('script[type="application/ld+json"]')!;
    // "<" is escaped so the data can never close the script tag early.
    expect(ld.innerHTML).not.toContain("</script>");
    expect(JSON.parse(ld.innerHTML)).toEqual({ "@type": "Thing", name: "</script>" });
  });

  it("falls back to the site-wide title and description", () => {
    render(<PageLayout>x</PageLayout>);
    // React 19 moves <title>, <meta> and <link> into document.head itself.
    const head = document;
    expect(head.querySelector("title")).toHaveTextContent(
      "Sysbox Digital | Websites, Custom Software & eCommerce"
    );
    expect(head.querySelector('meta[name="description"]')!.getAttribute("content")).toMatch(/^Sysbox builds/);
    expect(head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://sysbox.com.au/");
    expect(head.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it("can drop the minimum height", () => {
    render(<PageLayout withMinHeight={false}>x</PageLayout>);
    expect(screen.getByRole("main").style.minHeight).toBe("");
  });
});

describe("Home page", () => {
  it("has every section in order", async () => {
    const { container } = render(<HomePage />);
    await screen.findByRole("region", { name: "Google reviews" });
    await screen.findAllByText("Read more");
    const ids = Array.from(container.querySelectorAll("main > [id]")).map((el) => el.id);
    expect(ids).toEqual(["about", "services", "our-work", "why-us", "testimonials", "news", "partners"]);
  });

  it("describes the business to search engines", async () => {
    render(<HomePage />);
    await screen.findByRole("region", { name: "Google reviews" });
    // React 19 moves <title>, <meta> and <link> into document.head itself.
    const head = document;
    expect(head.querySelector("title")).toHaveTextContent(/^Sysbox Digital \| Websites/);
    const ld = JSON.parse(head.querySelector('script[type="application/ld+json"]')!.innerHTML);
    expect(ld["@graph"].map((n: any) => n["@type"])).toEqual(["Organization", "WebSite"]);
  });

  it("shows the hero heading, buttons and the four stats", async () => {
    render(<HomePage />);
    await screen.findByRole("region", { name: "Google reviews" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Make Your Ideas Shine");
    expect(screen.getByRole("link", { name: "View Our Work" })).toHaveAttribute("href", "/#our-work");
    const stats = ["15+", "60+", "100+", "99%"];
    const labels = ["Years Experience", "Happy Clients", "Projects Delivered", "Client Satisfaction"];
    stats.forEach((s, i) => {
      const value = screen.getByText(s);
      expect(value.parentElement).toHaveTextContent(labels[i]);
    });
  });

  it("ends with a Contact Us banner that links to the contact page", async () => {
    render(<HomePage />);
    await screen.findByRole("region", { name: "Google reviews" });
    const banner = screen.getByRole("heading", { name: "Contact Us" }).closest("div.relative")!;
    expect(within(banner as HTMLElement).getByRole("link", { name: /Get in Touch/ })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("shows the fallback testimonial when reviews can't be loaded", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error("offline"))) as jest.Mock;
    render(<HomePage />);
    expect(await screen.findByText(/Sysbox has been a game-changer for us/)).toBeInTheDocument();
  });
});

describe("Contact page", () => {
  it("has the heading, contact links and the form", () => {
    const { container } = render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Let’s Talk About Your Project");
    expect(screen.getByRole("heading", { name: "Send us a message" })).toBeInTheDocument();
    expect(container.querySelector("#hbform")).toBeInTheDocument();
    // React 19 moves <title>, <meta> and <link> into document.head itself.
    const head = document;
    expect(head.querySelector("title")).toHaveTextContent("Contact Sysbox Digital | Let’s Talk About Your Project");
    expect(head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://sysbox.com.au/contact");
  });

  it("offers Google Maps, Facebook and LinkedIn but not Twitter", () => {
    render(<ContactPage />);
    const main = screen.getByRole("main");
    const links = within(main).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      GOOGLE_MAPS_URL,
      "https://www.facebook.com/sysboxteam/",
      "https://au.linkedin.com/company/sysbox",
    ]);
    expect(within(main).getByText("Say hello on Facebook")).toBeInTheDocument();
    expect(within(main).getByText("Follow our company page")).toBeInTheDocument();
    expect(within(main).queryByText("Twitter")).not.toBeInTheDocument();
  });

  it("highlights Contact in the menu", () => {
    render(<ContactPage />);
    const nav = screen.getByRole("navigation", { name: "Global" });
    expect(within(nav).getByText("Contact")).toHaveClass("text-blue-600");
  });
});
