import { render, screen, within } from "@testing-library/react";
import LatestWork from "@/components/LatestWork";

describe("LatestWork", () => {
  it("shows the eight current projects in order", () => {
    render(<LatestWork />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual([
      "MIESoft (opens in a new tab)",
      "ShowMine (opens in a new tab)",
      "MERP (opens in a new tab)",
      "Shamrock Poly (opens in a new tab)",
      "XJS Library (opens in a new tab)",
      "Snugglepotts ELC (opens in a new tab)",
      "Happy Seeds ELC (opens in a new tab)",
      "Frenken Homes (opens in a new tab)",
    ]);
  });

  it("no longer shows removed projects", () => {
    render(<LatestWork />);
    expect(screen.queryByText(/artchain/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/great oceania/i)).not.toBeInTheDocument();
  });

  it("opens each project's site in a new tab and shows a tidy domain", () => {
    render(<LatestWork />);
    const miesoft = screen.getByRole("link", { name: /MIESoft/ });
    expect(miesoft).toHaveAttribute("href", "https://MIESoft.com.au/");
    expect(miesoft).toHaveAttribute("target", "_blank");
    expect(miesoft).toHaveAttribute("rel", "noopener noreferrer");
    // Lower-cased, no protocol, no trailing slash.
    expect(within(miesoft).getByText("miesoft.com.au")).toBeInTheDocument();
    // "www." is dropped.
    const frenken = screen.getByRole("link", { name: /Frenken Homes/ });
    expect(within(frenken).getByText("frenkenhomes.com.au")).toBeInTheDocument();
  });

  it("lays out two tiles per row on phones and four on laptops", () => {
    render(<LatestWork />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(8);
    items.forEach((li) =>
      expect(li.className).toMatch(/w-\[calc\(\(100%-0\.75rem\)\/2\)\].*lg:w-\[calc\(\(100%-6rem\)\/4\)\]/)
    );
  });
});
