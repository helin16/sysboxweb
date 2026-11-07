import { render, screen } from "@testing-library/react";

// Edge cases the real project list never hits: a project with no website and
// a website address that isn't a valid URL.
jest.mock("@/components/Url", () => ({
  ...jest.requireActual("@/components/Url"),
  URL_MERP: undefined,
  URL_SHOWMINE: "not a url",
}));

import LatestWork from "@/components/LatestWork";

describe("LatestWork edge cases", () => {
  it("shows a project without a website as a plain, unlinked tile", () => {
    render(<LatestWork />);
    expect(screen.queryByRole("link", { name: /MERP/ })).not.toBeInTheDocument();
    const tile = screen.getByRole("img", { name: "MERP" }).closest("li")!;
    expect(tile.querySelector("a")).toBeNull();
    expect(tile).toHaveTextContent("MERP");
  });

  it("falls back to the raw address if it can't be parsed", () => {
    render(<LatestWork />);
    expect(screen.getByRole("link", { name: /ShowMine/ })).toHaveTextContent(
      "not a url"
    );
  });
});
