import { render, screen, within } from "@testing-library/react";
import OurExpertise from "@/components/OurExpertise";
import Partners from "@/components/Partners";
import WhatWeDo from "@/components/WhatWeDo";
import WhyChooseUs from "@/components/WhyChooseUs";
import PageFooter, { SOCIAL_LINKS } from "@/components/PageFooter";
import { allMenuItems } from "@/components/PageHeader";
import { CONTACT_PAGE_URL } from "@/components/ContactUsBtn";

describe("OurExpertise", () => {
  it("lists every technology, including AI", () => {
    render(<OurExpertise />);
    expect(screen.getByRole("heading", { name: "Our Expertise" })).toBeInTheDocument();
    const names = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(names).toEqual([
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "AWS",
      "AIAI", // the AI chip icon itself contains the text "AI"
    ]);
  });
});

describe("WhatWeDo", () => {
  it("shows the six services, each linking to the contact page", () => {
    render(<WhatWeDo />);
    expect(
      screen.getByRole("heading", { name: "End-to-End Digital Solutions" })
    ).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    links.forEach((link) => expect(link).toHaveAttribute("href", CONTACT_PAGE_URL));
    expect(links.map((l) => within(l).getByRole("heading").textContent)).toEqual([
      "Web Development",
      "eCommerce Solutions",
      "UI / UX Design",
      "Custom Software",
      "SEO & Online Growth",
      "Maintenance & Support",
    ]);
  });

  it("shows technology tags only on services that have them", () => {
    render(<WhatWeDo />);
    const ui = screen.getByRole("link", { name: /UI \/ UX Design/ });
    expect(within(ui).queryByRole("list")).not.toBeInTheDocument();
    const custom = screen.getByRole("link", { name: /Custom Software/ });
    expect(within(custom).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "ERP",
      "MRP",
      "CRM",
    ]);
  });

  it("lays out two cards per row on phones and three on laptops", () => {
    render(<WhatWeDo />);
    const grid = screen.getAllByRole("list")[0];
    expect(grid).toHaveClass("grid-cols-2", "lg:grid-cols-3");
  });
});

describe("WhyChooseUs", () => {
  it("lists the five reasons", () => {
    render(<WhyChooseUs />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /More Than a Website.*A Long-Term Digital Partner/
    );
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Business-Focused Solutions",
      "Reliable & Secure",
      "Experienced Team",
      "Long-Term Support",
      "Proven Results",
    ]);
  });
});

describe("Partners", () => {
  it("links to each partner in a new tab", () => {
    render(<Partners />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "https://www.vultr.com/?ref=9611520-8H",
      "https://bluehost.sjv.io/y2M9by",
      "https://aws.amazon.com/",
    ]);
    links.forEach((l) => {
      expect(l).toHaveAttribute("target", "_blank");
      expect(l).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});

describe("PageFooter", () => {
  it("has social links, quick links and a contact button, but no Our Work column", () => {
    render(<PageFooter />);
    SOCIAL_LINKS.forEach((s) => {
      expect(screen.getByRole("link", { name: s.label })).toHaveAttribute("href", s.url);
    });
    const headings = screen.getAllByRole("heading").map((h) => h.textContent);
    expect(headings).toEqual(["Quick Links", "Contact"]);
    allMenuItems.forEach((item) => {
      expect(screen.getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href
      );
    });
    expect(screen.getByRole("link", { name: /Get in Touch/ })).toHaveAttribute(
      "href",
      CONTACT_PAGE_URL
    );
    expect(screen.getByText("© Copyright Sysbox Pty Ltd")).toBeInTheDocument();
  });
});
