import Image from "next/image";
import Link from "next/link";

const Partners = () => {
  return (
    <>
      <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-10 md:text-3xl lg:text-6xl text-center">
        Partners
      </h1>
      <p className="xl:w-3/5 m-auto text-lg pb-10 text-center">
        We team up with top companies known for reliability and generosity,
        securing discounts for our customers. These partnerships enhance their
        experience and value, ensuring they get the most out of their
        investments.
      </p>
      <div className="flex flex-wrap items-stretch justify-center gap-10 px-6">
        {[
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
        ].map((item) => {
          return (
            <Link
              key={item.title}
              href={item.link}
              target="__BLANK"
              className="lg:w-[350px] w-max-full bg-white rounded-lg p-3 flex flex-col items-center justify-center overflow-hidden"
              title={item.description}
            >
              <Image
                src={item.imageUrl}
                height={1000}
                width={1000}
                alt={item.title}
                className="transition-all ease-in hover:scale-110"
              />
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Partners;
