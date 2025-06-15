import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { CategoryPill } from "@/components/ui/category-pill";
import { UpcomingEventCard, ViewAllCard } from "./UpcomingEventCard";
import { Event } from "@/types";
import { cn } from "@/lib/utils";

interface UpcomingEventsSectionProps {
  isLoading: boolean;
  filteredEvents: Event[];
  availableVibes: string[];
  selectedVibe: string | null;
  handleVibeClick: (vibe: string) => void;
  setSelectedVibe: (vibe: string | null) => void;
  getEventImageUrl: (event: Event) => string | null;
  handleEventClick: (event: Event) => void;
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  isLoading,
  filteredEvents,
  availableVibes,
  selectedVibe,
  handleVibeClick,
  setSelectedVibe,
  getEventImageUrl,
  handleEventClick,
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-3 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-ocean-deep-900 text-left font-inter">
          Upcoming Events
        </h2>
        {/* Vibe Filter Pills */}
        <div className="flex flex-nowrap gap-2 mb-7 overflow-x-auto pb-2 no-scrollbar">
          <CategoryPill
            category="All vibes"
            active={!selectedVibe}
            noBorder={true}
            onClick={() => setSelectedVibe(null)}
          />
          {availableVibes.map(vibe => (
            <CategoryPill
              key={vibe}
              category={vibe}
              active={selectedVibe === vibe}
              noBorder={true}
              onClick={() => handleVibeClick(vibe)}
            />
          ))}
        </div>
        {/* Events Row (Slider Style) */}
        <div
          className={cn(
            "flex flex-nowrap gap-6 w-full overflow-x-auto pb-3",
            isLoading ? "justify-center items-center" : "justify-start"
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {isLoading ? (
            <div className="flex justify-center w-full py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black" />
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              {filteredEvents.slice(0, 4).map(event => (
                <UpcomingEventCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                  showCategory={true}
                  className="shrink-0"
                />
              ))}
              {/* Instead of an event, last card is "View All" if there are more events */}
              {filteredEvents.length > 4 && (
                <ViewAllCard onClick={() => navigate("/events")} />
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500 w-full">
              No events available
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
