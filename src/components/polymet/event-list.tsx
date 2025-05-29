import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '@/components/polymet/event-card';
import CategoryFilter from '@/components/polymet/category-filter';

interface EventListProps {
  events: any[];
  categories?: string[];
  className?: string;
}

const EventList: React.FC<EventListProps> = ({ events, categories, className }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEvents = selectedCategory
    ? events.filter(event => event.category === selectedCategory)
    : events;

  return (
    <section className={cn("space-y-4", className)}>
      {categories && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default EventList;
