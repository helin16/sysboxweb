import Image from "next/image";
import SectionHeading from "./SectionHeading";
import {
  URL_FRENKEN_HOMES,
  URL_HAPPY_SEEDS,
  URL_MERP,
  URL_MIESOFT,
  URL_SHAMROCKPLOY,
  URL_SHOWMINE,
  URL_SNUGGLE_POTTS,
  URL_XJS_LIBRARY,
} from "./Url";

type iProject = {
  src: string;
  alt: string;
  /** Live site; projects without one are shown but not linked. */
  url?: string;
};

const PROJECTS: iProject[] = [
  { src: "/images/MIESoft.webp", url: URL_MIESOFT, alt: "MIESoft" },
  { src: "/images/ShowMine.webp", url: URL_SHOWMINE, alt: "ShowMine" },
  { src: "/images/MERP.webp", url: URL_MERP, alt: "MERP" },
  { src: "/images/Shamrock.webp", url: URL_SHAMROCKPLOY, alt: "Shamrock Poly" },
  { src: "/images/xjslibrary.webp", url: URL_XJS_LIBRARY, alt: "XJS Library" },
  {
    src: "/images/snugglepotts.webp",
    url: URL_SNUGGLE_POTTS,
    alt: "Snugglepotts ELC",
  },
  {
    src: "/images/HappySeeds.webp",
    url: URL_HAPPY_SEEDS,
    alt: "Happy Seeds ELC",
  },
  {
    src: "/images/FrenkenHomes.webp",
    url: URL_FRENKEN_HOMES,
    alt: "Frenken Homes",
  },
];

/** "https://MIESoft.com.au/" -> "miesoft.com.au" */
const displayDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url;
  }
};

const ArrowIcon = () => (
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
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const ProjectCard = ({ project }: { project: iProject }) => {
  const body = (
    <>
      <div className="overflow-hidden aspect-square bg-slate-100">
        <Image
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          src={project.src}
          height={600}
          width={600}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          alt={project.alt}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-4 text-left">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{project.alt}</div>
          {project.url && (
            <div className="text-sm text-slate-500 truncate">
              {displayDomain(project.url)}
            </div>
          )}
        </div>
        {project.url && (
          <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
            <ArrowIcon />
          </span>
        )}
      </div>
    </>
  );

  const cardClass =
    "group block h-full bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 ease-out";

  return project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.alt} (opens in a new tab)`}
      className={`${cardClass} hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
    >
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
};

const LatestWork = () => {
  return (
    <>
      <SectionHeading
        eyebrow="Our Portfolio"
        title="Latest Work"
        description="We’ve done a lot of customised systems, websites, and supported various frameworks and platforms. Below are the ones we’ve done recently."
      />
      {/* Flex-wrap rather than grid so a part-filled last row is centred. */}
      <ul className="mt-14 flex flex-wrap justify-center gap-6 lg:gap-8">
        {PROJECTS.map((project) => (
          <li
            key={project.alt}
            className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-6rem)/4)]"
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default LatestWork;
