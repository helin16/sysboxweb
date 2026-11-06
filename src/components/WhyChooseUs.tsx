import { ReactNode } from "react";
import SectionHeading from "./SectionHeading";

const LineIcon = ({ children }: { children: ReactNode }) => (
  <svg
    width="26"
    height="26"
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

const REASONS = [
  {
    title: "Business-Focused Solutions",
    text: "We build with your business goals in mind.",
    icon: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  },
  {
    title: "Reliable & Secure",
    text: "Modern, stable and secure technology you can trust.",
    icon: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Experienced Team",
    text: "A local team with real-world industry experience.",
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
    title: "Long-Term Support",
    text: "We’re here beyond launch, with ongoing care and growth.",
    icon: (
      <>
        <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
        <path d="M4 3v5h5" />
        <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
        <path d="M20 21v-5h-5" />
      </>
    ),
  },
  {
    title: "Proven Results",
    text: "Solutions that improve efficiency, engagement and revenue.",
    icon: (
      <>
        <rect x="3" y="14" width="4" height="7" rx="0.5" />
        <rect x="10" y="9" width="4" height="12" rx="0.5" />
        <rect x="17" y="3" width="4" height="18" rx="0.5" />
      </>
    ),
  },
];

const WhyChooseUs = () => (
  <div className="grid gap-12 lg:grid-cols-5 lg:gap-16 items-start">
    <div className="lg:col-span-2 lg:sticky lg:top-28">
      <SectionHeading
        align="left"
        eyebrow="Why Choose Us"
        title={
          <>
            More Than a Website —<br className="hidden sm:block" /> A
            Long-Term Digital Partner
          </>
        }
        description="We combine technical expertise, business understanding and a practical, results-driven approach to deliver solutions that truly work for you."
      />
    </div>
    <ul className="lg:col-span-3 space-y-4">
      {REASONS.map((reason) => (
        <li
          key={reason.title}
          className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <LineIcon>{reason.icon}</LineIcon>
          </span>
          <div>
            <h3 className="font-bold text-slate-900">{reason.title}</h3>
            <p className="mt-1 text-slate-600">{reason.text}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default WhyChooseUs;
