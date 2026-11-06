import Link from "next/link";

export const CONTACT_PAGE_URL = "/contact";

type iContactUsBtn = {
  className?: string;
  style?: any;
  label?: string;
  href?: string;
  /** solid: blue button; outline: white with border; light: white on blue. */
  variant?: "solid" | "outline" | "light";
  size?: "sm" | "md";
  withArrow?: boolean;
};

const VARIANTS = {
  solid:
    "bg-blue-600 text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700",
  outline:
    "bg-white text-slate-900 border border-slate-300 hover:border-blue-600 hover:text-blue-600",
  light: "bg-white text-blue-700 shadow-sm hover:bg-blue-50",
};

const ContactUsBtn = ({
  className,
  style,
  label = "Get in Touch",
  href = CONTACT_PAGE_URL,
  variant = "solid",
  size = "md",
  withArrow = true,
}: iContactUsBtn) => {
  return (
    <Link
      href={href}
      style={style}
      className={`group inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
        size === "sm" ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
      } ${VARIANTS[variant]} ${className || ""}`}
    >
      {label}
      {withArrow && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </Link>
  );
};

export default ContactUsBtn;
