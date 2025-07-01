import React from 'react';
import { useTracking } from '@/services/trackingService';
import { Event } from '@/types';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingLinkTrackerProps {
  event: Event;
  bookingUrl: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BookingLinkTracker: React.FC<BookingLinkTrackerProps> = ({
  event,
  bookingUrl,
  className,
  children,
  variant = "default",
  size = "default"
}) => {
  const { trackBookingLinkClick } = useTracking();

  const handleClick = async (e: React.MouseEvent) => {
    // Track the click
    await trackBookingLinkClick({
      event_id: event.id,
      event_title: event.title,
      booking_url: bookingUrl,
      source_page: window.location.pathname,
    });

    // Let the default link behavior happen (open in new tab)
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      asChild
    >
      <a 
        href={bookingUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        {children || (
          <>
            Book Now
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </a>
    </Button>
  );
};