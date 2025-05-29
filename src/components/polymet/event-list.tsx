
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// Simple EventCard component for polymet
interface EventCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, category, date, time, location, price, image }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="aspect-video relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs">
        {category}
      </div>
    </div>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">{date} • {time}</p>
      <p className="text-sm text-gray-600 mb-2">{location}</p>
      <p className="font-medium text-primary">{price}</p>
    </CardContent>
  </Card>
);

// Simple CategoryFilter component
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    <button
      onClick={() => onSelectCategory(null)}
      className={cn(
        "px-3 py-1 rounded-full text-sm",
        selectedCategory === null ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
      )}
    >
      All
    </button>
    {categories.map(category => (
      <button
        key={category}
        onClick={() => onSelectCategory(category)}
        className={cn(
          "px-3 py-1 rounded-full text-sm",
          selectedCategory === category ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
        )}
      >
        {category}
      </button>
    ))}
  </div>
);

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
          <EventCard 
            key={event.id}
            id={event.id}
            title={event.title}
            category={event.category}
            date={event.date}
            time={event.time}
            location={event.location}
            price={event.price}
            image={event.image}
          />
        ))}
      </div>
    </section>
  );
};

export default EventList;
