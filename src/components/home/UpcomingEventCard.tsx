
import React from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryPill } from "@/components/ui/category-pill";
import { LineupImage } from "@/components/ui/lineup-image";
import { formatEventCardDateTime } from "@/utils/date-formatting";
import { Event } from "@/types";
import { useEventImages } from "@/hooks/useEventImages";
import { DEFAULT_FALLBACK_IMAGE_URL } from "@/utils/eventImages";
import { Card } from "@/components/ui/card";

interface UpcomingEventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
  className?: string;
  showCategory?: boolean;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
  event,
  onClick,
  className = "",
  showCategory = true,
}) => {
  const { getEventImageUrl } = useEventImages();
  const imageUrl = getEventImageUrl(event);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(event);
    }
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-shadow flex flex-col w-80 cursor-pointer overflow-hidden rounded-xl shadow-md",
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      role="button"
    >
      <div className="relative w-full h-48 rounded-t-xl overflow-hidden transform">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          className="h-48"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== DEFAULT_FALLBACK_IMAGE_URL) {
              console.log(`[UpcomingEventCard] Image failed to load: ${target.src}. Falling back to default.`);
              target.src = DEFAULT_FALLBACK_IMAGE_URL;
            }
          }}
        />
        {showCategory && event.event_category && (
          <div className="absolute top-3 left-3">
            <CategoryPill category={event.event_category} active={true} noBorder={true} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 w-full text-left items-start">
        <h3 className="text-base font-bold leading-tight line-clamp-2 text-ocean-deep-900 font-inter text-left">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-ocean-deep-700 font-inter text-left">
          <Calendar size={15} className="flex-shrink-0" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time)}
          </span>
        </div>
        {event.venues?.name || event.location ? (
          <div className="flex items-center gap-2 text-sm text-ocean-deep-700 font-inter text-left">
            <MapPin size={15} className="flex-shrink-0" />
            <span className="truncate">
              {event.venues?.name || event.location}
            </span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

interface ViewAllCardProps {
  onClick?: () => void;
}
export const ViewAllCard: React.FC<ViewAllCardProps> = ({ onClick }) => (
  <div
    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center max-w-xs min-h-[256px] w-[80px] cursor-pointer"
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label="View all events"
  >
    <div className="flex items-center justify-center h-16">
      <span className="bg-ocean-deep-500 text-white rounded-full p-3">
        <ArrowRight size={28} />
      </span>
    </div>
    <div className="text-ocean-deep-800 font-medium text-xs mt-4">View All</div>
  </div>
);
