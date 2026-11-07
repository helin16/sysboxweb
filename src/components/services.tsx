import { ReactNode } from "react";

/**
 * Everything the site says about each service: the home page cards and the
 * /services/[slug] pages are both built from this list.
 */
export type iService = {
  slug: string;
  title: string;
  /** One-line summary for cards. */
  description: string;
  icon: ReactNode;
  /** Technologies and platforms we work with for this service. */
  items?: string[];
  /** <title> and meta description for the service page. */
  metaTitle: string;
  metaDescription: string;
  /** Opening paragraphs on the service page. */
  intro: string[];
  /** "What's included" points. */
  includes: { title: string; text: string }[];
};

export const SERVICES: iService[] = [
  {
    slug: "web-development",
    title: "Web Development",
    description: "Modern, responsive and secure websites built for performance.",
    icon: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />,
    items: ["WordPress themes", "WordPress plugins", "API connectors"],
    metaTitle: "Web Development | Sysbox Digital",
    metaDescription:
      "Fast, secure and responsive websites built by an experienced local team. Custom WordPress themes and plugins, API integrations and ongoing support.",
    intro: [
      "Your website is often the first thing a customer sees. We build modern, responsive sites that load quickly, look great on every screen and are easy for your team to keep up to date.",
      "Whether you need a new site from scratch, a custom WordPress theme or plugin, or a connection between your website and the systems you already use, we build it to last and support it after launch.",
    ],
    includes: [
      { title: "Custom websites", text: "Designed around your brand and goals, not a one-size-fits-all template." },
      { title: "WordPress themes & plugins", text: "Bespoke themes and plugins that add exactly the features you need." },
      { title: "API connectors", text: "Link your site to booking, payment, CRM and other business systems." },
      { title: "Responsive & accessible", text: "Works on phones, tablets and desktops, and for every visitor." },
      { title: "Speed & security", text: "Built for fast loading and kept secure with updates and good practice." },
      { title: "Easy to manage", text: "Update your own content without needing a developer for every change." },
    ],
  },
  {
    slug: "ecommerce",
    title: "eCommerce Solutions",
    description: "Scalable online stores that drive sales and growth.",
    icon: (
      <>
        <path d="M2 3h2.5l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.1L21 7H5.6" />
        <circle cx="9" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </>
    ),
    items: ["WooCommerce"],
    metaTitle: "eCommerce & WooCommerce Development | Sysbox Digital",
    metaDescription:
      "Online stores that are easy to run and built to grow. WooCommerce setup, custom features, payment and shipping integrations, and ongoing support.",
    intro: [
      "We build online stores that are simple for customers to buy from and simple for you to run. From product catalogues to checkout, every step is designed to turn visitors into customers.",
      "We specialise in WooCommerce, so your store sits on a flexible, widely supported platform that can grow with your range, your orders and your business.",
    ],
    includes: [
      { title: "WooCommerce stores", text: "Set up and tailored to your products, pricing and brand." },
      { title: "Payments & shipping", text: "Connect the payment gateways and delivery options your customers expect." },
      { title: "Custom features", text: "Add-ons built for how you sell, from bundles to wholesale pricing." },
      { title: "System integrations", text: "Link orders and stock to your accounting, ERP or inventory systems." },
      { title: "Mobile-friendly checkout", text: "A smooth buying experience on every device." },
      { title: "Growth & support", text: "Ongoing improvements, updates and help when you need it." },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    description: "User-centred designs that are intuitive, beautiful and effective.",
    icon: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
      </>
    ),
    metaTitle: "UI / UX Design | Sysbox Digital",
    metaDescription:
      "User-centred design for websites and business software. Clear layouts, intuitive journeys and a consistent look that make your product easy to use.",
    intro: [
      "Good design is about more than looks. We design websites and applications around the people who use them, so they can find what they need and get things done without friction.",
      "Because the same team designs and builds, our designs are practical to deliver and stay true to the plan all the way to launch.",
    ],
    includes: [
      { title: "User journeys", text: "Map out how customers and staff move through your site or system." },
      { title: "Wireframes & prototypes", text: "Try ideas early, before anything is built." },
      { title: "Visual design", text: "A clean, consistent look that reflects your brand." },
      { title: "Design for every screen", text: "Layouts that work on phones, tablets and desktops." },
      { title: "Accessibility", text: "Readable, usable designs for everyone." },
      { title: "Design that's built", text: "The same team takes the design through to a working product." },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    description: "Tailored web applications to streamline your business.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
    items: ["ERP", "MRP", "CRM"],
    metaTitle: "Custom Software, ERP & CRM Development | Sysbox Digital",
    metaDescription:
      "Custom web applications built around how your business works: ERP, MRP and CRM systems, workflow automation and integrations, with long-term support.",
    intro: [
      "Off-the-shelf software rarely fits perfectly. We build web applications around the way your business actually works, so your team spends less time on spreadsheets and workarounds and more time on what matters.",
      "From ERP and MRP systems that manage stock and production, to CRMs that keep track of every customer, we design, build and support systems that grow with you.",
    ],
    includes: [
      { title: "ERP systems", text: "Bring orders, stock, purchasing and finance together in one place." },
      { title: "MRP systems", text: "Plan production and materials with accurate, up-to-date information." },
      { title: "CRM systems", text: "Keep every customer, enquiry and follow-up organised." },
      { title: "Workflow automation", text: "Replace manual, repetitive tasks with reliable automated processes." },
      { title: "Integrations", text: "Connect your new system to the tools and data you already use." },
      { title: "Secure & scalable", text: "Modern technology such as React, Node.js, PostgreSQL and AWS." },
    ],
  },
  {
    slug: "seo",
    title: "SEO & Online Growth",
    description: "Improve your visibility and attract the right customers.",
    icon: (
      <>
        <rect x="3" y="14" width="4" height="7" rx="0.5" />
        <rect x="10" y="9" width="4" height="12" rx="0.5" />
        <rect x="17" y="3" width="4" height="18" rx="0.5" />
      </>
    ),
    metaTitle: "SEO & Online Growth | Sysbox Digital",
    metaDescription:
      "Help the right customers find you. Technical SEO, fast and well-structured websites, Google Search Console setup and practical advice to grow online.",
    intro: [
      "A great website only works if people can find it. We help search engines understand your site and help the right customers discover your business.",
      "As developers, we focus on the technical foundations that matter most: a fast, well-structured, mobile-friendly site that search engines can read easily.",
    ],
    includes: [
      { title: "Technical SEO", text: "Page titles, descriptions, structured data, sitemaps and clean page structure." },
      { title: "Speed & performance", text: "Faster pages for better rankings and happier visitors." },
      { title: "Mobile-friendly", text: "Sites that work well on the phones most people search from." },
      { title: "Google Search Console", text: "Set up and monitored so you can see how people find you." },
      { title: "Content structure", text: "Pages organised around what your customers are searching for." },
      { title: "Practical advice", text: "Clear next steps to keep growing your online presence." },
    ],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Support",
    description: "Ongoing care, updates and reliable technical support.",
    icon: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
        <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
        <path d="M19.5 19v.5a2.5 2.5 0 0 1-2.5 2.5h-3" />
      </>
    ),
    items: ["AWS Suite", "Shared hosting (Bluehost, CrazyDomains)", "Microsoft"],
    metaTitle: "Website & Software Maintenance and Support | Sysbox Digital",
    metaDescription:
      "Professional, prompt and dedicated support for your website and systems. Updates, security, backups and hosting on AWS, Bluehost, CrazyDomains and Microsoft.",
    intro: [
      "Launch day is just the beginning. We keep your website and systems up to date, secure and running smoothly, so you can focus on your business.",
      "Whether your site is on AWS, shared hosting such as Bluehost or CrazyDomains, or Microsoft services, we look after it with professional, prompt and dedicated support.",
    ],
    includes: [
      { title: "Updates & patches", text: "Keep your software, plugins and platforms current and secure." },
      { title: "Security & backups", text: "Protect your site and data, and recover quickly if something goes wrong." },
      { title: "Hosting management", text: "AWS, Bluehost, CrazyDomains and Microsoft environments looked after for you." },
      { title: "Monitoring", text: "Spot and fix problems before they affect your customers." },
      { title: "Changes & improvements", text: "Small updates and new features whenever you need them." },
      { title: "Responsive help", text: "A local team that knows your systems and answers promptly." },
    ],
  },
];

export const serviceUrl = (service: iService) => `/services/${service.slug}`;

export const findService = (slug: string) => SERVICES.find((s) => s.slug === slug);
