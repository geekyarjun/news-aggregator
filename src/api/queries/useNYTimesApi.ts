import { fetchNYTimesAPI } from "@/api/fetchers/nytimes";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useNYTimesApi(query = "") {
  return useInfiniteQuery({
    queryKey: ["nyTimesApi", query || "latest"],
    queryFn: ({ pageParam = 1 }) =>
      fetchNYTimesAPI(query || "latest", pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
