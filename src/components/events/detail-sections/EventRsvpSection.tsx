
import { Button } from '@/components/ui/button';
import { EventRsvpButtons } from '@/components/events/EventRsvpButtons';
import { Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Event",
        text: "Check out this event",
        url: window.location.href
      }).catch(error => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now paste it anywhere you want."
    });
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="space-y-4">
        {onRsvp && !isOwner && (
          <>
            <h3 className="font-medium">Are you going?</h3>
            <EventRsvpButtons 
              currentStatus={currentStatus}
              onRsvp={onRsvp}
              isLoading={isRsvpLoading}
              size="lg"
              className="w-full"
            />
          </>
        )}
        
        {isOwner && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">You created this event</p>
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            variant="outline"
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share this event
          </Button>
        </div>
      </div>
    </div>
  );
};
