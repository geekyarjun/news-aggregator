import { NEWS_API_BASE_URL, PAGE_SIZE } from "@/config";
import { NewsAPIResponse } from "@/types/api";
import { NewsArticle } from "@/types/article";

// Default page size for each API
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

export async function fetchNewsAPI(
  query = "latest",
  page = 1
): Promise<{ articles: NewsArticle[]; hasMore: boolean }> {
  try {
    const endpoint =
      query === "latest"
        ? `${NEWS_API_BASE_URL}/top-headlines?country=us&page=${page}&pageSize=${PAGE_SIZE}&apiKey=${NEWS_API_KEY}`
        : `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(
            query
          )}&page=${page}&pageSize=${PAGE_SIZE}&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status: ${response.status}`);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status === "error") {
      throw new Error(data.message || "Error fetching from NewsAPI");
    }

    const articles = data.articles.map((article) => ({
      id: article.url,
      title: article.title || "No title available",
      excerpt: article.description || "No description available",
      source: article.source?.name || "NewsAPI",
      category: article.source?.name || "General",
      date: article.publishedAt || new Date().toISOString(),
      url: article.url,
      imageUrl: article.urlToImage || "/placeholder.svg?height=200&width=300",
    }));

    // Check if there are more articles to load
    const hasMore =
      data.articles.length === PAGE_SIZE &&
      page * PAGE_SIZE < data.totalResults;

    return { articles, hasMore };
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return { articles: [], hasMore: false };
  }
}
