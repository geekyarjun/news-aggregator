import { useNewsApi } from "./useNewsApi";
import { useGuardianApi } from "./useGuardianApi";
import { useNYTimesApi } from "./useNYTimesApi";
import type { NewsArticle } from "@/types/article";

export function useNewsAggregator(query = "") {
  const newsApiQuery = useNewsApi(query);
  const guardianApiQuery = useGuardianApi(query);
  const nyTimesApiQuery = useNYTimesApi(query);

  // Track the last filtered count to detect when no new matching content is being added
  const consecutiveNoNewContent = 0;

  const isLoading =
    newsApiQuery.isLoading ||
    guardianApiQuery.isLoading ||
    nyTimesApiQuery.isLoading;

  const isFetchingNextPage =
    newsApiQuery.isFetchingNextPage ||
    guardianApiQuery.isFetchingNextPage ||
    nyTimesApiQuery.isFetchingNextPage;

  const isError =
    newsApiQuery.isError || guardianApiQuery.isError || nyTimesApiQuery.isError;

  const error =
    newsApiQuery.error || guardianApiQuery.error || nyTimesApiQuery.error;

  // Combine all articles from all pages and sources
  const allArticles: NewsArticle[] = [
    ...(newsApiQuery.data?.pages.flatMap((page) => page.articles) || []),
    ...(guardianApiQuery.data?.pages.flatMap((page) => page.articles) || []),
    ...(nyTimesApiQuery.data?.pages.flatMap((page) => page.articles) || []),
  ];

  // Check if any of the sources has more pages
  const hasNextPage =
    (newsApiQuery.hasNextPage ||
      guardianApiQuery.hasNextPage ||
      nyTimesApiQuery.hasNextPage) &&
    consecutiveNoNewContent < 3; // Stop after 3 attempts with no new matching content

  // Function to fetch the next page from all sources
  const fetchNextPage = async () => {
    const promises = [];

    if (newsApiQuery.hasNextPage) {
      promises.push(newsApiQuery.fetchNextPage());
    }

    if (guardianApiQuery.hasNextPage) {
      promises.push(guardianApiQuery.fetchNextPage());
    }

    if (nyTimesApiQuery.hasNextPage) {
      promises.push(nyTimesApiQuery.fetchNextPage());
    }

    await Promise.all(promises);
  };

  return {
    data: allArticles,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    newsApiQuery,
    guardianApiQuery,
    nyTimesApiQuery,
  };
}
