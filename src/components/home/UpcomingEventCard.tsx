
import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryPill } from "@/components/ui/category-pill";
import { LineupImage } from "@/components/ui/lineup-image";
import { formatEventCardDateTime } from "@/utils/date-formatting";
import { Event } from "@/types";
import { useEventImages } from "@/hooks/useEventImages";
import { DEFAULT_FALLBACK_IMAGE_URL } from "@/utils/eventImages";
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
    <div
      className={cn(
        "group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-[#F4E7D3] hover:border-[#2A9D8F]/30 transform hover:-translate-y-1",
        className
      )}
      onClick={handleClick}
      tabIndex={0}
      role="button"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#F4E7D3] to-[#EDC46A]/30">
        <LineupImage
          src={imageUrl}
          alt={event.title}
          aspectRatio="video"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== DEFAULT_FALLBACK_IMAGE_URL) {
              console.log(`[UpcomingEventCard] Image failed to load: ${target.src}. Falling back to default.`);
              target.src = DEFAULT_FALLBACK_IMAGE_URL;
            }
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {showCategory && event.event_category && (
          <div className="absolute top-4 left-4">
            <CategoryPill 
              category={event.event_category} 
              active={true} 
              noBorder={true} 
              size={isMobile ? "xs" : "sm"}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Title */}
        <h3 className="font-bold text-lg md:text-xl leading-tight mb-3 text-[#005F73] line-clamp-2 group-hover:text-[#2A9D8F] transition-colors">
          {event.title}
        </h3>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-[#005F73]/70">
            <Calendar className="h-4 w-4 text-[#2A9D8F] flex-shrink-0" />
            <span className="text-sm font-medium">
              {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
            </span>
          </div>

          {/* Location */}
          {(event.venues?.name || event.location) && (
            <div className="flex items-center gap-3 text-[#005F73]/70">
              <MapPin className="h-4 w-4 text-[#2A9D8F] flex-shrink-0" />
              <span className="text-sm font-medium truncate">
                {event.venues?.name || event.location}
              </span>
            </div>
          )}
        </div>

        {/* Bottom accent */}
        <div className="h-1 w-12 bg-gradient-to-r from-[#2A9D8F] to-[#00B4DB] rounded-full group-hover:w-16 transition-all duration-300" />
      </div>
    </div>
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
        "group bg-gradient-to-br from-[#F4E7D3] to-[#EDC46A]/30 rounded-2xl border-2 border-dashed border-[#2A9D8F]/40 hover:border-[#2A9D8F] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[280px] hover:shadow-lg transform hover:-translate-y-1",
        isMobile ? "w-full" : "max-w-xs"
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label="View all events"
    >
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-[#2A9D8F] rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
          <span className="text-white text-2xl">→</span>
        </div>
        <h3 className="text-lg font-semibold text-[#005F73] mb-2">View All Events</h3>
        <p className="text-[#005F73]/70 text-sm">Discover more experiences</p>
      </div>
    </div>
  );
};
