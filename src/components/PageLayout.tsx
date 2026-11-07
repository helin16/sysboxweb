"use client";
import "@/app/globals.css";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
} from "./seo";

type iPageLayout = {
  pageTitle?: string;
  pageDescription?: string;
  /** Path of this page, e.g. "/contact", used for its canonical URL. */
  path?: string;
  /** Structured data (JSON-LD) to add to the page. */
  jsonLd?: object;
  children: React.ReactNode;
  currentPageName?: string;
  withMinHeight?: boolean;
};
const PageLayout = ({
  children,
  pageTitle = DEFAULT_TITLE,
  pageDescription = DEFAULT_DESCRIPTION,
  path = "/",
  jsonLd,
  currentPageName,
  withMinHeight = true,
}: iPageLayout) => {
  const url = absoluteUrl(path);
  const image = absoluteUrl(OG_IMAGE.path);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#2563eb" />

        {/* Link previews on Facebook, LinkedIn, Slack, iMessage etc. */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_AU" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content={String(OG_IMAGE.width)} />
        <meta property="og:image:height" content={String(OG_IMAGE.height)} />
        <meta property="og:image:alt" content={`${SITE_NAME} – Web, Software, Solutions`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sysboxteam" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={image} />

        {jsonLd && (
          <script
            type="application/ld+json"
            // JSON-LD must be raw JSON; "<" is escaped so it can't end the tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
        )}
      </Head>
      <PageHeader currentPageName={currentPageName} />
      <main
        className="pt-20"
        style={
          withMinHeight === true ? { minHeight: "calc(100vh - 18rem)" } : {}
        }
      >
        {children}
      </main>
      <SpeedInsights />
      <PageFooter />
    </>
  );
};

export default PageLayout;
