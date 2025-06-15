import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import PolymetEventCard from "@/components/polymet/event-card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { formatFeaturedDate } from "@/utils/date-formatting";

interface HomeUpcomingEventsSectionProps {
  isLoading: boolean;
  filteredEvents: Event[];
  handleEventClick: (event: Event) => void;
  availableVibes: string[];
  selectedVibe: string | null;
  setSelectedVibe: (vibe: string | null) => void;
}

export const HomeUpcomingEventsSection: React.FC<HomeUpcomingEventsSectionProps> = ({
  isLoading,
  filteredEvents,
  handleEventClick,
  availableVibes,
  selectedVibe,
  setSelectedVibe,
}) => {
  return (
    <section className="py-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-ocean-deep mb-2">Upcoming Events</h2>
              <p className="text-clay-earth">Discover what's happening in your area</p>
            </div>
            <Link
              to="/events"
              className="text-seafoam-green hover:text-ocean-deep font-medium transition-colors"
            >
              View all →
            </Link>
          </div>
          {/* Vibe Filter Pills */}
          {availableVibes.length > 0 && (
            <div className="mb-8">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedVibe(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    !selectedVibe
                      ? "btn-ocean text-white shadow-md"
                      : "bg-white/80 text-clay-earth hover:bg-white border border-driftwood-grey"
                  }`}
                >
                  All vibes
                </button>
                {availableVibes.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() =>
                      setSelectedVibe(selectedVibe === vibe ? null : vibe)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedVibe === vibe
                        ? "btn-sunset text-white shadow-md"
                        : "bg-white/80 text-clay-earth hover:bg-white border border-driftwood-grey"
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Event Cards Grid (Polymet Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-coastal animate-pulse">
                  <div className="h-48 bg-driftwood-grey/30"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-driftwood-grey/30 w-3/4"></div>
                    <div className="h-3 bg-driftwood-grey/30 w-1/2"></div>
                    <div className="h-3 bg-driftwood-grey/30 w-2/3"></div>
                  </div>
                </div>
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="cursor-pointer h-full transform hover:scale-105 transition-all duration-300"
                  onClick={() => handleEventClick(event)}
                >
                  <PolymetEventCard
                    id={event.id}
                    title={event.title}
                    image={event.image_urls?.[0] || "/img/default.jpg"}
                    category={event.event_category || "Other"}
                    // vibe omitted! No 'v' label on card
                    host={
                      event.creator
                        ? {
                            id: event.creator.id,
                            name:
                              event.creator.username ||
                              event.creator.email ||
                              "Host",
                            avatar: Array.isArray(event.creator.avatar_url)
                              ? event.creator.avatar_url[0]
                              : event.creator.avatar_url,
                          }
                        : undefined
                    }
                    location={event.venues?.name || event.location || ""}
                    date={formatFeaturedDate(event.start_date || "")}
                    time={event.start_time || undefined}
                    attendees={
                      event.going_count || event.interested_count
                        ? {
                            count:
                              (event.going_count ?? 0) +
                              (event.interested_count ?? 0),
                            avatars: [],
                          }
                        : undefined
                    }
                    showRsvp={false}
                    className="h-full w-full rounded-md"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-clay-earth">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-driftwood-grey" />
                <p>No events match your selected vibe</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
