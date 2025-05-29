
import React from 'react';
import { cn } from "@/lib/utils";

// Simple EventCard component for related events
interface EventCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  image: string;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  id, title, category, date, time, location, price, image, compact = false 
}) => (
  <div className={cn(
    "bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow",
    compact ? "max-w-sm" : ""
  )}>
    <div className={cn("aspect-video relative", compact ? "aspect-[4/3]" : "")}>
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs">
        {category}
      </div>
    </div>
    <div className="p-4">
      <h3 className={cn("font-semibold mb-2", compact ? "text-base" : "text-lg")}>{title}</h3>
      <p className="text-sm text-gray-600 mb-1">{date} • {time}</p>
      <p className="text-sm text-gray-600 mb-2">{location}</p>
      <p className="font-medium text-primary">{price}</p>
    </div>
  </div>
);

// Mock data for demo purposes
const mockEventsData = {
  events: [
    {
      id: "1",
      title: "Beach Yoga Session",
      category: "Wellness",
      date: "2024-03-15",
      time: "7:00 AM",
      location: "Santa Monica Beach",
      price: "Free",
      image: "/api/placeholder/300/200"
    }
  ]
};

interface RelatedEventsProps {
  events?: any[];
  className?: string;
}

const RelatedEvents: React.FC<RelatedEventsProps> = ({ events = mockEventsData.events, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-lg font-semibold">Related Events</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
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
            compact
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedEvents;
