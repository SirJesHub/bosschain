"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';

const NewsDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const fetchedContent = searchParams?.get("content") || "";
    // Sanitize fetchedContent if needed
    setContent(fetchedContent);
  }, [searchParams]);

  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="mx-auto container px-3 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <img
            width={500}
            height={400}
            className="w-full"
            src={searchParams?.get("urlToImage") || ""}
            alt="News Image"
          />
        </div>
        <div className="text-4xl font-bold mb-4">{searchParams?.get("title") || ""}</div>
        <p className="text-lg mb-8">{searchParams?.get("description") || ""}</p>
        <div
          className="text-lg mb-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center text-gray-600">
            <p>{`Published At: ${formatDate(searchParams?.get("publishedAt") || "")}`}</p>
            <span className="mx-2">&middot;</span>
            <p>{`By: ${searchParams?.get("author") || ""}`}</p>
          </div>
          <Link legacyBehavior href={searchParams?.get("url") || ""} passHref>
            <a className="text-violet-600" target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsPage;
