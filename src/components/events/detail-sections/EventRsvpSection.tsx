
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { Loader2 } from 'lucide-react';

interface EventRsvpSectionProps {
  isOwner: boolean;
  onRsvp?: (status: 'Going' | 'Interested') => Promise<boolean>;
  isRsvpLoading: boolean;
  currentStatus?: 'Going' | 'Interested' | null;
}

export const EventRsvpSection = ({
  isOwner,
  onRsvp,
  isRsvpLoading,
  currentStatus
}: EventRsvpSectionProps) => {

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="space-y-4">
        {onRsvp && !isOwner && (
          <>
            <h3 className="font-medium">Are you going?</h3>
            <div className="rsvp-buttons-container">
              {isRsvpLoading ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <EventRsvpButtons 
                  currentStatus={currentStatus}
                  onRsvp={onRsvp}
                  isLoading={isRsvpLoading}
                  size="lg"
                  className="w-full"
                />
              )}
            </div>
          </>
        )}
        
        {isOwner && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">You created this event</p>
          </div>
        )}
      </div>
    </div>
  );
};
