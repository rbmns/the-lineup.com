
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryFilter from '@/components/polymet/category-filter';
import VibeFilter from '@/components/polymet/vibe-filter';
import { EventCategoryLabel, EventCategoryLabelsCollection } from '@/components/polymet/event-category-labels';
import EventVibeLabelEnhanced from '@/components/polymet/event-vibe-label-enhanced';
import CategoryBadge from '@/components/polymet/category-badge';

export default function EventCategoriesStyleGuide() {
  const [selectedCategory, setSelectedCategory] = useState('yoga');
  const [selectedVibe, setSelectedVibe] = useState('wellness');

  const categories = [
    'festival',
    'wellness', 
    'kite',
    'beach',
    'game',
    'other',
    'sports',
    'surf',
    'party',
    'yoga',
    'community',
    'music',
    'food',
    'market',
    'art'
  ];

  const vibes = [
    'party',
    'chill', 
    'wellness',
    'active',
    'social',
    'creative'
  ];

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
            <h2 className="text-xl font-semibold mb-4">Category Labels Collection</h2>
            <p className="text-muted-foreground mb-4">
              All category labels in different sizes
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Small Size</h3>
                <EventCategoryLabelsCollection size="sm" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Medium Size</h3>
                <EventCategoryLabelsCollection size="md" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Large Size</h3>
                <EventCategoryLabelsCollection size="lg" />
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="vibes" className="space-y-8">
          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Vibe Labels</h2>
            <p className="text-muted-foreground mb-4">
              Enhanced vibe labels with gradients and patterns
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
              Interactive vibe filter with scroll shadows
            </p>
            <VibeFilter
              selectedVibe={selectedVibe}
              onChange={setSelectedVibe}
            />
          </section>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-8">
          <section className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Categories vs Vibes</h2>
            <p className="text-muted-foreground mb-4">
              Comparison of category and vibe styling approaches
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((category) => (
                    <CategoryBadge key={category} category={category} size="md" />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Vibes</h3>
                <div className="flex flex-wrap gap-2">
                  {vibes.map((vibe) => (
                    <EventVibeLabelEnhanced key={vibe} vibe={vibe} size="md" />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
