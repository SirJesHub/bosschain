'use client';
import { useEffect, useState } from "react";
import DatePicker from "@/components/DatePicker";
import { format } from 'date-fns';
import Link from "next/link";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  creator: string;
  summary: string;
  slug: string;
}

const NewsPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 5; // Change this to the number of articles per page you want

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const generateSlug = (title: string) => {
  return title
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w-]+/g, '') // Remove non-word characters except dashes
    .replace(/--+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+/, '') // Remove leading dashes
    .replace(/-+$/, ''); // Remove trailing dashes
};


  const fetchNews = async () => {
    try {
      const apiKey = "de31c916f9304a6da504b59db9200868"; // Hardcoded API key
      const formattedDate = selectedDate?.toISOString().split("T")[0] || "";
      const query = searchQuery === "" ? "Crypto" : searchQuery;
      const apiRequest = `https://newsapi.org/v2/everything?q=${query}&from=${formattedDate}&sortBy=popularity&apiKey=${apiKey}`;
      const response = await fetch(apiRequest);
      const data = await response.json();
      console.log(apiRequest);
      if (data.articles) {
        const articlesWithSlugs = data.articles.map((article: any) => ({
            ...article,
            slug: generateSlug(article.title) // Assuming you have a function to generate slugs
          }));
          setArticles(articlesWithSlugs);
        }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleFetchNews = () => {
    fetchNews();
  };

  useEffect(() => {
    async function fetchNewsAuto() {
    }
    fetchNews();
  }, []);


  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter search query"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md px-3 py-2 mr-2"
          />
          <DatePicker onChange={handleDateChange} />
          <button
            onClick={handleFetchNews}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Fetch News
          </button>
        </div>
      </div>
      {selectedDate && (
        <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
      )}
      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentArticles.map((article, index) => (
            <article
              key={index}
              className="border border-gray-200 rounded-lg p-4 max-h-96"
            >
              <header>
                <div className="mb-4">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-60 rounded-lg"
                  />
                </div>
                <div className="text-lg font-semibold mb-2">
                  {article.title}
                </div>
              </header>
              <div>
                <p className="text-sm text-gray-700 mb-4">{article.summary}</p>
                <div className="text-right">
                  <Link
                    href={`/news/${article.slug}`}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="flex justify-center my-4 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
