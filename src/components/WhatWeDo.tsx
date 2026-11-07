import Link from "next/link";
import SectionHeading from "./SectionHeading";
import LineIcon from "./LineIcon";
import { SERVICES, serviceUrl } from "./services";

const WhatWeDo = () => (
  <div>
    <SectionHeading
      eyebrow="Our Services"
      title="End-to-End Digital Solutions"
      description="From website development to custom business systems, we provide a full range of services to help your business grow online."
    />

    <ul className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <li key={service.slug}>
          <Link
            href={serviceUrl(service)}
            aria-label={`${service.title} – learn more`}
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="text-blue-600 [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7">
              <LineIcon>{service.icon}</LineIcon>
            </span>
            <h3 className="mt-3 sm:mt-5 text-[15px] leading-snug sm:text-lg font-bold text-slate-900">
              {service.title}
            </h3>
            <p className="mt-1.5 sm:mt-2 text-[13px] leading-5 sm:text-base sm:leading-7 text-slate-600">
              {service.description}
            </p>
            {service.items && (
              <ul className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-slate-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <span className="mt-auto pt-4 sm:pt-6 text-blue-600" aria-hidden="true">
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
