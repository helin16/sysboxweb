import { ReactNode } from "react";
import PageLayout from "@/components/PageLayout";
import PageSection from "@/components/PageSection";
import HubSpotForm from "@/components/HubSpotForm";
import SectionHeading from "@/components/SectionHeading";
import { PAGE_NAME_CONTACT_US } from "@/components/PageHeader";
import { GOOGLE_MAPS_URL } from "@/components/GoogleReviews";
import { SOCIAL_LINKS } from "@/components/PageFooter";

const LineIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="22"
    height="22"
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

// Only contact routes the site already links to.
const CONTACT_ROUTES = [
  {
    label: "Find us on Google Maps",
    detail: "Sysbox Pty Ltd",
    url: GOOGLE_MAPS_URL,
    icon: (
      <LineIcon>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </LineIcon>
    ),
  },
  ...SOCIAL_LINKS.filter((s) => s.label !== "Twitter").map((s) => ({
    label: s.label,
    detail: s.label === "LinkedIn" ? "Follow our company page" : "Say hello on Facebook",
    url: s.url,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {s.svg}
      </svg>
    ),
  })),
];

const ContactPage = () => {
  return (
    <PageLayout
      pageTitle={"Contact us - Sysbox"}
      pageDescription={
        "Get in touch with Sysbox about custom systems, websites and support."
      }
      currentPageName={PAGE_NAME_CONTACT_US}
    >
      <PageSection
        className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-50/40 to-white py-16 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-blue-100/60 blur-3xl"
        />
        <div className="relative grid gap-12 lg:gap-16 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 lg:pt-4">
            <SectionHeading
              as="h1"
              align="left"
              eyebrow="Contact Us"
              title="Let’s Talk About Your Project"
            />
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Whether you have questions, project ideas, or are interested in
              exploring how our expertise can benefit your business, we’re here
              to listen and provide solutions tailored to your needs. Your
              inquiries are important to us, and we look forward to the
              opportunity to assist you. Feel free to reach out, and let’s start
              a conversation that could lead to exciting possibilities.
            </p>
            <ul className="mt-10 space-y-4">
              {CONTACT_ROUTES.map((route) => (
                <li key={route.url}>
                  <a
                    href={route.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-blue-600 group-hover:text-white group-hover:ring-blue-600">
                      {route.icon}
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900 group-hover:text-blue-700">
                        {route.label}
                      </span>
                      <span className="block text-sm text-slate-500">
                        {route.detail}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-blue-900/5 p-6 sm:p-10 min-h-[28rem]">
            <h2 className="text-xl font-bold text-slate-900">
              Send us a message
            </h2>
            <p className="mt-1 mb-6 text-sm text-slate-500">
              Fields marked * are required.
            </p>
            <HubSpotForm formId="08d84a8d-7587-4de9-b206-1aa798db62ce" />
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default ContactPage;
