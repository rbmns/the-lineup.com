
import React from 'react';
import { Event } from '@/types';
import { Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/profileUtils';

interface SidebarContentProps {
  event: Event;
  attendees: { 
    going: any[];
    interested: any[];
  };
  isAuthenticated: boolean;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  const navigate = useNavigate();
  
  // All attendees combined for display
  const allAttendees = [...(attendees?.going || []), ...(attendees?.interested || [])];
  
  // Get unique attendees for display (in case someone is both going and interested)
  const uniqueAttendees = allAttendees.filter((attendee, index, self) => 
    index === self.findIndex(a => a.id === attendee.id)
  ).slice(0, 5); // Show only the first 5
  
  return (
    <div className="space-y-6">
      {/* Attendees preview */}
      <div className="bg-gray-50 p-5 rounded-lg">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Users className="h-5 w-5" /> 
          <span>Who's going</span>
        </h3>
        
        {isAuthenticated ? (
          <>
            {uniqueAttendees.length > 0 ? (
              <>
                <div className="flex -space-x-2 mb-3">
                  {uniqueAttendees.map((attendee, i) => (
                    <Avatar key={attendee.id || i} className="w-8 h-8 border-2 border-white">
                      <AvatarImage 
                        src={attendee.avatar_url?.[0] || undefined} 
                        alt={attendee.username || 'Attendee'} 
                      />
                      <AvatarFallback className="bg-primary/10 text-xs">
                        {getInitials(attendee.username || 'A')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                
                <p className="text-sm text-gray-600">
                  {event.attendees?.going || 0} going · {event.attendees?.interested || 0} interested
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Be the first to RSVP to this event!</p>
            )}
          </>
        ) : (
          <div className="text-center py-3">
            <p className="text-sm text-gray-600 mb-3">
              Sign up to see who's going
            </p>
            <Button 
              variant="default" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Sign up - it's free
            </Button>
          </div>
        )}
      </div>
      
      {/* Organizer information if available */}
      {(event.creator || event.organiser_name) && (
        <div className="border border-gray-200 rounded-lg p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <User className="h-5 w-5" />
            <span>Organizer</span>
          </h3>
          
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-gray-200">
              <AvatarImage 
                src={event.creator?.avatar_url?.[0] || undefined} 
                alt={event.creator?.username || event.organiser_name || 'Organizer'} 
              />
              <AvatarFallback className="bg-primary/10">
                {getInitials(event.creator?.username || event.organiser_name || 'O')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{event.creator?.username || event.organiser_name}</p>
              {event.creator?.tagline && (
                <p className="text-xs text-gray-500 mt-0.5">{event.creator.tagline}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
