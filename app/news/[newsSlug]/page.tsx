'use client';
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect } from "react";

const fetchNews = async () => {
  try {
    const apiKey = "de31c916f9304a6da504b59db9200868"; // Hardcoded API key
    const apiRequest = `https://newsapi.org/v2/everything?q=gary-shilling-says-the-sp-500-may-crash-30-a-recession-will-hit-and-bitcoin-and-ai-are-both-overhyped&from=2024-02-07&sortBy=popularity&apiKey=${apiKey}`;
    const response = await fetch(apiRequest);
    const data = await response.json();
    console.log(apiRequest);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};


export default function NewsDetailsPage({
  params: { title },
}: {
  params: { title: string };
}) {

  useEffect(() => {
    async function fetchNewsAuto() {
    }
    fetchNews();
  }, []);

  return (
    <>
      <h1>{title}</h1>
    </>
  );
}
