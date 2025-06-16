
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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
        "group hover:shadow-lg transition-shadow flex flex-col cursor-pointer overflow-hidden rounded-xl shadow-md",
        isMobile ? "w-full" : "w-80",
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      role="button"
    >
      <div className={`relative w-full ${isMobile ? 'h-40' : 'h-48'} rounded-t-xl overflow-hidden transform`}>
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          className={isMobile ? "h-40" : "h-48"}
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
            <CategoryPill 
              category={event.event_category} 
              active={true} 
              noBorder={true} 
              size={isMobile ? "xs" : "sm"}
            />
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-2 ${isMobile ? 'p-3' : 'p-4'} w-full text-left items-start`}>
        <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold leading-tight line-clamp-2 text-ocean-deep-900 font-inter text-left`}>
          {event.title}
        </h3>
        <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-ocean-deep-700 font-inter text-left`}>
          <Calendar size={isMobile ? 13 : 15} className="flex-shrink-0" />
          <span>
            {formatEventCardDateTime(event.start_date, event.start_time)}
          </span>
        </div>
        {event.venues?.name || event.location ? (
          <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-ocean-deep-700 font-inter text-left`}>
            <MapPin size={isMobile ? 13 : 15} className="flex-shrink-0" />
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
export const ViewAllCard: React.FC<ViewAllCardProps> = ({ onClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center cursor-pointer",
        isMobile ? "w-full min-h-[200px]" : "max-w-xs min-h-[256px] w-[80px]"
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="View all events"
    >
      <div className="flex items-center justify-center h-16">
        <span className="bg-ocean-deep-500 text-white rounded-full p-3">
          <ArrowRight size={isMobile ? 24 : 28} />
        </span>
      </div>
      <div className={`text-ocean-deep-800 font-medium ${isMobile ? 'text-sm' : 'text-xs'} mt-4`}>View All</div>
    </div>
  );
};
