import Link from "next/link";
import AppLogo from "./AppLogo";
import ContactUsBtn from "./ContactUsBtn";
import { allMenuItems } from "./PageHeader";

export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/sysboxteam/",
    svg: (
      <path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path>
    ),
  },
  {
    label: "LinkedIn",
    url: "https://au.linkedin.com/company/sysbox",
    svg: (
      <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3 C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548 c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669 v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037 c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z"></path>
    ),
  },
  {
    label: "Twitter",
    url: "https://twitter.com/sysboxteam",
    svg: (
      <path d="M22.23,5.924c-0.736,0.326-1.527,0.547-2.357,0.646c0.847-0.508,1.498-1.312,1.804-2.27 c-0.793,0.47-1.671,0.812-2.606,0.996C18.324,4.498,17.257,4,16.077,4c-2.266,0-4.103,1.837-4.103,4.103 c0,0.322,0.036,0.635,0.106,0.935C8.67,8.867,5.647,7.234,3.623,4.751C3.27,5.357,3.067,6.062,3.067,6.814 c0,1.424,0.724,2.679,1.825,3.415c-0.673-0.021-1.305-0.206-1.859-0.513c0,0.017,0,0.034,0,0.052c0,1.988,1.414,3.647,3.292,4.023 c-0.344,0.094-0.707,0.144-1.081,0.144c-0.264,0-0.521-0.026-0.772-0.074c0.522,1.63,2.038,2.816,3.833,2.85 c-1.404,1.1-3.174,1.756-5.096,1.756c-0.331,0-0.658-0.019-0.979-0.057c1.816,1.164,3.973,1.843,6.29,1.843 c7.547,0,11.675-6.252,11.675-11.675c0-0.178-0.004-0.355-0.012-0.531C20.985,7.47,21.68,6.747,22.23,5.924z"></path>
    ),
  },
];

const FooterHeading = ({ children }: { children: string }) => (
  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
    {children}
  </h2>
);

const PageFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-block">
            <span className="sr-only">Sysbox</span>
            <AppLogo width={240} className="h-auto w-[220px] sm:w-[240px]" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            Inspiring and Interactive Technical Services. We are a group of
            developers who have 15+ years of commercial experience and are
            passionate about what we do.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIAL_LINKS.map((icon) => (
              <a
                key={icon.url}
                href={icon.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  {icon.svg}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <FooterHeading>Quick Links</FooterHeading>
          <ul className="mt-4 space-y-3">
            {allMenuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm text-slate-600 hover:text-blue-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <FooterHeading>Contact</FooterHeading>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            Have a project in mind? We’d love to hear from you.
          </p>
          <ContactUsBtn size="sm" className="mt-4 whitespace-nowrap" />
        </div>
      </div>
      <div className="border-t border-slate-200">
        <p className="container mx-auto px-4 lg:px-6 py-6 text-center text-sm text-slate-500">
          © Copyright Sysbox Pty Ltd
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
