"use client";
import Link from "next/link";
import { Link as ScrollLink, animateScroll } from "react-scroll";
import { useEffect, useState } from "react";
import AppLogo from "./AppLogo";
import ContactUsBtn, { CONTACT_PAGE_URL } from "./ContactUsBtn";

export const PAGE_NAME_HOME = "home";
export const PAGE_NAME_SERVICES = "services";
export const PAGE_NAME_ABOUT_US = "about";
export const PAGE_NAME_OUR_WORK = "our-work";
export const PAGE_NAME_TESTIMONIALS = "testimonials";
export const PAGE_NAME_CONTACT_US = "contact";

export type iMenuItem = {
  name: string;
  label: string;
  href: string;
};

export const allMenuItems: iMenuItem[] = [
  { name: PAGE_NAME_HOME, label: "Home", href: "/" },
  { name: PAGE_NAME_ABOUT_US, label: "About", href: `/#${PAGE_NAME_ABOUT_US}` },
  { name: PAGE_NAME_SERVICES, label: "Services", href: `/#${PAGE_NAME_SERVICES}` },
  { name: PAGE_NAME_OUR_WORK, label: "Our Work", href: `/#${PAGE_NAME_OUR_WORK}` },
  {
    name: PAGE_NAME_TESTIMONIALS,
    label: "Testimonials",
    href: `/#${PAGE_NAME_TESTIMONIALS}`,
  },
  { name: PAGE_NAME_CONTACT_US, label: "Contact", href: CONTACT_PAGE_URL },
];

/** Height of the fixed header, used to offset in-page scrolling. */
export const HEADER_OFFSET = 80;

type iPageHeader = {
  currentPageName?: string;
};

export default function PageHeader({
  currentPageName = PAGE_NAME_HOME,
}: iPageHeader) {
  const [showingSideMenu, setShowingSideMenu] = useState(false);
  const [activeMenuName, setActiveMenuName] = useState(currentPageName);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = currentPageName === PAGE_NAME_HOME;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setShowingSideMenu(false);

  const getMenuItem = (item: iMenuItem, mobile = false) => {
    const isActive = activeMenuName === item.name;
    const className = mobile
      ? `block rounded-lg px-3 py-3 text-lg font-semibold cursor-pointer ${
          isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
        }`
      : `relative px-1 py-2 text-base xl:text-lg font-semibold cursor-pointer transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-600 after:transition-transform after:duration-200 after:origin-left ${
          isActive
            ? "text-blue-600 after:scale-x-100"
            : "text-slate-800 hover:text-blue-600 after:scale-x-0 hover:after:scale-x-100"
        }`;

    if (item.name === PAGE_NAME_HOME) {
      return (
        <Link
          key={item.name}
          href={"/"}
          onClick={() => {
            closeMenu();
            if (isHomePage) animateScroll.scrollToTop({ duration: 500 });
          }}
          className={className}
        >
          {item.label}
        </Link>
      );
    }
    if (item.name === PAGE_NAME_CONTACT_US) {
      return (
        <Link key={item.name} href={item.href} className={className} onClick={closeMenu}>
          {item.label}
        </Link>
      );
    }
    if (!isHomePage) {
      // Section links only scroll in place on the home page; elsewhere a
      // normal link loads the home page and the browser jumps to the section.
      return (
        <a key={item.name} href={item.href} className={className}>
          {item.label}
        </a>
      );
    }
    return (
      <ScrollLink
        key={item.name}
        className={className}
        to={item.name}
        href={item.href}
        spy={true}
        smooth={true}
        hashSpy={true}
        offset={-HEADER_OFFSET}
        duration={500}
        isDynamic={true}
        onClick={closeMenu}
        onSetActive={(to) => setActiveMenuName(to)}
        onSetInactive={() => setActiveMenuName(PAGE_NAME_HOME)}
        ignoreCancelEvents={false}
        spyThrottle={300}
      >
        {item.label}
      </ScrollLink>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        isScrolled || showingSideMenu
          ? "shadow-md shadow-slate-200/60"
          : "border-b border-slate-100"
      }`}
    >
      <nav
        className="mx-auto container flex h-20 items-center justify-between px-4 lg:px-6"
        aria-label="Global"
      >
        <Link href="/" className="flex items-center" onClick={closeMenu}>
          <span className="sr-only">Sysbox</span>
          <AppLogo width={200} className="h-auto w-[160px] sm:w-[190px] xl:w-[200px]" />
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-x-6 xl:gap-x-9">
          {allMenuItems.map((menuItem) => getMenuItem(menuItem))}
        </div>

        <div className="hidden lg:block">
          <ContactUsBtn withArrow={false} className="whitespace-nowrap" />
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-50"
          aria-expanded={showingSideMenu}
          aria-controls="mobile-menu"
          onClick={() => setShowingSideMenu(!showingSideMenu)}
        >
          {showingSideMenu ? "Close" : "Menu"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {showingSideMenu ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {showingSideMenu && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-slate-100 bg-white px-4 pb-6 pt-2"
        >
          <div className="flex flex-col gap-1">
            {allMenuItems.map((menuItem) => getMenuItem(menuItem, true))}
          </div>
          <ContactUsBtn className="mt-4 w-full" />
        </div>
      )}
    </header>
  );
}
