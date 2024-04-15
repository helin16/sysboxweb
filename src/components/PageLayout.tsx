"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import PageFooter from "./PageFooter";
import PageHeader from "./PageHeader";
import PageSection from "./PageSection";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";

type iPageLayout = {
  pageTitle?: string;
  pageDescription?: string;
  children: React.ReactNode;
  currentPageName?: string;
  withMinHeight?: boolean;
};
const PageLayout = ({
  children,
  pageTitle,
  pageDescription,
  currentPageName,
  withMinHeight = true,
}: iPageLayout) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <PageHeader currentPageName={currentPageName} />
      <main
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
