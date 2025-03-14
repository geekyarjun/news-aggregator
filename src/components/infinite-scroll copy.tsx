"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  loadMoreText?: string;
  loadingText?: string;
  noMoreText?: string;
  className?: string;
  filteredItemCount: number;
  totalItemCount: number;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  loadMoreText = "Load more",
  loadingText = "Loading...",
  noMoreText = "No more articles",
  className,
  filteredItemCount,
  totalItemCount,
}: InfiniteScrollProps) {
  const [shouldUseButton, setShouldUseButton] = useState(false);
  const [noMoreMatchingContent, setNoMoreMatchingContent] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const previousFilteredCount = useRef(filteredItemCount);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const debouncedLoadAttempts = useDebounce(loadAttempts, 500);

  // Reset load attempts when filters change
  useEffect(() => {
    setLoadAttempts(0);
    setNoMoreMatchingContent(false);
  }, [filteredItemCount, totalItemCount]);

  // Check if we should use a button instead of infinite scroll
  useEffect(() => {
    const checkScrollHeight = () => {
      // If the document height is less than the viewport height plus threshold,
      // we should use a button instead of infinite scroll
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      setShouldUseButton(documentHeight <= viewportHeight + threshold);
    };

    checkScrollHeight();
    window.addEventListener("resize", checkScrollHeight);

    return () => {
      window.removeEventListener("resize", checkScrollHeight);
    };
  }, [threshold]);

  // Detect if no more matching content after multiple load attempts
  useEffect(() => {
    if (debouncedLoadAttempts > 0) {
      // If filtered count hasn't changed after loading more
      if (
        filteredItemCount === previousFilteredCount.current &&
        filteredItemCount < totalItemCount
      ) {
        // After 3 attempts with no new matching content, assume there's no more matching content
        if (debouncedLoadAttempts >= 3) {
          setNoMoreMatchingContent(true);
        }
      } else {
        // Reset attempts if we got new content
        setLoadAttempts(0);
      }
    }
    previousFilteredCount.current = filteredItemCount;
  }, [filteredItemCount, totalItemCount, debouncedLoadAttempts]);

  // Set up the intersection observer for infinite scrolling
  useEffect(() => {
    if (isLoading || !hasMore || shouldUseButton || noMoreMatchingContent)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !noMoreMatchingContent
        ) {
          handleLoadMore();
        }
      },
      { rootMargin: `0px 0px ${threshold}px 0px` }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    onLoadMore,
    hasMore,
    isLoading,
    threshold,
    shouldUseButton,
    noMoreMatchingContent,
  ]);

  const handleLoadMore = async () => {
    await onLoadMore();
    setLoadAttempts((prev) => prev + 1);
  };

  // Determine if we should show the load more UI
  const shouldShowLoadMore = hasMore && !noMoreMatchingContent;

  return (
    <div className={className} ref={loadMoreRef}>
      {shouldShowLoadMore ? (
        shouldUseButton ? (
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              loadMoreText
            )}
          </Button>
        ) : (
          isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )
        )
      ) : (
        <div className="text-center py-4 text-sm text-muted-foreground">
          {noMoreMatchingContent
            ? "No more articles match your current filters"
            : noMoreText}
        </div>
      )}
    </div>
  );
}
