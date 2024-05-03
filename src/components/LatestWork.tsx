import Image from "next/image";
import {
  URL_GREAT_OCEANIA,
  URL_MERP,
  URL_MIESOFT,
  URL_SHAMROCKPLOY,
  URL_SHOWMINE,
  URL_SNUGGLE_POTTS,
  URL_XJS_LIBRARY,
} from "./Url";

const LatestWork = () => {
  return (
    <>
      <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-10 md:text-3xl lg:text-6xl">
        Latest Work
      </h1>
      <p className="xl:w-2/5 m-auto text-lg pb-10">
        We’ve done a lot of customised systems, websites, and supported various
        frameworks and platforms. Below are the ones we’ve done recently.
      </p>
      <div className="flex lg:px-24 flex-wrap">
        {[
          {
            src: "/images/MIESoft.webp",
            url: URL_MIESOFT,
            alt: "MIESoft",
          },
          {
            src: "/images/ShowMine.webp",
            url: URL_SHOWMINE,
            alt: "ShowMine",
          },
          {
            src: "/images/MERP.webp",
            url: URL_MERP,
            alt: "MERP",
          },
          {
            src: "/images/Shamrock.webp",
            url: URL_SHAMROCKPLOY,
            alt: "Shamrock Poly",
          },
          {
            src: "/images/xjslibrary.webp",
            url: URL_XJS_LIBRARY,
            alt: "XJS Library",
          },
          {
            src: "/images/Artchain.webp",
            url: "#",
            alt: "Artchain Global",
          },
          {
            src: "/images/snugglepotts.webp",
            url: URL_SNUGGLE_POTTS,
            alt: "Snugglepotts ELC",
          },
          {
            src: "/images/Great_Oceania.webp",
            url: URL_GREAT_OCEANIA,
            alt: "Great Oceania",
          },
        ].map((showingCase: any) => {
          return (
            <div
              className="lg:w-1/4 md:w-1/2 w-full overflow-hidden"
              key={showingCase.alt}
            >
              <a href={showingCase.url}>
                <Image
                  className="transition-all ease-in hover:scale-110"
                  src={showingCase.src}
                  height={1000}
                  width={1000}
                  alt={showingCase.alt}
                />
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LatestWork;
