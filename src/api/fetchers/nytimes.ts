import { NYTIMES_API_BASE_URL, PAGE_SIZE } from "@/config";
import { NYTAPIResponse } from "@/types/api";
import { NewsArticle } from "@/types/article";

const NYTIMES_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;

export async function fetchNYTimesAPI(
  query = "latest",
  page = 1
): Promise<{ articles: NewsArticle[]; hasMore: boolean }> {
  try {
    const endpoint =
      query === "latest"
        ? `${NYTIMES_API_BASE_URL}/topstories/v2/home.json?api-key=${NYTIMES_API_KEY}`
        : `${NYTIMES_API_BASE_URL}/search/v2/articlesearch.json?q=${encodeURIComponent(
            query
          )}&page=${page - 1}&api-key=${NYTIMES_API_KEY}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`NY Times API responded with status: ${response.status}`);
    }

    const data: NYTAPIResponse = await response.json();

    let articles: NewsArticle[] = [];
    let hasMore = false;

    if (query === "latest") {
      // For top stories, we'll manually paginate since the API doesn't support it
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const allResults = data.results || [];

      articles = allResults.slice(startIndex, endIndex).map((article) => ({
        id: article.uri || article.url,
        title: article.title || "No title available",
        excerpt: article.abstract || "No description available",
        source: "The New York Times",
        category: article.section || "News",
        date: article.published_date || new Date().toISOString(),
        url: article.url,
        imageUrl:
          article.multimedia?.[0]?.url ||
          "/placeholder.svg?height=200&width=300",
      }));

      hasMore = endIndex < allResults.length;
    } else {
      // For search, use the API's pagination
      articles = (data.response.docs || []).map((article) => ({
        id: article._id,
        title: article.headline?.main || "No title available",
        excerpt:
          article.abstract ||
          article.lead_paragraph ||
          "No description available",
        source: "The New York Times",
        category: article.section_name || "News",
        date: article.pub_date || new Date().toISOString(),
        url: article.web_url,
        imageUrl: article.multimedia?.[0]?.url
          ? `https://www.nytimes.com/${article.multimedia[0].url}`
          : "/placeholder.svg?height=200&width=300",
      }));

      hasMore = articles.length === 10 && page * 10 < data.response.meta.hits;
    }

    return { articles, hasMore };
  } catch (error) {
    console.error("Error fetching from NY Times API:", error);
    return { articles: [], hasMore: false };
  }
}
