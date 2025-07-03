
import { User, ExternalLink } from 'lucide-react';
import { useTracking } from '@/services/trackingService';

interface EventOrganizerSectionProps {
  organizerName: string;
  organizerLink?: string | null;
  eventId?: string;
  eventTitle?: string;
}

export const EventOrganizerSection = ({ 
  organizerName, 
  organizerLink,
  eventId,
  eventTitle
}: EventOrganizerSectionProps) => {
  const { trackBookingLinkClick } = useTracking();

  const handleOrganizerLinkClick = async () => {
    if (organizerLink && eventId && eventTitle) {
      await trackBookingLinkClick({
        event_id: eventId,
        event_title: eventTitle,
        booking_url: organizerLink,
        source_page: window.location.pathname,
      });
    }
  };
  return (
    <div className="flex items-start space-x-2">
      <User className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg">
          Event Organiser: {organizerLink ? (
            <a 
              href={organizerLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOrganizerLinkClick}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {organizerName}
            </a>
          ) : (
            organizerName
          )}
        </p>
      </div>
    </div>
  );
};
