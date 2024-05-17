"use client";
import { useEffect, useState } from "react";
import DatePicker from "@/components/DatePicker";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  author: string;
  summary: string;
  slug: string;
  content: string;
  publishedAt: string;
}

const defaultImageUrl =
  "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";

// Get the current date
const currentDate = new Date();

// Adjust the time zone to US Eastern Standard Time (EST)
const usDate = new Date(
  currentDate.toLocaleString("en-US", { timeZone: "America/New_York" }),
);

const NewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(usDate);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const articlesPerPage = 5;
  const searchParams = useSearchParams();

  const handleDateChange = (date: Date | null) => {
    const dateAdjusted = new Date(
      date?.toLocaleString("en-US", { timeZone: "America/New_York" }) || "",
    );
    setSelectedDate(dateAdjusted);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleFetchNews();
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const fetchNews = async () => {
    try {
      const apiKey = "de31c916f9304a6da504b59db9200868";
      const formattedDate = selectedDate?.toISOString().split("T")[0] || "";
      const query = searchQuery === "" ? "Crypto" : searchQuery;
      const apiRequest = `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&sortBy=popularity&apiKey=${apiKey}`;
      const response = await fetch(apiRequest);
      const data = await response.json();
      console.log(apiRequest);
      console.log(data);
      if (data.articles) {
        const articlesWithSlugs = data.articles.map((article: any) => ({
          ...article,
          slug: generateSlug(article.title),
        }));
        setArticles(articlesWithSlugs);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleFetchNews = () => {
    setLoading(true); // Set loading to true when fetching data
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
    console.log("test load");
  }, []);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const pagesToShow = 5;
  const startIndex = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(pagesToShow / 2),
      totalPages - pagesToShow + 1,
    ),
  );
  const endIndex = Math.min(totalPages, startIndex + pagesToShow - 1);
  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="mx-auto container px-4 py-6" style={{ paddingTop: "6rem" }}>
      <div className="flex justify-center">
        <div className="max-w-3xl w-full">
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Enter search query"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress} // Added event handler for key press
              className="border border-gray-300 rounded-md px-3 py-2 mr-2 flex-1"
            />
            <p>News At Date:&nbsp;</p>
            <DatePicker onChange={handleDateChange} />
            <p>&nbsp;</p>
            <button
              onClick={handleFetchNews}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Fetch News
            </button>
          </div>
          {loading ? ( // Render skeleton loading UI when loading is true
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: articlesPerPage }, (_, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-48 h-32 bg-gray-300 rounded-md mr-4"></div>{" "}
                    {/* Placeholder for image */}
                    <div className="flex flex-col w-full">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>{" "}
                      {/* Placeholder for title */}
                      <div className="h-3 bg-gray-300 rounded"></div>{" "}
                      {/* Placeholder for author */}
                    </div>
                  </div>
                  <div className="h-16 bg-gray-300 rounded"></div>{" "}
                  {/* Placeholder for summary */}
                </div>
              ))}
            </div>
          ) : (
            // Render actual content when loading is false
            <div className="grid grid-cols-1 gap-4">
              {currentArticles.map((article, index) => (
                <Link
                  legacyBehavior
                  key={index}
                  href={{
                    pathname: `/news/${article.slug}`,
                    search: `?title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.description)}&url=${encodeURIComponent(article.url)}&urlToImage=${encodeURIComponent(article.urlToImage)}&author=${encodeURIComponent(article.author)}&summary=${encodeURIComponent(article.summary)}&content=${encodeURIComponent(article.content)}&publishedAt=${encodeURIComponent(article.publishedAt)}`,
                  }}
                >
                  <a className="border border-gray-200 rounded-lg p-4 block hover:bg-gray-50">
                    <div className="flex items-center mb-4">
                      <img
                        src={article.urlToImage || defaultImageUrl} // Use default image URL if urlToImage is not provided
                        alt={article.title}
                        className="w-48 h-32 rounded-md mr-4"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">
                          {article.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {article.author}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      {article.summary}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center my-4">
              <button
                onClick={handleFirstPage}
                className="mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700"
              >
                &laquo; Prev
              </button>
              {Array.from(
                { length: pagesToShow },
                (_, i) => startIndex + i,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={handleLastPage}
                className="mx-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700"
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
