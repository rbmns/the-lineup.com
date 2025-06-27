
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Share2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventPublishedModalProps {
  open: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
}

export const EventPublishedModal: React.FC<EventPublishedModalProps> = ({
  open,
  onClose,
  eventId,
  eventTitle
}) => {
  const navigate = useNavigate();

  const handleViewEvent = () => {
    if (eventId) {
      navigate(`/events/${eventId}`);
    }
    onClose();
  };

  const handleViewAllEvents = () => {
    navigate('/events');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-xl font-semibold text-primary">
            Your event is now live! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-neutral leading-relaxed">
            <strong>{eventTitle}</strong> is now published and ready for people to discover and RSVP.
          </p>
          
          <p className="text-sm text-neutral">
            You're now an organizer on The Lineup. You can create more events anytime!
          </p>

          <div className="space-y-3 pt-4">
            {eventId && (
              <Button 
                onClick={handleViewEvent}
                className="w-full"
                variant="default"
              >
                <Eye className="h-4 w-4 mr-2" />
                View My Event
              </Button>
            )}
            
            <Button 
              onClick={handleViewAllEvents}
              variant="outline"
              className="w-full"
            >
              Browse All Events
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
