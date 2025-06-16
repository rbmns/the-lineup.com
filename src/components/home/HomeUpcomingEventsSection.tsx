
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryPill } from '@/components/ui/category-pill';
import { VibeFilter } from '@/components/home/VibeFilter';
import { UpcomingEventCard } from '@/components/home/UpcomingEventCard';
import { typography } from '@/components/polymet/brand-typography';

interface HomeUpcomingEventsSectionProps {
  events: any[];
  isLoading: boolean;
}

const vibes = ['active', 'mindful', 'social', 'creative', 'wellness'];

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  events,
  isLoading
}) => {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  const filteredEvents = selectedVibe 
    ? events?.filter(event => event.vibe?.toLowerCase() === selectedVibe.toLowerCase()) || []
    : events || [];

  return (
    <section className="py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className={`${typography.h2} mb-2`}>Upcoming Events</h2>
            <p className={`${typography.body} text-muted-foreground`}>
              Discover what's happening in your area
            </p>
          </div>
          <Button asChild variant="ghost" className="self-start sm:self-auto">
            <Link to="/events" className="flex items-center gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Vibe Filter */}
        <div className="w-full overflow-x-auto">
          <VibeFilter 
            vibes={vibes}
            selectedVibe={selectedVibe}
            onVibeSelect={setSelectedVibe}
          />
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredEvents.slice(0, 6).map((event) => (
                <UpcomingEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found for this vibe. Try a different filter!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
