import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import PageSection from "@/components/PageSection";
import SectionHeading from "@/components/SectionHeading";
import ContactUsBtn from "@/components/ContactUsBtn";
import LineIcon from "@/components/LineIcon";
import LatestWork from "@/components/LatestWork";
import { PAGE_NAME_SERVICES } from "@/components/PageHeader";
import { SERVICES, findService, iService, serviceUrl } from "@/components/services";
import { LEGAL_NAME, SITE_URL, absoluteUrl } from "@/components/seo";

// Shown on every service page. Kept general so it's true of all our work.
const PROCESS = [
  { title: "Discover", text: "We learn about your business, your goals and what success looks like." },
  { title: "Plan & design", text: "We agree on scope, timeline and design before anything is built." },
  { title: "Build & test", text: "We build in stages, so you can see progress and give feedback." },
  { title: "Launch & support", text: "We go live together, then keep things running and improving." },
];

const serviceJsonLd = (service: iService) => {
  const url = absoluteUrl(serviceUrl(service));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: service.title,
        description: service.metaDescription,
        url,
        provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: LEGAL_NAME },
        areaServed: { "@type": "Country", name: "Australia" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/#services") },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
    ],
  };
};

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5L20 7" />
  </svg>
);

type iServicePage = { slug: string };

const ServicePage = ({ slug }: iServicePage) => {
  const service = findService(slug)!;
  const others = SERVICES.filter((s) => s.slug !== slug);

  return (
    <PageLayout
      pageTitle={service.metaTitle}
      pageDescription={service.metaDescription}
      path={serviceUrl(service)}
      jsonLd={serviceJsonLd(service)}
      currentPageName={PAGE_NAME_SERVICES}
    >
      {/* Intro */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="relative container mx-auto px-4 lg:px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/#services" className="hover:text-blue-600">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-slate-700">{service.title}</li>
            </ol>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <LineIcon>{service.icon}</LineIcon>
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                {service.title}
              </h1>
              {service.intro.map((p) => (
                <p key={p} className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
              <div className="mt-8 flex flex-wrap gap-4">
                <ContactUsBtn />
                <ContactUsBtn variant="outline" label="View Our Work" href="#work" withArrow={false} />
              </div>
            </div>
            <aside className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Why Sysbox?</h2>
              <ul className="mt-5 grid grid-cols-2 gap-5">
                {[
                  ["15+", "Years Experience"],
                  ["60+", "Happy Clients"],
                  ["100+", "Projects Delivered"],
                  ["99%", "Client Satisfaction"],
                ].map(([value, label]) => (
                  <li key={label}>
                    <p className="text-3xl font-extrabold tracking-tight text-blue-600">{value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
                  </li>
                ))}
              </ul>
              {service.items && (
                <>
                  <h3 className="mt-7 text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Platforms we work with
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {service.items.map((item) => (
                      <li key={item} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* What's included */}
      <PageSection id="included" className="bg-slate-50 py-16 lg:py-20" innerClassName="px-4 lg:px-6">
        <SectionHeading eyebrow="What's Included" title={`Our ${service.title} services`} />
        <ul className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {service.includes.map((item) => (
            <li key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CheckIcon />
              </span>
              <h3 className="mt-3 sm:mt-4 text-[15px] sm:text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 sm:text-base sm:leading-7 text-slate-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Process */}
      <PageSection id="process" className="py-16 lg:py-20" innerClassName="px-4 lg:px-6">
        <SectionHeading eyebrow="How We Work" title="A simple, transparent process" />
        <ol className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
              <span className="text-xs sm:text-sm font-bold text-blue-600">Step {i + 1}</span>
              <h3 className="mt-1.5 sm:mt-2 text-[15px] sm:text-lg font-bold text-slate-900 leading-snug">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 sm:text-base sm:leading-7 text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      {/* Portfolio */}
      <PageSection id="work" className="bg-slate-50 py-16 lg:py-20" innerClassName="px-4 lg:px-6">
        <LatestWork />
      </PageSection>

      {/* Other services */}
      <PageSection id="other-services" className="py-16 lg:py-20" innerClassName="px-4 lg:px-6">
        <SectionHeading eyebrow="More Services" title="Other ways we can help" />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={serviceUrl(s)}
                className="group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <span className="shrink-0 text-blue-600">
                  <LineIcon size={22}>{s.icon}</LineIcon>
                </span>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Call to action */}
      <PageSection className="pb-20 lg:pb-24" innerClassName="px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-12 lg:px-16 lg:py-14 text-center lg:text-left">
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Let’s talk about your project
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Tell us what you need and we’ll get back to you with ideas and next steps.
              </p>
            </div>
            <div className="shrink-0">
              <ContactUsBtn variant="light" />
            </div>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SERVICES.map((s) => ({ params: { slug: s.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<iServicePage> = async ({ params }) => {
  const slug = String(params?.slug);
  if (!findService(slug)) return { notFound: true };
  return { props: { slug } };
};

export default ServicePage;
