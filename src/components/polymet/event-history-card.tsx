import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarIcon, UsersIcon } from "lucide-react";
import CategoryBadge from "@/components/polymet/category-badge";

// Simple UserEvent interface
export interface UserEvent {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
  time: string;
  location: string;
  isPast: boolean;
  attendees?: {
    count: number;
    avatars?: string[];
  };
}

interface EventHistoryCardProps {
  userEvents?: UserEvent[];
  friendsEvents?: UserEvent[];
  showFriendsEvents?: boolean;
  title?: string;
  className?: string;
  hideUserEvents?: boolean;
}

export default function EventHistoryCard({
  userEvents = [],
  friendsEvents = [],
  showFriendsEvents = false,
  title = "Events",
  className = "",
  hideUserEvents = false,
}: EventHistoryCardProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showFriends, setShowFriends] = useState(showFriendsEvents);

  const upcomingUserEvents = userEvents.filter((event) => !event.isPast);
  const pastUserEvents = userEvents.filter((event) => event.isPast);

  const upcomingFriendsEvents =
    friendsEvents?.filter((event) => !event.isPast) || [];
  const pastFriendsEvents =
    friendsEvents?.filter((event) => event.isPast) || [];

  const displayedUpcomingEvents = showFriends
    ? [...upcomingUserEvents, ...upcomingFriendsEvents]
    : upcomingUserEvents;

  const displayedPastEvents = showFriends
    ? [...pastUserEvents, ...pastFriendsEvents]
    : pastUserEvents;

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white ${className}`}
    >
      <div className="border-b border-secondary-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {friendsEvents && friendsEvents.length > 0 && !hideUserEvents && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-friends-events"
                checked={showFriends}
                onCheckedChange={setShowFriends}
              />

              <Label htmlFor="show-friends-events" className="text-sm">
                Include friends' events
              </Label>
            </div>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "upcoming" | "past")}
        className="w-full"
      >
        <div className="border-b border-secondary-50">
          <TabsList className="w-full rounded-none bg-transparent h-auto p-0">
            <TabsTrigger
              value="upcoming"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-vibrant-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CalendarIcon size={16} className="mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-vibrant-teal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <CalendarIcon size={16} className="mr-2" />
              Past
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upcoming" className="p-0">
          {displayedUpcomingEvents.length > 0 ? (
            <div className="divide-y divide-secondary-50">
              {displayedUpcomingEvents.map((event) => (
                <EventHistoryItem
                  key={event.id}
                  event={event}
                  isFriendsEvent={
                    showFriends && friendsEvents?.some((e) => e.id === event.id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />

              <h3 className="mt-2 font-medium">No upcoming events</h3>
              <p className="text-sm text-muted-foreground">
                {hideUserEvents
                  ? "Your friends haven't joined any upcoming events yet"
                  : "You haven't joined any upcoming events yet"}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/events">Discover Events</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="p-0">
          {displayedPastEvents.length > 0 ? (
            <div className="divide-y divide-secondary-50">
              {displayedPastEvents.map((event) => (
                <EventHistoryItem
                  key={event.id}
                  event={event}
                  isFriendsEvent={
                    showFriends && friendsEvents?.some((e) => e.id === event.id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />

              <h3 className="mt-2 font-medium">No past events</h3>
              <p className="text-sm text-muted-foreground">
                {hideUserEvents
                  ? "Your friends haven't attended any events yet"
                  : "You haven't attended any events yet"}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/events">Discover Events</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface EventHistoryItemProps {
  event: UserEvent;
  isFriendsEvent?: boolean;
}

function EventHistoryItem({
  event,
  isFriendsEvent = false,
}: EventHistoryItemProps) {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="mr-4 flex-shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="h-16 w-16 rounded-md object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <CategoryBadge category={event.category} size="sm" />

            {isFriendsEvent && (
              <div className="ml-2 flex items-center text-xs text-muted-foreground">
                <UsersIcon size={12} className="mr-1" />
                Friend's event
              </div>
            )}
          </div>
          <h3 className="mt-1 font-medium">
            <Link
              to={`/events/${event.id}`}
              className="hover:text-vibrant-teal hover:underline"
            >
              {event.title}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center text-sm text-muted-foreground">
            <span className="mr-3">{event.date}</span>
            <span className="mr-3">{event.time}</span>
            <span>{event.location}</span>
          </div>
          {event.attendees && (
            <div className="mt-2 flex items-center">
              <div className="flex -space-x-2">
                {event.attendees.avatars?.slice(0, 3).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="Attendee"
                    className="h-6 w-6 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                {event.attendees.count} attendee
                {event.attendees.count !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/events/${event.id}`}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
