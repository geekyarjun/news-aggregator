import { fetchNewsAPI } from "@/api/fetchers/news";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useNewsApi(query = "") {
  return useInfiniteQuery({
    queryKey: ["newsApi", query || "latest"],
    queryFn: ({ pageParam = 1 }) => fetchNewsAPI(query || "latest", pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
