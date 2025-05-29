import React from 'react';

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

import EventCard from '@/components/polymet/event-card';
import { cn } from "@/lib/utils";

interface RelatedEventsProps {
  events?: any[]; // Replace 'any' with a more specific type if possible
  className?: string;
}

const RelatedEvents: React.FC<RelatedEventsProps> = ({ events = mockEventsData.events, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-lg font-semibold">Related Events</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} compact />
        ))}
      </div>
    </div>
  );
};

export default RelatedEvents;
