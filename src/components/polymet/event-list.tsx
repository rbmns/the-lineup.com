import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import EventCard from "@/polymet/components/event-card";
import CategoryFilter from "@/polymet/components/category-filter";

interface Event {
  id: string | number;
  title: string;
  image: string;
  category: string;
  vibe?: string;
  host?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  location?: string;
  date: string;
  time?: string;
  attendees?: {
    count: number;
    avatars?: string[];
  };
  showRsvp?: boolean;
  description?: string;
}

interface EventListProps {
  title?: string;
  events: Event[];
  categories?: string[];
  showFilter?: boolean;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
  onRsvpGoing?: (id: string | number) => void;
  onRsvpInterested?: (id: string | number) => void;
}

export default function EventList({
  title = "Events",
  events,
  categories,
  showFilter = false,
  showViewAll = true,
  viewAllLink = "/events",
  className = "",
  onRsvpGoing,
  onRsvpInterested,
}: EventListProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories from events if not provided
  const eventCategories =
    categories ||
    Array.from(new Set(events.map((event) => event.category))).sort();

  // Filter events by selected category
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter(
          (event) =>
            event.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section className={`px-4 py-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header with title and view all link */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary font-inter">
            {title}
          </h2>
          {showViewAll && events.length > 0 && (
            <Link
              to={viewAllLink}
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRightIcon size={16} className="ml-1" />
            </Link>
          )}
        </div>

        {/* Category filter */}
        {showFilter && (
          <div className="mb-8">
            <CategoryFilter
              categories={eventCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                onRsvpGoing={onRsvpGoing}
                onRsvpInterested={onRsvpInterested}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-secondary-50 bg-secondary-10 text-center">
            <p className="mb-4 text-neutral-75">
              No events found for this category.
            </p>
            <Link to="/events" className="text-primary hover:underline">
              View all events
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
