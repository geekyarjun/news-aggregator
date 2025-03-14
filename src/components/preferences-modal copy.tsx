"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import type { NewsArticle } from "@/types/article";
import { Skeleton } from "@/components/ui/skeleton";

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articles: NewsArticle[];
}

export function PreferencesModal({
  open,
  onOpenChange,
  articles,
}: PreferencesModalProps) {
  const {
    preferences,
    setPreferredSources,
    setPreferredCategories,
    setPreferredAuthors,
    togglePersonalization,
    resetPreferences,
  } = usePreferencesStore();

  // Local state to track changes before saving
  const [selectedSources, setSelectedSources] = useState<string[]>(
    preferences.preferredSources
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    preferences.preferredCategories
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    preferences.preferredAuthors
  );
  const [personalizationEnabled, setPersonalizationEnabled] = useState(
    preferences.enablePersonalization
  );
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique sources, categories, and authors from articles
  const uniqueSources = Array.from(
    new Set(articles.map((article) => article.source))
  );
  const uniqueCategories = Array.from(
    new Set(articles.map((article) => article.category))
  );

  // For authors, we'll need to extract them from the articles if available
  // This is a placeholder since our current data model doesn't include authors
  const uniqueAuthors = Array.from(
    new Set(articles.map((article) => article.source))
  )
    .map((source) => `Editor at ${source}`)
    .slice(0, 5); // Limit to 5 for demo purposes

  // Reset local state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedSources(preferences.preferredSources);
      setSelectedCategories(preferences.preferredCategories);
      setSelectedAuthors(preferences.preferredAuthors);
      setPersonalizationEnabled(preferences.enablePersonalization);

      // Simulate loading data
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [open, preferences]);

  const handleSave = () => {
    setPreferredSources(selectedSources);
    setPreferredCategories(selectedCategories);
    setPreferredAuthors(selectedAuthors);
    togglePersonalization(personalizationEnabled);
    onOpenChange(false);
  };

  const handleReset = () => {
    resetPreferences();
    setSelectedSources([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
    setPersonalizationEnabled(false);
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Personalize Your News Feed</DialogTitle>
          <DialogDescription>
            Select your preferred sources, categories, and authors to customize
            your news feed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="personalization"
            checked={personalizationEnabled}
            onCheckedChange={setPersonalizationEnabled}
          />
          <Label htmlFor="personalization">Enable personalized feed</Label>
        </div>

        <Tabs defaultValue="sources" className="flex-1 min-h-[300px]">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="flex-1">
            {isLoading ? (
              <div className="space-y-4 p-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {uniqueSources.map((source) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        id={`source-${source}`}
                        checked={selectedSources.includes(source)}
                        onCheckedChange={() => toggleSource(source)}
                      />
                      <Label htmlFor={`source-${source}`}>{source}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="categories" className="flex-1">
            {isLoading ? (
              <div className="space-y-4 p-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {uniqueCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="authors" className="flex-1">
            {isLoading ? (
              <div className="space-y-4 p-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {uniqueAuthors.map((author) => (
                    <div key={author} className="flex items-center space-x-2">
                      <Checkbox
                        id={`author-${author}`}
                        checked={selectedAuthors.includes(author)}
                        onCheckedChange={() => toggleAuthor(author)}
                      />
                      <Label htmlFor={`author-${author}`}>{author}</Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Save preferences"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
