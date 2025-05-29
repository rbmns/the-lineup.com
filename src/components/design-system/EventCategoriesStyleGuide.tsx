
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryFilter from "@/polymet/components/category-filter";
import VibeFilter from "@/polymet/components/vibe-filter";
import {
  EventCategoryLabel,
  EventCategoryLabelsCollection,
} from "@/polymet/components/event-category-labels";
import EventVibeLabelEnhanced from "@/polymet/components/event-vibe-label-enhanced";
import CategoryBadge from "@/polymet/components/category-badge";

export default function EventCategoriesStyleGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string>("yoga");
  const [selectedVibe, setSelectedVibe] = useState<string | null>("wellness");

  const categories = [
    "festival", "wellness", "kite", "beach", "game", "other", 
    "sports", "surf", "party", "yoga", "community", "music", 
    "food", "market", "art"
  ];

  const vibes = ["party", "chill", "wellness", "active", "social", "creative"];

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Event Categories & Vibes Style Guide</h1>
      <p className="text-muted-foreground mb-8">
        A comprehensive guide to category and vibe filtering components
      </p>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Category Filters</TabsTrigger>
          <TabsTrigger value="vibes">Vibe Filters</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-8">
          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Category Badges</h2>
            <p className="text-muted-foreground mb-4">
              Individual category badges with distinct colors for each category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryBadge key={category} category={category} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Category Filter</h2>
            <p className="text-muted-foreground mb-4">
              Horizontal scrollable filter for selecting event categories
            </p>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </section>

          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-1">Interactive Example</h2>
            <p className="text-muted-foreground mb-4">
              Click on a category to see it selected
            </p>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <p className="mt-4">Selected category: {selectedCategory}</p>
          </section>
        </TabsContent>

        <TabsContent value="vibes" className="space-y-8">
          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Vibe Labels</h2>
            <p className="text-muted-foreground mb-4">
              Individual vibe labels with distinct colors and patterns
            </p>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <EventVibeLabelEnhanced key={vibe} vibe={vibe} />
              ))}
            </div>
          </section>

          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Vibe Filter</h2>
            <p className="text-muted-foreground mb-4">
              Horizontal scrollable filter for selecting event vibes
            </p>
            <VibeFilter
              selectedVibe={selectedVibe}
              onChange={setSelectedVibe}
            />
          </section>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-8">
          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              When to Use Each Filter Type
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Category Filters</h3>
                <p className="text-muted-foreground">
                  Use for filtering events by their primary type or purpose
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Content-based:</strong> Filters by what the event is about
                  </li>
                  <li>
                    <strong>Objective:</strong> Based on event description and activities
                  </li>
                  <li>
                    <strong>Examples:</strong> Yoga, Music, Food, Market, etc.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vibe Filters</h3>
                <p className="text-muted-foreground">
                  Use for filtering events by their atmosphere or emotional experience
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Mood-based:</strong> Filters by how the event feels
                  </li>
                  <li>
                    <strong>Subjective:</strong> Based on atmosphere and emotional experience
                  </li>
                  <li>
                    <strong>Examples:</strong> Chill, Active, Social, Creative, etc.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
