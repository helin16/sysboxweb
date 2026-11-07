import { render, screen, waitFor, within } from "@testing-library/react";
import axios from "axios";
import NewsList from "@/components/NewsList";
import { NEWS_ITEMS, newsResponse } from "../../fixtures/data";

jest.mock("axios");
const mockedGet = axios.get as jest.Mock;

afterEach(() => mockedGet.mockReset());

describe("NewsList", () => {
  it("shows placeholder cards while loading", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));
    const { container } = render(<NewsList noOfItems={2} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Latest News" })).toBeInTheDocument();
  });

  it("asks the blog API for the newest published posts", async () => {
    mockedGet.mockResolvedValue({ data: newsResponse() });
    render(<NewsList />);
    await screen.findAllByRole("link");
    expect(mockedGet).toHaveBeenCalledWith(
      "https://i.showmine66.com/item",
      expect.objectContaining({
        params: expect.objectContaining({
          perPage: 3,
          currentPage: 1,
          sort: "publishedAt:DESC",
          include: "CoverAsset",
        }),
      })
    );
    const { where } = mockedGet.mock.calls[0][1].params;
    expect(JSON.parse(where)).toEqual({
      isActive: true,
      publishedAt: { OP_NOT: null },
    });
  });

  it("renders a card per post with date, title, plain-text excerpt and link", async () => {
    mockedGet.mockResolvedValue({ data: newsResponse() });
    render(<NewsList />);
    const links = await screen.findAllByRole("link");
    expect(links).toHaveLength(3);

    const first = links[0];
    expect(first).toHaveAttribute("href", "https://r.showmine66.com/item/news-1");
    expect(first).toHaveAttribute("target", "_blank");
    expect(within(first).getByRole("heading")).toHaveTextContent(NEWS_ITEMS[0].title);
    expect(within(first).getByText("1 October 2026")).toHaveAttribute(
      "datetime",
      "2026-10-01T00:00:00.000Z"
    );
    // HTML is stripped, and words from separate paragraphs don't run together.
    expect(within(first).getByText("First paragraph. Second bold line.")).toBeInTheDocument();
    expect(within(links[1]).getByText("Plain text excerpt with a break")).toBeInTheDocument();
    expect(within(links[2]).getByText("One Two")).toBeInTheDocument();
    // Cover images are decorative (alt=""), so look them up directly.
    expect(first.querySelector("img")!.getAttribute("src")).toContain("MERP.webp");
  });

  it("copes with posts missing a date, cover image or excerpt", async () => {
    mockedGet.mockResolvedValue({
      data: newsResponse([
        { id: "bare", title: "Bare post", excerpt: "", publishedAt: null } as any,
      ]),
    });
    const { container } = render(<NewsList noOfItems={1} />);
    const link = await screen.findByRole("link");
    expect(within(link).getByRole("heading")).toHaveTextContent("Bare post");
    expect(container.querySelector("time")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
  });

  it("centres an odd last card by using flex-wrap with set widths", async () => {
    mockedGet.mockResolvedValue({ data: newsResponse() });
    render(<NewsList />);
    await screen.findAllByRole("link");
    const list = screen.getByRole("list");
    expect(list).toHaveClass("flex", "flex-wrap", "justify-center");
    within(list)
      .getAllByRole("listitem")
      .forEach((li) => expect(li.className).toContain("w-[calc((100%-0.75rem)/2)]"));
  });

  it("hides the whole section if there are no posts", async () => {
    mockedGet.mockResolvedValue({ data: newsResponse([]) });
    const { container } = render(<NewsList />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("hides the whole section if the blog can't be reached", async () => {
    mockedGet.mockRejectedValue(new Error("offline"));
    const { container } = render(<NewsList />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });

  it("hides the section if the API returns no data list", async () => {
    mockedGet.mockResolvedValue({ data: null });
    const { container } = render(<NewsList />);
    await waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
