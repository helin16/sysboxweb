"use client";

import PageLayout from "@/components/PageLayout";
import PageHeroPanel from "@/components/PageHeroPanel";
import ContactUsBtn from "@/components/ContactUsBtn";
import PageSection from "@/components/PageSection";
import Image from "next/image";
import HubSpotForm from "@/components/HubSpotForm";
import {
  PAGE_NAME_ABOUT_US,
  PAGE_NAME_CONTACT_US,
  PAGE_NAME_HOME,
  PAGE_NAME_OUR_WORK,
  PAGE_NAME_SERVICES,
  PAGE_NAME_TESTIMONIALS,
} from "@/components/PageHeader";

const HomePage = () => {
  return (
    <PageLayout pageTitle={"Sysbox - make your ideas shine since 2017"}>
      <PageHeroPanel className="bg-[url('/images/bg-blur.png')] bg-cover bg-no-repeat bg-transparent">
        <div className="pt-44 pb-10 px-20 lg:mt-32">
          <h1 className="text-white lg:text-8xl md:text-5xl text-4xl drop-shadow-xl">
            Make
          </h1>
          <h1 className="text-white lg:text-8xl md:text-5xl text-4xl drop-shadow-xl">
            Your Ideas Shine
          </h1>
          <div className="mt-4">
            <ContactUsBtn className={"z-40 relative"} />
          </div>
        </div>
      </PageHeroPanel>

      <PageSection
        id={PAGE_NAME_SERVICES}
        innerClassName="flex md:flex-row gap-8 flex-col"
      >
        {[
          {
            title: "Systems",
            description: `With 15+ years, we’ve developed customised systems like ERP, MRP,
          CRM`,
          },
          {
            title: "Websites",
            description: `Developed WP theme, WP plugins, WooCommerce, API connectors ...`,
          },
          {
            title: "Support",
            description: `AWS Suite, Shared Hosted (Bluehost, CrazyDomain), Microsoft ...`,
          },
        ].map((section) => {
          return (
            <div
              key={section.title}
              className="md:w-1/3 text-center bg-white shadow-lg lg:px-12 lg:py-20 p-10"
            >
              <h3 className="text-black lg:text-2xl text-xl py-2 font-semibold">
                {section.title}
              </h3>
              <div className="font-sm">{section.description}</div>
            </div>
          );
        })}
      </PageSection>

      <div
        id={PAGE_NAME_ABOUT_US}
        className="mt-24 flex lg:flex-row gap-8 flex-col justify-stretch"
      >
        <div className="lg:w-1/2">
          <Image
            src={"/images/home-single-image-2.png"}
            width={1000}
            height={1000}
            alt="About Us"
          />
        </div>
        <div className="lg:w-1/2 lg:pt-20 lg:pb-48 px-3 lg:pr-[15%]">
          <h3 className="uppercase text-yellow-400 text-xl px-4">About Us</h3>
          <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-10 md:text-3xl lg:text-6xl px-4">
            Passion, Dedication, <br />
            and a lot of coffee.
          </h1>
          <p className="leading-7 lg:leading-9 text-lg pr-4 px-4">
            Welcome to Inspiring and Interactive Technical Services. Our team
            comprises seasoned developers boasting over 15 years of extensive
            commercial experience, all driven by an unwavering passion for their
            craft. At the core of our operations lies a deep commitment to
            excellence, as we strive to deliver innovative solutions that
            consistently exceed expectations.
          </p>
        </div>
      </div>

      <PageSection
        id={PAGE_NAME_OUR_WORK}
        innerClassName="text-center m-auto"
        className="mt-24"
      >
        <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-10 md:text-3xl lg:text-6xl">
          Latest Work
        </h1>
        <p className="xl:w-2/5 m-auto text-lg pb-10">
          We’ve done a lot of customised systems, websites, and supported
          various frameworks and platforms. Below are the ones we’ve done
          recently.
        </p>
        <div className="flex lg:px-24 flex-wrap">
          {[
            {
              src: "/images/MIESoft.png",
              url: "https://miesoft.com.au",
              alt: "MIESoft",
            },
            {
              src: "/images/ShowMine.png",
              url: "https://showmine.com.au",
              alt: "ShowMine",
            },
            {
              src: "/images/MERP.png",
              url: "https://merp.com.au",
              alt: "MERP",
            },
            {
              src: "/images/Shamrock.png",
              url: "https://shamrockpoly.com.au",
              alt: "Shamrock Poly",
            },
            {
              src: "/images/xjslibrary.png",
              url: "https://xjslibrary.org.au",
              alt: "XJS Library",
            },
            {
              src: "/images/Artchain.png",
              url: "#",
              alt: "Artchain Global",
            },
            {
              src: "/images/snugglepotts.png",
              url: "https://snugglepotts.com.au",
              alt: "Snugglepotts ELC",
            },
            {
              src: "/images/Great_Oceania.png",
              url: "https://greatoceania.com.au",
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
      </PageSection>

      <div
        id={PAGE_NAME_TESTIMONIALS}
        className="mt-24 flex lg:flex-row-reverse gap-8 flex-col justify-stretch"
      >
        <div className="lg:w-1/2 flex justify-end">
          <Image
            src={"/images/home-single-image-4.png"}
            width={1000}
            height={1000}
            alt="About Us"
          />
        </div>
        <div className="lg:w-1/2 lg:pt-20 lg:pb-48 px-3 lg:pl-[15%]">
          <h3 className="uppercase text-yellow-400 text-xl px-4">
            TESTIMONIAL
          </h3>
          <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-10 md:text-3xl lg:text-6xl px-4">
            Professional, Prompt, & Dedicated support.
          </h1>
          <p className="leading-7 lg:leading-9 text-lg px-4">
            “Sysbox has been a game-changer for us. Their professionalism,
            prompt responses, and dedicated support during implementation have
            put us ahead of competitors. They’ve truly been a valuable partner
            in our journey towards technological excellence.”
          </p>
        </div>
      </div>

      <PageSection
        id={PAGE_NAME_CONTACT_US}
        innerClassName="bg-white lg:flex lg:px-16 px-4 py-16 gap-10 rounded-md"
        className="mt-24"
      >
        <div className="lg:w-2/5">
          <h1 className="text-4xl text-black font-semibold pt-4 pb-4 lg:pb-6 md:text-3xl lg:text-5xl">
            Get in Touch!
          </h1>
          <p className="leading-8 pb-10">
            Whether you have questions, project ideas, or are interested in
            exploring how our expertise can benefit your business, we’re here to
            listen and provide solutions tailored to your needs. Your inquiries
            are important to us, and we look forward to the opportunity to
            assist you. Feel free to reach out, and let’s start a conversation
            that could lead to exciting possibilities.
          </p>
        </div>
        <div className="lg:w-3/5">
          <HubSpotForm formId="08d84a8d-7587-4de9-b206-1aa798db62ce" />
        </div>
      </PageSection>
    </PageLayout>
  );
};

export default HomePage;
