
import { CreditCard, ExternalLink } from 'lucide-react';

interface EventBookingSectionProps {
  fee?: string | number | null;
  bookingLink?: string | null;
}

export const EventBookingSection = ({ 
  fee, 
  bookingLink 
}: EventBookingSectionProps) => {
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
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Booking Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
