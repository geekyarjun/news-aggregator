import { fetchGuardianAPI } from "@/api/fetchers/guardian";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGuardianApi(query = "") {
  return useInfiniteQuery({
    queryKey: ["guardianApi", query || "latest"],
    queryFn: ({ pageParam = 1 }) =>
      fetchGuardianAPI(query || "latest", pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
