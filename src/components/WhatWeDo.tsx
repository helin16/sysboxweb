import { ReactNode } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { CONTACT_PAGE_URL } from "./ContactUsBtn";

/** 24px line icon in the site's blue. */
const LineIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

type iService = {
  title: string;
  description: string;
  icon: ReactNode;
  /** Technologies and platforms we work with for this service. */
  items?: string[];
};

const SERVICES: iService[] = [
  {
    title: "Web Development",
    description: "Modern, responsive and secure websites built for performance.",
    icon: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />,
    items: ["WordPress themes", "WordPress plugins", "API connectors"],
  },
  {
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
  },
  {
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
  },
  {
    title: "Custom Software",
    description: "Tailored web applications to streamline your business.",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
    items: ["ERP", "MRP", "CRM"],
  },
  {
    title: "SEO & Online Growth",
    description: "Improve your visibility and attract the right customers.",
    icon: (
      <>
        <rect x="3" y="14" width="4" height="7" rx="0.5" />
        <rect x="10" y="9" width="4" height="12" rx="0.5" />
        <rect x="17" y="3" width="4" height="18" rx="0.5" />
      </>
    ),
  },
  {
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
  },
];

const WhatWeDo = () => (
  <div>
    <SectionHeading
      eyebrow="Our Services"
      title="End-to-End Digital Solutions"
      description="From website development to custom business systems, we provide a full range of services to help your business grow online."
    />

    <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <li key={service.title}>
          <Link
            href={CONTACT_PAGE_URL}
            aria-label={`${service.title} – enquire with us`}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="text-blue-600">
              <LineIcon>{service.icon}</LineIcon>
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {service.title}
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-600">
              {service.description}
            </p>
            {service.items && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <span className="mt-auto pt-6 text-blue-600" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default WhatWeDo;
