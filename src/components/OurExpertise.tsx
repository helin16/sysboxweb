import { TECH_ICONS } from "./techIcons";

const BrandIcon = ({ path, color }: { path: string; color: string }) => (
  <svg
    viewBox="0 0 24 24"
    width="44"
    height="44"
    fill={color}
    aria-hidden="true"
  >
    <path d={path} />
  </svg>
);

/** AI chip: a processor outline with "AI" inside, in the site's blue. */
const AiIcon = () => (
  <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
    <defs>
      <linearGradient id="ai-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <g stroke="url(#ai-grad)" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M8 2.5v2.5M12 2.5v2.5M16 2.5v2.5M8 19v2.5M12 19v2.5M16 19v2.5M2.5 8h2.5M2.5 12h2.5M2.5 16h2.5M19 8h2.5M19 12h2.5M19 16h2.5" />
    </g>
    <rect x="5" y="5" width="14" height="14" rx="3" fill="url(#ai-grad)" />
    <text
      x="12"
      y="15.2"
      textAnchor="middle"
      fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
      fontWeight="800"
      fontSize="8"
      fill="#fff"
    >
      AI
    </text>
  </svg>
);

const EXPERTISE = [
  { name: "React", icon: <BrandIcon path={TECH_ICONS.react.path} color={TECH_ICONS.react.hex} /> },
  { name: "Next.js", icon: <BrandIcon path={TECH_ICONS.nextjs.path} color={TECH_ICONS.nextjs.hex} /> },
  { name: "Node.js", icon: <BrandIcon path={TECH_ICONS.nodejs.path} color={TECH_ICONS.nodejs.hex} /> },
  { name: "TypeScript", icon: <BrandIcon path={TECH_ICONS.typescript.path} color={TECH_ICONS.typescript.hex} /> },
  { name: "PostgreSQL", icon: <BrandIcon path={TECH_ICONS.postgresql.path} color={TECH_ICONS.postgresql.hex} /> },
  { name: "AWS", icon: <BrandIcon path={TECH_ICONS.aws.path} color={TECH_ICONS.aws.hex} /> },
  { name: "AI", icon: <AiIcon /> },
];

const OurExpertise = () => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:p-10">
    <h3 className="text-xl md:text-2xl font-bold text-slate-900">
      Our Expertise
    </h3>
    {/* Flex-wrap so a part-filled last row is centred. */}
    <ul className="mt-6 flex flex-wrap justify-center gap-4">
      {EXPERTISE.map((tech) => (
        <li
          key={tech.name}
          className="w-[calc((100%-2rem)/3)] sm:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-6rem)/7)] flex flex-col items-center gap-3 rounded-xl bg-white px-2 py-5 shadow-sm ring-1 ring-slate-200/70 transition-transform duration-300 hover:-translate-y-1"
        >
          {tech.icon}
          <span className="text-sm font-semibold text-slate-800">
            {tech.name}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default OurExpertise;
