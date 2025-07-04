
import { CreditCard, ExternalLink } from 'lucide-react';
import { useTracking } from '@/services/trackingService';

interface EventBookingSectionProps {
  fee?: string | number | null;
  bookingLink?: string | null;
  additionalInfo?: string | null;
  eventId?: string;
  eventTitle?: string;
}

export const EventBookingSection = ({ 
  fee, 
  bookingLink,
  additionalInfo,
  eventId,
  eventTitle
}: EventBookingSectionProps) => {
  const { trackBookingLinkClick } = useTracking();
  // Format fee display
  const formatFee = (feeValue: string | number | null | undefined) => {
    if (!feeValue) return 'Free';
    
    // If it's already a string, return as is
    if (typeof feeValue === 'string') {
      return feeValue;
    }
    
    // If it's a number, format as currency
    if (typeof feeValue === 'number') {
      return `EUR ${feeValue.toFixed(2)}`;
    }
    
    return 'Free';
  };

  const handleBookingLinkClick = async () => {
    if (bookingLink && eventId && eventTitle) {
      await trackBookingLinkClick({
        event_id: eventId,
        event_title: eventTitle,
        booking_url: bookingLink,
        source_page: window.location.pathname,
      });
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
      <div>
        <p className="font-medium text-lg mb-2">Booking Info</p>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Fee: </span>
            {formatFee(fee)}
          </p>
          {bookingLink && (
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              <a 
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBookingLinkClick}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Booking Link
              </a>
            </div>
          )}
          {additionalInfo && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
