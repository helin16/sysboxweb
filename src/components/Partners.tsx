import Image from "next/image";
import SectionHeading from "./SectionHeading";

const PARTNERS = [
  {
    title: "Vultr",
    link: "https://www.vultr.com/?ref=9611520-8H",
    imageUrl: "/images/vultr.webp",
    description: "Claim your $100 now.",
  },
  {
    title: "BlueHost",
    link: "https://bluehost.sjv.io/y2M9by",
    imageUrl: "/images/bluehost.webp",
    description: "Best place to hold your WordPress site!",
  },
  {
    title: "AWS",
    link: "https://aws.amazon.com/",
    imageUrl: "/images/aws.webp",
    description: "Amazon Web Services",
  },
];

const Partners = () => {
  return (
    <>
      <SectionHeading
        eyebrow="Our Partners"
        title="Partners"
        description="We team up with top companies known for reliability and generosity, securing discounts for our customers. These partnerships enhance their experience and value, ensuring they get the most out of their investments."
      />
      <ul className="mt-14 grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((item) => (
          <li key={item.title}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              title={item.description}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60"
            >
              <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
                <Image
                  src={item.imageUrl}
                  height={600}
                  width={800}
                  alt={item.title}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-500">{item.description}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Partners;
