import fs from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import ServicePage, { getStaticPaths, getStaticProps } from "@/pages/services/[slug]";
import { SERVICES, findService, serviceUrl } from "@/components/services";

jest.mock("@vercel/speed-insights/next", () => ({ SpeedInsights: () => null }));
// next/head only works inside a full Next app; render its children inline.
jest.mock("next/head", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="head">{children}</div>,
}));

const ldScript = () =>
  JSON.parse(document.querySelector('script[type="application/ld+json"]')!.innerHTML);

describe("service data", () => {
  it("has a unique address and complete content for every service", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    SERVICES.forEach((s) => {
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
      expect(s.metaTitle.length).toBeLessThanOrEqual(60);
      expect(s.metaDescription.length).toBeGreaterThanOrEqual(120);
      expect(s.metaDescription.length).toBeLessThanOrEqual(160);
      expect(s.intro.length).toBeGreaterThan(0);
      expect(s.includes.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("finds services by address", () => {
    expect(findService("seo")?.title).toBe("SEO & Online Growth");
    expect(findService("nope")).toBeUndefined();
    expect(serviceUrl(SERVICES[0])).toBe("/services/web-development");
  });

  it("lists every page in the sitemap", () => {
    const sitemap = fs.readFileSync(path.join(process.cwd(), "public", "sitemap.xml"), "utf8");
    ["/", "/contact", ...SERVICES.map(serviceUrl)].forEach((p) => {
      expect(sitemap).toContain(`<loc>https://sysbox.com.au${p}</loc>`);
    });
  });
});

describe("service page building", () => {
  it("builds one page per service", async () => {
    const { paths, fallback } = (await getStaticPaths({})) as any;
    expect(fallback).toBe(false);
    expect(paths.map((p: any) => p.params.slug)).toEqual(SERVICES.map((s) => s.slug));
  });

  it("passes the service to the page, or 404s for an unknown one", async () => {
    expect(await getStaticProps({ params: { slug: "seo" } } as any)).toEqual({ props: { slug: "seo" } });
    expect(await getStaticProps({ params: { slug: "nope" } } as any)).toEqual({ notFound: true });
  });
});

describe.each(SERVICES.map((s) => [s.title, s] as const))("%s page", (_, service) => {
  beforeEach(() => render(<ServicePage slug={service.slug} />));

  it("has its own title, description, canonical address and heading", () => {
    expect(document.title).toBe(service.metaTitle);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute("content", service.metaDescription);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://sysbox.com.au/services/${service.slug}`
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(service.title);
  });

  it("explains what's included and links to the contact page", () => {
    service.includes.forEach((item) =>
      expect(screen.getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument()
    );
    const main = screen.getByRole("main");
    expect(within(main).getAllByRole("link", { name: /Get in Touch/ })[0]).toHaveAttribute("href", "/contact");
  });

  it("links to the other five services", () => {
    const other = screen.getByRole("heading", { name: "Other ways we can help" }).parentElement!.nextElementSibling!;
    const links = within(other as HTMLElement).getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(
      SERVICES.filter((s) => s.slug !== service.slug).map(serviceUrl)
    );
  });

  it("shows a breadcrumb and describes the service to search engines", () => {
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(crumbs).toHaveTextContent(`Home/Services/${service.title}`);
    const [svc, breadcrumbs] = ldScript()["@graph"];
    expect(svc).toMatchObject({
      "@type": "Service",
      name: service.title,
      url: `https://sysbox.com.au/services/${service.slug}`,
      provider: { "@id": "https://sysbox.com.au/#organization" },
    });
    expect(breadcrumbs.itemListElement.map((i: any) => i.name)).toEqual(["Home", "Services", service.title]);
  });

  it("highlights Services in the menu", () => {
    const nav = screen.getByRole("navigation", { name: "Global" });
    expect(within(nav).getByText("Services")).toHaveClass("text-blue-600");
  });
});

it("lists the platforms only for services that have them", () => {
  render(<ServicePage slug="ui-ux-design" />);
  expect(screen.queryByText("Platforms we work with")).not.toBeInTheDocument();
});
