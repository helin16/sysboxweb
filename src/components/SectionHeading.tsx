import { ReactNode } from "react";

type iSectionHeading = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  /** Heading level for the title; sections use h2, page titles h1. */
  as?: "h1" | "h2";
  className?: string;
};

/** Small blue label, bold title and optional intro, as used site-wide. */
const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "center",
  as: Title = "h2",
  className = "",
}: iSectionHeading) => (
  <div
    className={`${
      align === "center" ? "text-center mx-auto" : "text-left"
    } max-w-2xl ${className}`}
  >
    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
      {eyebrow}
    </p>
    <Title className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight text-balance">
      {title}
    </Title>
    {description && (
      <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-600">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
