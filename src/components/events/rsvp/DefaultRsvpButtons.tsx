
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Star, Loader2 } from 'lucide-react';

export type RsvpStatus = 'Going' | 'Interested' | null;
export type RsvpHandler = (status: 'Going' | 'Interested') => Promise<boolean>;

interface DefaultRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  className?: string;
  activeButton?: 'Going' | 'Interested' | null;
  size?: 'sm' | 'default' | 'lg';
}

export const DefaultRsvpButtons: React.FC<DefaultRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  className,
  activeButton,
  size = 'default'
}) => {
  const isGoing = currentStatus === 'Going';
  const isInterested = currentStatus === 'Interested';
  const goingLoading = isLoading && activeButton === 'Going';
  const interestedLoading = isLoading && activeButton === 'Interested';

  const handleRsvp = async (status: 'Going' | 'Interested', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await onRsvp(status);
  };

  const buttonSizeClass = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <div className={cn("flex gap-2", className)} data-no-navigation="true">
      {/* Going Button */}
      <Button
        variant={isGoing ? "default" : "outline"}
        className={cn(
          buttonSizeClass,
          "flex items-center gap-2 transition-all duration-200",
          isGoing 
            ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
            : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
        )}
        onClick={(e) => handleRsvp('Going', e)}
        disabled={isLoading}
        data-no-navigation="true"
      >
        {goingLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Going
      </Button>

      {/* Interested Button */}
      <Button
        variant={isInterested ? "default" : "outline"}
        className={cn(
          buttonSizeClass,
          "flex items-center gap-2 transition-all duration-200",
          isInterested 
            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
            : "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
        )}
        onClick={(e) => handleRsvp('Interested', e)}
        disabled={isLoading}
        data-no-navigation="true"
      >
        {interestedLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Star className="h-4 w-4" />
        )}
        Interested
      </Button>
    </div>
  );
};
