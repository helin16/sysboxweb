import { SOCIAL_LINKS } from "./PageFooter";
import { GOOGLE_MAPS_URL } from "./GoogleReviews";

/**
 * The site's main address. sysbox.com.au and www.sysbox.com.au both serve the
 * site, so every page points search engines at this one (the canonical URL).
 * Override with NEXT_PUBLIC_SITE_URL if the main domain changes.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sysbox.com.au").replace(/\/$/, "");
export const SITE_NAME = "Sysbox Digital";
export const LEGAL_NAME = "Sysbox Pty Ltd";

export const DEFAULT_TITLE =
  "Sysbox Digital | Websites, Custom Software & eCommerce";
export const DEFAULT_DESCRIPTION =
  "Sysbox builds modern websites, eCommerce stores and custom business software like ERP, CRM and MRP systems. 15+ years' experience and long-term support.";

/** 1200×630 image shown when a page is shared on social media or in chat apps. */
export const OG_IMAGE = { path: "/og-image.png", width: 1200, height: 630 };

/** Absolute URL for a site path, e.g. "/contact" -> "https://sysbox.com.au/contact". */
export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "/" : path}`;

/** Structured data describing the business, for Google's knowledge panel. */
export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: LEGAL_NAME,
      alternateName: "Sysbox",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo-sysbox-digital.png"),
        width: 1915,
        height: 597,
      },
      image: absoluteUrl(OG_IMAGE.path),
      description: DEFAULT_DESCRIPTION,
      foundingDate: "2017",
      sameAs: [...SOCIAL_LINKS.map((s) => s.url), GOOGLE_MAPS_URL],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: absoluteUrl("/contact"),
        availableLanguage: "English",
      },
      knowsAbout: [
        "Web Development",
        "eCommerce",
        "UI/UX Design",
        "Custom Software",
        "ERP",
        "CRM",
        "MRP",
        "Search Engine Optimisation",
        "WordPress",
        "WooCommerce",
        "React",
        "Next.js",
        "Node.js",
        "AWS",
        "Artificial Intelligence",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: absoluteUrl("/"),
      name: SITE_NAME,
      inLanguage: "en-AU",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
});
