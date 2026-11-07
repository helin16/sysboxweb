/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from "react-dom/server";
import Document from "@/pages/_document";

// next/document's parts only render inside Next's own server; swap in plain
// elements so the markup the page shell adds can be checked.
jest.mock("next/document", () => ({
  Html: ({ children, ...props }: any) => <html {...props}>{children}</html>,
  Head: ({ children }: any) => <head>{children}</head>,
  Main: () => <div id="__next" />,
  NextScript: () => null,
}));

describe("Document", () => {
  const html = renderToStaticMarkup(<Document />);

  it("declares English", () => {
    expect(html).toContain('<html lang="en">');
  });

  it("links every favicon size", () => {
    expect(html).toContain('href="/favicon.ico"');
    expect(html).toContain('href="/favicon-32.png"');
    expect(html).toContain('href="/icon-192.png"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
  });

  it("loads the Inter font", () => {
    expect(html).toContain("fonts.googleapis.com/css2?family=Inter");
  });
});
