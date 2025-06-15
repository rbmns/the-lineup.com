
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPill } from '@/components/ui/category-pill';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEventImages } from '@/hooks/useEventImages';
import { LineupImage } from '@/components/ui/lineup-image';
import { formatFeaturedDate, formatEventTime } from '@/utils/date-formatting';
import { Event } from '@/types';

interface UpcomingEventsSectionProps {
  isLoading: boolean;
  filteredEvents: Event[];
  availableCategoriesInUpcoming: string[];
  selectedCategory: string | null;
  handleCategoryClick: (category: string) => void;
  setSelectedCategory: (category: string | null) => void;
  getEventImageUrl: (event: Event) => string | null;
  handleEventClick: (event: Event) => void;
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  isLoading,
  filteredEvents,
  availableCategoriesInUpcoming,
  selectedCategory,
  handleCategoryClick,
  setSelectedCategory,
  getEventImageUrl,
  handleEventClick,
}) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold tracking-tight">Upcoming Events</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
            View all →
          </Link>
        </div>
        {/* Category Filter Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <CategoryPill
            category="All categories"
            active={!selectedCategory}
            noBorder={true}
            onClick={() => setSelectedCategory(null)}
          />
          {availableCategoriesInUpcoming.map((category) => (
            <CategoryPill
              key={category}
              category={category}
              active={selectedCategory === category}
              noBorder={true}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="flex justify-center w-full py-8 col-span-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <LineupImage
                      src={event.image_urls && event.image_urls.length > 0 ? event.image_urls[0] : getEventImageUrl(event)}
                      alt={event.title}
                      aspectRatio="video"
                      overlayVariant="ocean"
                      className="h-48"
                    />
                    {event.event_category && (
                      <div className="absolute top-3 left-3 z-30">
                        <CategoryPill
                          category={event.event_category}
                          active={true}
                          noBorder={true}
                        />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatFeaturedDate(event.start_date)} • {formatEventTime(event.start_time, event.end_time)}
                    </p>
                    <p className="text-sm text-gray-600">{event.venues?.name || event.location}</p>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No events available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
