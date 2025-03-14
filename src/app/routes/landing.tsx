import { Head } from "@/components/seo";
import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Filter,
  Search,
  AlertCircle,
  Loader2,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArticleCardSkeleton,
  FilterSidebarSkeleton,
  SearchBarSkeleton,
  TabsSkeleton,
} from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsAggregator } from "@/api/queries/useNewsAggregator";
import { PreferencesModal } from "@/components/preferences-modal";
import { InfiniteScroll } from "@/components/infinite-scroll";

const LandingRoute = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "personalized">("all");

  const { preferences } = usePreferencesStore();
  const {
    data: allArticles,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNewsAggregator(searchQuery);

  // Filter articles based on selected filters
  const filteredArticles = allArticles.filter((article) => {
    // Filter by date
    if (
      date &&
      format(new Date(article.date), "yyyy-MM-dd") !==
        format(date, "yyyy-MM-dd")
    ) {
      return false;
    }

    // Filter by category
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(article.category.toLowerCase())
    ) {
      return false;
    }

    // Filter by source
    if (
      selectedSource &&
      selectedSource !== "all" &&
      article.source.toLowerCase() !== selectedSource.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  // Filter articles based on user preferences
  const personalizedArticles = filteredArticles.filter((article) => {
    if (!preferences.enablePersonalization) return true;

    const sourceMatch =
      preferences.preferredSources.length === 0 ||
      preferences.preferredSources.includes(article.source);

    const categoryMatch =
      preferences.preferredCategories.length === 0 ||
      preferences.preferredCategories.includes(article.category);

    // For authors, we would check here if we had author data
    // const authorMatch = preferences.preferredAuthors.length === 0 ||
    //   preferences.preferredAuthors.includes(article.author);

    return sourceMatch && categoryMatch; // && authorMatch;
  });

  // Determine which articles to display based on active tab
  const displayedArticles =
    activeTab === "personalized" ? personalizedArticles : filteredArticles;

  // Check if we should show the "Load More" button based on filtering
  const hasMoreAfterFiltering =
    hasNextPage &&
    (activeTab === "all"
      ? filteredArticles.length > 0
      : personalizedArticles.length > 0);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category]
    );
  };

  // Extract unique categories from all articles
  const uniqueCategories = Array.from(
    new Set(allArticles.map((article) => article.category.toLowerCase()))
  ).map((category) => ({
    id: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  // Extract unique sources from all articles
  const uniqueSources = Array.from(
    new Set(allArticles.map((article) => article.source))
  ).map((source) => ({
    id: source.toLowerCase().replace(/\s+/g, "-"),
    label: source,
  }));

  const handleSearch = () => {
    setSearchQuery(searchInputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Head description="Welcome to xNews" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">News Aggregator</h1>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 md:mt-0"
            onClick={() => setPreferencesOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Personalize
          </Button>
        </div>

        {/* Tabs for All vs Personalized */}
        {isLoading ? (
          <TabsSkeleton />
        ) : (
          preferences.enablePersonalization && (
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "all" | "personalized")
              }
              className="mb-6"
            >
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="all">All News</TabsTrigger>
                <TabsTrigger value="personalized">
                  Personalized
                  {preferences.enablePersonalization && (
                    <Badge variant="secondary" className="ml-2">
                      {preferences.preferredSources.length +
                        preferences.preferredCategories.length +
                        preferences.preferredAuthors.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )
        )}

        {/* Search and filter bar */}
        {isLoading ? (
          <SearchBarSkeleton />
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search for news..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="default"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {(selectedCategories.length > 0 || selectedSource || date) && (
                <Badge variant="secondary" className="ml-2">
                  {selectedCategories.length +
                    (selectedSource ? 1 : 0) +
                    (date ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter sidebar - hidden on mobile unless toggled */}
          <div className={cn("lg:block", isFilterOpen ? "block" : "hidden")}>
            {isLoading ? (
              <FilterSidebarSkeleton />
            ) : (
              <div className="bg-card rounded-lg border p-4 sticky top-4">
                <h2 className="font-semibold mb-4">Filter Articles</h2>

                {/* Date filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {date && (
                    <Button
                      variant="ghost"
                      className="mt-2 h-auto p-0 text-sm text-muted-foreground"
                      onClick={() => setDate(undefined)}
                    >
                      Clear date
                    </Button>
                  )}
                </div>

                {/* Category filter */}
                {uniqueCategories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Categories</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {uniqueCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`}>
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source filter */}
                {uniqueSources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Source</h3>
                    <Select
                      value={selectedSource}
                      onValueChange={setSelectedSource}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {uniqueSources.map((source) => (
                          <SelectItem
                            key={source.id}
                            value={source.label.toLowerCase()}
                          >
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Reset filters */}
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => {
                    setDate(undefined);
                    setSelectedCategories([]);
                    setSelectedSource("");
                  }}
                  disabled={
                    selectedCategories.length === 0 && !selectedSource && !date
                  }
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {/* Articles grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <Skeleton className="h-5 w-40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <ArticleCardSkeleton key={index} />
                  ))}
                </div>
              </>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error fetching the articles. Please try again
                  later.
                </AlertDescription>
              </Alert>
            ) : displayedArticles.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "personalized"
                    ? "Try adjusting your personalization preferences or filters"
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {displayedArticles.length} articles
                    {activeTab === "personalized" && " (personalized)"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative h-48">
                        <img
                          src={
                            article.imageUrl ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={article.title}
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(article.date), "MMM d, yyyy")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {article.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {article.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-0">
                        <span className="text-xs text-muted-foreground">
                          Source: {article.source}
                        </span>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read more
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Infinite Scroll / Load More */}
                <div className="mt-8">
                  <InfiniteScroll
                    onLoadMore={fetchNextPage}
                    hasMore={hasMoreAfterFiltering}
                    isLoading={isFetchingNextPage}
                    loadMoreText="Load more articles"
                    loadingText="Loading more articles..."
                    noMoreText={
                      displayedArticles.length > 0
                        ? "You've reached the end of the articles"
                        : "No articles match your current filters"
                    }
                    filteredItemCount={displayedArticles.length}
                    totalItemCount={allArticles.length}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preferences Modal */}
        <PreferencesModal
          open={preferencesOpen}
          onOpenChange={setPreferencesOpen}
          articles={allArticles || []}
        />
      </div>
    </>
  );
};

export default LandingRoute;
