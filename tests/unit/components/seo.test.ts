import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  absoluteUrl,
  organizationJsonLd,
} from "@/components/seo";

describe("seo", () => {
  it("keeps the title and description within what Google shows", () => {
    expect(DEFAULT_TITLE.length).toBeLessThanOrEqual(60);
    expect(DEFAULT_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });

  it("builds absolute URLs on the main domain", () => {
    expect(absoluteUrl()).toBe("https://sysbox.com.au/");
    expect(absoluteUrl("/")).toBe("https://sysbox.com.au/");
    expect(absoluteUrl("/contact")).toBe("https://sysbox.com.au/contact");
  });

  it("describes the organisation with its logo, socials and contact page", () => {
    const [org, site] = organizationJsonLd()["@graph"] as any[];
    expect(org).toMatchObject({
      "@type": "Organization",
      name: "Sysbox Digital",
      legalName: "Sysbox Pty Ltd",
      url: "https://sysbox.com.au/",
      foundingDate: "2017",
      logo: { url: "https://sysbox.com.au/images/logo-sysbox-digital.png" },
      contactPoint: { url: "https://sysbox.com.au/contact" },
    });
    expect(org.sameAs).toEqual(
      expect.arrayContaining([
        "https://www.facebook.com/sysboxteam/",
        "https://au.linkedin.com/company/sysbox",
      ])
    );
    expect(site).toMatchObject({ "@type": "WebSite", publisher: { "@id": org["@id"] } });
  });

  it("uses NEXT_PUBLIC_SITE_URL when set, without a trailing slash", () => {
    const before = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.com/";
    jest.isolateModules(() => {
      const seo = require("@/components/seo");
      expect(seo.absoluteUrl("/contact")).toBe("https://www.example.com/contact");
    });
    process.env.NEXT_PUBLIC_SITE_URL = before;
  });
});
