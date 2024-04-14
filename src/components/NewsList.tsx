"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Image from "next/image";
// import { GetServerSideProps } from "next";

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

type iNewsList = {
  noOfItems?: number;
};
const NewsList = ({ noOfItems = 12 }: iNewsList) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<iList<iNewsItem> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<iList<iNewsItem>>("https://i.showmine66.com/item", {
        params: {
          perPage: noOfItems,
          currentPage: 2,
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
        console.log("resp.data", resp.data);
        setData(resp.data);
      })
      .catch((err) => {
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [noOfItems]);

  if (isLoading === true) {
    return (
      <div className="flex gap-4">
        <Spinner className="w-4" />
        <div>Loading ...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {(data?.data || []).map((newsItem: iNewsItem) => {
        const url = `https://r.showmine66.com/item/${newsItem.id}`;
        return (
          <div className="flex gap-2" key={newsItem.id}>
            <a href={url} className="w-1/3">
              <Image
                src={newsItem.CoverAsset?.url || ""}
                height={180}
                width={180}
                alt={newsItem.title}
              />
            </a>
            <div className="w-2/3">
              <a
                className="font-semibold truncate hover:text-clip hover:text-yellow-400"
                href={url}
              >
                {newsItem.title}
              </a>
              <p
                className="text-xs"
                dangerouslySetInnerHTML={{ __html: newsItem.excerpt || "" }}
              ></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async () => {
//   // Fetch data from your API or perform any server-side logic
//   const data = {
//     news: [],
//   };

//   // Return the data as props
//   return {
//     props: {
//       data,
//     },
//   };
// };

export default NewsList;
