import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/polymet/components/button";
import CategoryBadge from "@/polymet/components/category-badge";
import { Link } from "react-router-dom";
import { CalendarIcon, UsersIcon } from "lucide-react";

// Define the combined event type
interface CombinedEvent {
  id: string;
  title: string;
  image?: string;
  category: string;
  location: string;
  date: string;
  time: string;
  isPast: boolean;
  eventType: "regular" | "casual";
  host?: {
    id: string;
    name: string;
    avatar?: string;
  };
  attendees?: {
    count: number;
    max?: number;
    avatars?: string[];
  };
}

interface FriendsEventsTabProps {
  friendsEvents?: any[];
  friendsCasualPlans?: any[];
  filteredEvents?: CombinedEvent[];
  showFilters?: boolean;
}

export default function FriendsEventsTab({
  friendsEvents = [],
  friendsCasualPlans = [],
  filteredEvents,
  showFilters = true,
}: FriendsEventsTabProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [eventTypeFilter, setEventTypeFilter] = useState<
    "all" | "regular" | "casual"
  >("all");

  // If filteredEvents is provided, use that, otherwise combine and filter the events
  const allEvents: CombinedEvent[] = filteredEvents || [
    ...friendsEvents.map((event) => ({
      ...event,
      eventType: "regular" as const,
    })),
    ...friendsCasualPlans.map((plan) => ({
      ...plan,
      eventType: "casual" as const,
      isPast: new Date(plan.date.split(", ")[1]) < new Date(),
    })),
  ];

  // Filter by tab (upcoming/past)
  const events = allEvents.filter((event) =>
    activeTab === "upcoming" ? !event.isPast : event.isPast
  );

  // Filter by event type if needed
  const displayedEvents = events.filter(
    (event) => eventTypeFilter === "all" || event.eventType === eventTypeFilter
  );

  return (
    <div>
      <Tabs
        defaultValue="upcoming"
        onValueChange={(value) => setActiveTab(value as "upcoming" | "past")}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming
              <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs">
                {allEvents.filter((e) => !e.isPast).length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past
              <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs">
                {allEvents.filter((e) => e.isPast).length}
              </span>
            </TabsTrigger>
          </TabsList>

          {showFilters && (
            <div className="flex mt-4 sm:mt-0">
              <Button
                variant={eventTypeFilter === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEventTypeFilter("all")}
                className="mr-2"
              >
                All
              </Button>
              <Button
                variant={eventTypeFilter === "regular" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEventTypeFilter("regular")}
                className="mr-2"
              >
                Events
              </Button>
              <Button
                variant={eventTypeFilter === "casual" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setEventTypeFilter("casual")}
              >
                Casual Plans
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="upcoming" className="mt-0">
          {displayedEvents.length > 0 ? (
            <div className="space-y-4">
              {displayedEvents.map((event) => (
                <EventItem
                  key={`${event.eventType}-${event.id}`}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {displayedEvents.length > 0 ? (
            <div className="space-y-4">
              {displayedEvents.map((event) => (
                <EventItem
                  key={`${event.eventType}-${event.id}`}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No past events found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventItem({ event }: { event: CombinedEvent }) {
  const eventLink =
    event.eventType === "regular"
      ? `/events/${event.id}`
      : `/plans/${event.id}`;

  const hostLink = event.host?.id ? `/profile/${event.host.id}` : undefined;

  return (
    <div className="flex flex-col sm:flex-row border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {event.image && (
        <div className="sm:w-1/4 h-40 sm:h-auto">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center mb-2">
              <CategoryBadge category={event.category} size="sm" />

              <span className="ml-2 text-xs font-medium px-2 py-1 rounded bg-secondary">
                {event.eventType === "regular" ? "Event" : "Casual Plan"}
              </span>
            </div>
            <Link
              to={eventLink}
              className="text-lg font-semibold hover:text-primary"
            >
              {event.title}
            </Link>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-1" />

            <span>
              {event.date} • {event.time}
            </span>
          </div>
          <div className="mt-1">{event.location}</div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            {event.host && (
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-1">Hosted by:</span>
                {hostLink ? (
                  <Link
                    to={hostLink}
                    className="font-medium hover:text-primary"
                  >
                    {event.host.name}
                  </Link>
                ) : (
                  <span className="font-medium">{event.host.name}</span>
                )}
              </div>
            )}
          </div>

          {event.attendees && (
            <div className="flex items-center">
              <UsersIcon size={14} className="mr-1 text-gray-500" />

              <span className="text-sm text-gray-500">
                {event.attendees.count}
                {event.attendees.max ? `/${event.attendees.max}` : ""}
              </span>

              {event.attendees.avatars &&
                event.attendees.avatars.length > 0 && (
                  <div className="flex -space-x-2 ml-2">
                    {event.attendees.avatars
                      .slice(0, 3)
                      .map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt="Attendee"
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    {event.attendees.count > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-800">
                        +{event.attendees.count - 3}
                      </div>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
