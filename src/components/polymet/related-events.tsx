import { cn } from "@/lib/utils";
import { EventData } from "@/polymet/data/events-data";
import EventCard from "@/polymet/components/event-card";

interface RelatedEventsProps {
  events: EventData[];
  className?: string;
  title?: string;
}

export default function RelatedEvents({
  events,
  className,
  title = "Related Events",
}: RelatedEventsProps) {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <EventCard key={event.id} {...event} showRsvp={true} />
        ))}
      </div>
    </div>
  );
}
