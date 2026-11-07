import { act, fireEvent, render, screen, within } from "@testing-library/react";
import PageHeader, {
  PAGE_NAME_CONTACT_US,
  allMenuItems,
} from "@/components/PageHeader";

// react-scroll needs real layout to spy on sections. Replace its link with a
// plain anchor that exposes the callbacks, so the header's own logic is tested.
const scrollLinkProps: Record<string, any> = {};
jest.mock("react-scroll", () => ({
  Link: (props: any) => {
    scrollLinkProps[props.to] = props;
    return (
      <a href={props.href} className={props.className} onClick={props.onClick} data-scroll-to={props.to}>
        {props.children}
      </a>
    );
  },
  animateScroll: { scrollToTop: jest.fn() },
}));
const { animateScroll } = jest.requireMock("react-scroll");

const desktopNav = () => screen.getByRole("navigation", { name: "Global" });
const menuButton = () => screen.getByRole("button", { name: /menu|close/i });

afterEach(() => {
  jest.clearAllMocks();
  window.scrollY = 0;
});

describe("PageHeader on the home page", () => {
  it("shows the logo, every menu item and a Get in Touch button", () => {
    render(<PageHeader />);
    expect(screen.getByRole("img", { name: /sysbox digital/i })).toBeInTheDocument();
    allMenuItems.forEach((item) => {
      expect(within(desktopNav()).getByText(item.label)).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /Get in Touch/ })).toHaveAttribute("href", "/contact");
  });

  it("uses smooth in-page scrolling for section links, offset by the header", () => {
    render(<PageHeader />);
    const services = within(desktopNav()).getByText("Services");
    expect(services).toHaveAttribute("data-scroll-to", "services");
    expect(scrollLinkProps.services).toMatchObject({ smooth: true, spy: true, offset: -80 });
  });

  it("scrolls back to the top when Home is clicked", () => {
    render(<PageHeader />);
    fireEvent.click(within(desktopNav()).getByText("Home"));
    expect(animateScroll.scrollToTop).toHaveBeenCalledWith({ duration: 500 });
  });

  it("highlights the section currently on screen", () => {
    render(<PageHeader />);
    const home = within(desktopNav()).getByText("Home");
    const services = within(desktopNav()).getByText("Services");
    expect(home).toHaveClass("text-blue-600");
    act(() => scrollLinkProps.services.onSetActive("services"));
    expect(services).toHaveClass("text-blue-600");
    expect(home).not.toHaveClass("text-blue-600");
    act(() => scrollLinkProps.services.onSetInactive());
    expect(home).toHaveClass("text-blue-600");
  });

  it("adds a shadow once the page is scrolled", () => {
    render(<PageHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("border-b");
    act(() => {
      window.scrollY = 50;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(header).toHaveClass("shadow-md");
  });

  it("stops listening for scrolling when removed", () => {
    const remove = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<PageHeader />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});

describe("PageHeader mobile menu", () => {
  it("opens and closes from the Menu button", () => {
    render(<PageHeader />);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();

    fireEvent.click(menuButton());
    expect(menuButton()).toHaveTextContent("Close");
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    const menu = document.getElementById("mobile-menu")!;
    allMenuItems.forEach((item) => expect(within(menu).getByText(item.label)).toBeInTheDocument());
    expect(screen.getByRole("banner")).toHaveClass("shadow-md");

    fireEvent.click(menuButton());
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it.each(["Home", "Services", "Contact"])("closes after choosing %s", (label) => {
    render(<PageHeader />);
    fireEvent.click(menuButton());
    fireEvent.click(within(document.getElementById("mobile-menu")!).getByText(label));
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes when the logo is clicked", () => {
    render(<PageHeader />);
    fireEvent.click(menuButton());
    fireEvent.click(screen.getByRole("link", { name: /^Sysbox/ }));
    expect(document.getElementById("mobile-menu")).toBeNull();
  });
});

describe("PageHeader on other pages", () => {
  it("links section items back to the home page instead of scrolling", () => {
    render(<PageHeader currentPageName={PAGE_NAME_CONTACT_US} />);
    const services = within(desktopNav()).getByText("Services");
    expect(services).toHaveAttribute("href", "/#services");
    expect(services).not.toHaveAttribute("data-scroll-to");
  });

  it("highlights Contact and doesn't scroll when Home is clicked", () => {
    render(<PageHeader currentPageName={PAGE_NAME_CONTACT_US} />);
    expect(within(desktopNav()).getByText("Contact")).toHaveClass("text-blue-600");
    fireEvent.click(within(desktopNav()).getByText("Home"));
    expect(animateScroll.scrollToTop).not.toHaveBeenCalled();
  });
});
