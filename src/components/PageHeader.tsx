"use client";
import Link from "next/link";
import { Link as ScrollLink, animateScroll } from "react-scroll";
import { useEffect, useState } from "react";
import AppLogo from "./AppLogo";
import ContactUsBtn from "./ContactUsBtn";

export const PAGE_NAME_HOME = "home";
export const PAGE_NAME_SERVICES = "services";
export const PAGE_NAME_ABOUT_US = "about";
export const PAGE_NAME_OUR_WORK = "our-work";
export const PAGE_NAME_TESTIMONIALS = "testimonials";
export const PAGE_NAME_CONTACT_US = "contact";

export type iMenuItem = {
  name: string;
  href: string;
};

export const allMenuItems: iMenuItem[] = [
  { name: PAGE_NAME_HOME, href: "/" },
  { name: PAGE_NAME_SERVICES, href: `/#${PAGE_NAME_SERVICES}` },
  { name: PAGE_NAME_ABOUT_US, href: `/#${PAGE_NAME_ABOUT_US}` },
  { name: PAGE_NAME_OUR_WORK, href: `/#${PAGE_NAME_OUR_WORK}` },
  { name: PAGE_NAME_TESTIMONIALS, href: `/#${PAGE_NAME_TESTIMONIALS}` },
  { name: PAGE_NAME_CONTACT_US, href: `/#${PAGE_NAME_CONTACT_US}` },
];

type iPageHeader = {
  currentPageName?: string;
};

export default function PageHeader({
  currentPageName = PAGE_NAME_HOME,
}: iPageHeader) {
  const [showingSideMenu, setShowingSideMenu] = useState(false);
  const [activeMenuName, setActiveMenuName] = useState(PAGE_NAME_HOME);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getMenuItem = (item: iMenuItem, extraClassName = "") => {
    const btnClassName = `leading-6 uppercase text-gray-700 cursor-pointer hover:text-yellow-400 px-3 py-2 font-semibold ${
      extraClassName || ""
    } ${activeMenuName === item.name ? "text-yellow-400" : ""}`;
    const btnName = item.name.split("-").join(" ");

    if (item.name === PAGE_NAME_HOME) {
      return (
        <Link
          href={"/"}
          onClick={() => animateScroll.scrollToTop()}
          className={btnClassName}
        >
          {btnName}
        </Link>
      );
    }
    return (
      <ScrollLink
        activeClass="active"
        className={btnClassName}
        to={item.name}
        spy={true}
        smooth={true}
        hashSpy={true}
        offset={-100}
        duration={500}
        isDynamic={true}
        onSetActive={(to) => setActiveMenuName(to)}
        onSetInactive={() => setActiveMenuName("")}
        ignoreCancelEvents={false}
        spyThrottle={500}
      >
        {btnName}
      </ScrollLink>
    );
  };

  const getSideMenu = () => {
    if (showingSideMenu !== true) {
      return null;
    }
    return (
      <div>
        <div className={"absolute w-full left-0 top-0 z-50 bg-white p-6"}>
          <div className={"flex items-center justify-between"}>
            <AppLogo width={200} />
            <div className="flex gap-1 items-center">
              <div>Close</div>
              <button onClick={() => setShowingSideMenu(!showingSideMenu)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-list h-6 w-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-8 gap-4">
            {allMenuItems.map((menuItem) => getMenuItem(menuItem, "py-4"))}
          </div>

          <div className="flex mt-8">
            <ContactUsBtn />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        isSticky === true ? "top-0 z-50" : "opacity-60"
      } fixed transition-all duration-300 ease-in bg-white w-full`}
    >
      <header
        className="w-full"
        style={{
          boxShadow: "0 4px 6px rgba(33,51,67,.12)",
          borderBottom: "1px solid rgba(33,51,67,.35)",
        }}
      >
        <nav
          className="mx-auto flex container items-center justify-between py-2 px-3"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">
                {process.env.NEXT_PUBLIC_APP_NAME || ""}
              </span>
              <AppLogo
                className="duration-300"
                width={isSticky === true ? 150 : 220}
                height={isSticky === true ? 100 : 150}
              />
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-2 lg:items-center">
            {allMenuItems.map((menuItem) => getMenuItem(menuItem))}
            <div className="flex"></div>
          </div>
          <div className="lg:hidden">
            <button onClick={() => setShowingSideMenu(!showingSideMenu)}>
              <div className="flex gap-1 items-center">
                <div>Menu</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-list h-8 w-8"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </div>
            </button>
            {getSideMenu()}
          </div>
        </nav>
      </header>
    </div>
  );
}
