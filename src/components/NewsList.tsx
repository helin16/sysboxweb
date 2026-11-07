"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import SectionHeading from "./SectionHeading";

type iAsset = {
  comments: string;
  companyId: string;
  createdAt: Date | string;
  createdById: string;
  externalAssetId: string | null;
  externalObj: any | null;
  fileName: string;
  fileSize: number;
  fileType: string;
  id: string;
  isActive: boolean;
  type: string;
  updatedAt: Date | string;
  updatedById: string;
  url: string;
};

type iNewsItem = {
  authorId: string;
  companyId: string;
  content: string;
  coverAssetId: string;
  createdAt: Date | string;
  createdById: string;
  enableGTranslateFlag: boolean;
  excerpt: string;
  id: string;
  isActive: boolean;
  isPublished: boolean;
  noOfVisits: number;
  oldId: string;
  publishedAt: Date | string | null;
  publishedById: string | null;
  slug: string;
  title: string;
  updatedAt: Date | string;
  updatedById: string;
  CoverAsset?: iAsset;
};

type iList<T> = {
  data: T[];
  currentPage: number;
  from: number;
  to: number;
  perPage: number;
  total: number;
  pages: number;
};

const NEWS_ITEM_WIDTH =
  "w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]";

const newsUrl =(item: iNewsItem) => `https://r.showmine66.com/item/${item.id}`;

/** Excerpts arrive as HTML; show them as plain text. */
const toPlainText = (html: string) => {
  if (typeof window === "undefined") return html.replace(/<[^>]+>/g, " ");
  const el = document.createElement("div");
  // Keep words apart where paragraphs, list items or line breaks end.
  el.innerHTML = html.replace(/<\/(p|li|div|h[1-6])>|<br\s*\/?>/gi, " $&");
  return (el.textContent || "").replace(/\s+/g, " ").trim();
};

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const NewsCard = ({ item }: { item: iNewsItem }) => (
  <a
    href={newsUrl(item)}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  >
    <div className="aspect-video overflow-hidden bg-slate-100">
      {item.CoverAsset?.url && (
        <Image
          src={item.CoverAsset.url}
          width={640}
          height={360}
          sizes="(min-width: 1024px) 33vw, 50vw"
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}
    </div>
    <div className="flex flex-col flex-1 p-3.5 sm:p-7 text-left">
      {item.publishedAt && (
        <time
          dateTime={moment(item.publishedAt).toISOString()}
          className="text-xs sm:text-sm text-slate-500"
        >
          {moment(item.publishedAt).format("D MMMM YYYY")}
        </time>
      )}
      <h3 className="mt-1.5 sm:mt-2 text-[15px] sm:text-xl font-bold text-slate-900 leading-snug line-clamp-3 group-hover:text-blue-700 transition-colors">
        {item.title}
      </h3>
      <p className="mt-2 sm:mt-3 text-[13px] leading-5 sm:text-base sm:leading-7 text-slate-600 line-clamp-3 sm:line-clamp-4">
        {toPlainText(item.excerpt || "")}
      </p>
      <span className="mt-auto pt-4 sm:pt-6 inline-flex items-center gap-2 text-[13px] sm:text-sm font-semibold text-blue-600">
        Read more
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </span>
    </div>
  </a>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
    <div className="aspect-video bg-slate-200" />
    <div className="p-3.5 sm:p-7 space-y-3">
      <div className="h-3 w-24 bg-slate-200 rounded" />
      <div className="h-5 w-4/5 bg-slate-200 rounded" />
      <div className="h-5 w-3/5 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded mt-4" />
      <div className="h-3 w-full bg-slate-100 rounded" />
    </div>
  </div>
);

type iNewsList = {
  noOfItems?: number;
};
const NewsList = ({ noOfItems = 3 }: iNewsList) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<iList<iNewsItem> | null>(null);

  useEffect(() => {
    // isLoading starts as true, so there's no need to set it here.
    axios
      .get<iList<iNewsItem>>("https://i.showmine66.com/item", {
        params: {
          perPage: noOfItems,
          currentPage: 1,
          sort: "publishedAt:DESC",
          where: JSON.stringify({
            isActive: true,
            publishedAt: { OP_NOT: null },
          }),
          include: "CoverAsset",
        },
        headers: {
          "X-Shm-Token": "b2da3017732e698a28a55bb663836c",
          Comid: "e9aed21a-bec1-4c4f-86eb-0b87f261f098",
        },
      })
      .then((resp) => {
        setData(resp.data);
      })
      .catch(() => {
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [noOfItems]);

  const items = data?.data || [];
  if (!isLoading && items.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeading eyebrow="From the Blog" title="Latest News" />
      {/* Two per row below laptop size; flex-wrap centres an odd last card. */}
      <ul className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8">
        {isLoading
          ? Array.from({ length: noOfItems }).map((_, i) => (
              <li key={i} className={NEWS_ITEM_WIDTH}>
                <SkeletonCard />
              </li>
            ))
          : items.map((item) => (
              <li key={item.id} className={NEWS_ITEM_WIDTH}>
                <NewsCard item={item} />
              </li>
            ))}
      </ul>
    </div>
  );
};

export default NewsList;
