
import React, { useState } from 'react';
import { Calendar, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RsvpButtonGroup } from './rsvp/RsvpButtonGroup';
import { useNavigate } from 'react-router-dom';

interface GuestRsvpTeaserProps {
  eventId: string;
  eventTitle: string;
}

export const GuestRsvpTeaser: React.FC<GuestRsvpTeaserProps> = ({ 
  eventId,
  eventTitle 
}) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'Going' | 'Interested' | null>(null);
  
  // Mock RSVP handler that will open the signup dialog
  const handleGuestRsvp = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    setSelectedAction(status);
    setIsDialogOpen(true);
    return true;
  };
  
  // Navigate to signup page
  const handleSignUpClick = () => {
    navigate('/login', { state: { initialMode: 'register' } });
  };
  
  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        <h3 className="font-medium mb-3">RSVP to this event</h3>
        
        <RsvpButtonGroup
          onRsvp={handleGuestRsvp}
          size="lg"
          variant="default"
          className="mb-3"
        />
        
        <p className="text-sm text-gray-600 mt-2">
          Sign up to save events to your calendar and see which friends are attending.
        </p>
      </div>
      
      {/* Signup Dialog shown after guest tries to RSVP */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create an account</DialogTitle>
            <DialogDescription>
              Sign up to {selectedAction?.toLowerCase()} to "{eventTitle}" and more!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <p className="text-sm">Save events to your calendar</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <p className="text-sm">See which friends are attending</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Maybe later
            </Button>
            <Button onClick={handleSignUpClick}>
              Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
