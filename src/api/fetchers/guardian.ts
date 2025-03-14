import { GUARDIAN_API_BASE_URL, PAGE_SIZE } from "@/config";
import { GuardianAPIResponse } from "@/types/api";
import { NewsArticle } from "@/types/article";

// Default page size for each API
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;

export async function fetchGuardianAPI(
  query = "latest",
  page = 1
): Promise<{ articles: NewsArticle[]; hasMore: boolean }> {
  try {
    const endpoint =
      query === "latest"
        ? `${GUARDIAN_API_BASE_URL}/search?section=news&show-fields=thumbnail,trailText&page=${page}&page-size=${PAGE_SIZE}&api-key=${GUARDIAN_API_KEY}`
        : `${GUARDIAN_API_BASE_URL}/search?q=${encodeURIComponent(
            query
          )}&show-fields=thumbnail,trailText&page=${page}&page-size=${PAGE_SIZE}&api-key=${GUARDIAN_API_KEY}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Guardian API responded with status: ${response.status}`);
    }

    const data: GuardianAPIResponse = await response.json();

    const articles = data.response.results.map((article) => ({
      id: article.id,
      title: article.webTitle || "No title available",
      excerpt: article.fields?.trailText || "No description available",
      source: "The Guardian",
      category: article.sectionName || "News",
      date: article.webPublicationDate || new Date().toISOString(),
      url: article.webUrl,
      imageUrl:
        article.fields?.thumbnail || "/placeholder.svg?height=200&width=300",
    }));

    // Check if there are more articles to load
    const hasMore =
      articles.length === PAGE_SIZE && page * PAGE_SIZE < data.response.total;

    return { articles, hasMore };
  } catch (error) {
    console.error("Error fetching from Guardian API:", error);
    return { articles: [], hasMore: false };
  }
}
