"use client";

import { ReactNode } from "react";
import PageLayout from "@/components/PageLayout";
import ContactUsBtn from "@/components/ContactUsBtn";
import PageSection from "@/components/PageSection";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";
import {
  PAGE_NAME_ABOUT_US,
  PAGE_NAME_OUR_WORK,
  PAGE_NAME_SERVICES,
  PAGE_NAME_TESTIMONIALS,
} from "@/components/PageHeader";
import GoogleReviews from "@/components/GoogleReviews";
import Partners from "@/components/Partners";
import LatestWork from "@/components/LatestWork";
import WhatWeDo from "@/components/WhatWeDo";
import NewsList from "@/components/NewsList";
import OurExpertise from "@/components/OurExpertise";
import WhyChooseUs from "@/components/WhyChooseUs";

/** Simple 24px line icons in the site's blue. */
const Icon = ({ children }: { children: ReactNode }) => (
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

// Figures supplied by Sysbox.
const STATS = [
  {
    value: "15+",
    label: "Years Experience",
    icon: <path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16" />,
  },
  {
    value: "60+",
    label: "Happy Clients",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <circle cx="17.5" cy="6.5" r="2.5" />
        <path d="M17 13a5 5 0 0 1 4.5 5" />
      </>
    ),
  },
  {
    value: "100+",
    label: "Projects Delivered",
    icon: (
      <>
        <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
        <path d="m3 12 9 4.5 9-4.5" />
        <path d="m3 16.5 9 4.5 9-4.5" />
      </>
    ),
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    icon: (
      <>
        <rect x="3" y="15" width="4" height="6" rx="0.5" />
        <rect x="10" y="10" width="4" height="11" rx="0.5" />
        <rect x="17" y="3" width="4" height="18" rx="0.5" />
      </>
    ),
  },
];

// Points drawn from the About Us text below.
const ABOUT_POINTS = [
  {
    title: "Seasoned developers",
    text: "Over 15 years of extensive commercial experience.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
      </>
    ),
  },
  {
    title: "Commitment to excellence",
    text: "A deep commitment to excellence at the core of what we do.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  {
    title: "Innovative solutions",
    text: "Solutions that consistently exceed expectations.",
    icon: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" />
    ),
  },
];

const HomePage = () => {
  return (
    <PageLayout pageTitle={"Sysbox - make your ideas shine since 2017"}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-blue-100/60 blur-3xl"
        />
        <div className="relative container mx-auto px-4 lg:px-6 pt-12 pb-16 lg:pt-20 lg:pb-20 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Systems · Websites · Support
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Make Your Ideas <span className="text-blue-600">Shine</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Inspiring and Interactive Technical Services. We are a group of
              developers who have 15+ years of commercial experience and are
              passionate about what we do.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ContactUsBtn />
              <ContactUsBtn
                variant="outline"
                label="View Our Work"
                href={`/#${PAGE_NAME_OUR_WORK}`}
                withArrow={false}
              />
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-blue-900/20 ring-1 ring-slate-900/5">
              <Image
                src={"/images/bg-blur.webp"}
                width={1920}
                height={1080}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-auto brightness-[1.25] contrast-[1.1] saturate-[1.15]"
                alt="A developer working across a desktop monitor and a laptop"
              />
            </div>
            <div className="absolute -bottom-6 left-6 hidden sm:flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-slate-900/10">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Icon>
                  <path d="m5 12 5 5L20 7" />
                </Icon>
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Professional, Prompt
                </div>
                <div className="text-sm text-slate-500">& Dedicated support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 lg:px-6 pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-2 px-2"
              >
                <span className="text-blue-600 [&>svg]:h-9 [&>svg]:w-9 lg:[&>svg]:h-10 lg:[&>svg]:w-10">
                  <Icon>{stat.icon}</Icon>
                </span>
                <p className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm lg:text-base font-medium text-slate-700">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <PageSection
        id={PAGE_NAME_ABOUT_US}
        className="py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title="Passion, Dedication, and a lot of coffee."
            />
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Welcome to Inspiring and Interactive Technical Services. Our team
              comprises seasoned developers boasting over 15 years of extensive
              commercial experience, all driven by an unwavering passion for
              their craft. At the core of our operations lies a deep commitment
              to excellence, as we strive to deliver innovative solutions that
              consistently exceed expectations.
            </p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {ABOUT_POINTS.map((point) => (
                <li key={point.title}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon>{point.icon}</Icon>
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Image
              src={"/images/home-single-image-2.webp"}
              width={931}
              height={809}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full h-auto"
              alt="Two team members working together on a laptop"
            />
          </div>
        </div>
        <div className="mt-16">
          <OurExpertise />
        </div>
      </PageSection>

      {/* Services */}
      <PageSection
        id={PAGE_NAME_SERVICES}
        className="bg-slate-50 py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <WhatWeDo />
      </PageSection>

      {/* Portfolio */}
      <PageSection
        id={PAGE_NAME_OUR_WORK}
        className="py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <LatestWork />
      </PageSection>

      {/* Why choose us */}
      <PageSection
        id="why-us"
        className="bg-slate-50 py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <WhyChooseUs />
      </PageSection>

      {/* Testimonials */}
      <PageSection
        id={PAGE_NAME_TESTIMONIALS}
        className="py-20 lg:py-24 overflow-hidden"
        innerClassName="px-4 lg:px-6"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="min-w-0">
            <SectionHeading
              align="left"
              eyebrow="Testimonials"
              title="Professional, Prompt, & Dedicated support."
              description="Here’s what our clients say about working with us."
            />
            <div className="mt-8">
              <GoogleReviews
                fallback={
                  <p className="leading-7 lg:leading-9 text-lg text-slate-600">
                    “Sysbox has been a game-changer for us. Their
                    professionalism, prompt responses, and dedicated support
                    during implementation have put us ahead of competitors.
                    They’ve truly been a valuable partner in our journey towards
                    technological excellence.”
                  </p>
                }
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <Image
              src={"/images/home-single-image-4.webp"}
              width={940}
              height={825}
              sizes="50vw"
              className="w-full h-auto"
              alt="The team smiling together in the office"
            />
          </div>
        </div>
      </PageSection>

      {/* News */}
      <PageSection
        id="news"
        className="bg-slate-50 py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <NewsList noOfItems={3} />
      </PageSection>

      {/* Call to action */}
      <PageSection className="py-20 lg:py-24" innerClassName="px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-14 lg:px-16 lg:py-16 text-center lg:text-left">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-32 h-72 w-72 rounded-full bg-white/5"
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                Contact
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-white">
                Contact Us
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Have a question or a project idea? We’d love to hear from you.
              </p>
            </div>
            <div className="shrink-0">
              <ContactUsBtn variant="light" />
            </div>
          </div>
        </div>
      </PageSection>

      {/* Partners */}
      <PageSection
        id="partners"
        className="bg-slate-50 py-20 lg:py-24"
        innerClassName="px-4 lg:px-6"
      >
        <Partners />
      </PageSection>
    </PageLayout>
  );
};

export default HomePage;
