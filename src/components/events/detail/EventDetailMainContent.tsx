
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
import { filterFriendsFromAttendees } from '@/services/friendsService';
import { useAuth } from '@/contexts/AuthContext';
import { User, MessageCircle } from 'lucide-react';

interface EventDetailMainContentProps {
  event: Event;
  attendees?: {
    going: any[];
    interested: any[];
  };
  isAuthenticated: boolean;
  isOwner: boolean;
  rsvpLoading: boolean;
  rsvpFeedback: 'going' | 'interested' | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
}

export const EventDetailMainContent: React.FC<EventDetailMainContentProps> = ({
  event,
  attendees,
  isAuthenticated,
  isOwner,
  rsvpLoading,
  rsvpFeedback,
  onRsvp
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [friendAttendees, setFriendAttendees] = useState<{
    going: any[];
    interested: any[];
  }>({
    going: [],
    interested: []
  });

  // Filter attendees to only show friends
  useEffect(() => {
    const filterAttendees = async () => {
      if (!attendees || !user?.id || !isAuthenticated) {
        setFriendAttendees({
          going: [],
          interested: []
        });
        return;
      }
      try {
        const [friendsGoing, friendsInterested] = await Promise.all([
          filterFriendsFromAttendees(attendees.going || [], user.id),
          filterFriendsFromAttendees(attendees.interested || [], user.id)
        ]);
        setFriendAttendees({
          going: friendsGoing,
          interested: friendsInterested
        });
      } catch (error) {
        console.error('Error filtering friend attendees:', error);
        setFriendAttendees({
          going: [],
          interested: []
        });
      }
    };
    filterAttendees();
  }, [attendees, user?.id, isAuthenticated]);

  const handleUserClick = (userId: string) => {
    console.log('Navigating to user profile:', userId);
    navigate(`/user/${userId}`);
  };

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* RSVP Section - only show if authenticated */}
      {isAuthenticated && (
        <div className={`transition-all duration-300 ${rsvpFeedback ? 'scale-105' : ''} ${rsvpFeedback === 'going' ? 'ring-2 ring-emerald-200 ring-opacity-50' : rsvpFeedback === 'interested' ? 'ring-2 ring-sky-200 ring-opacity-50' : ''}`}>
          <EventRsvpSection 
            isOwner={isOwner} 
            onRsvp={onRsvp} 
            isRsvpLoading={rsvpLoading} 
            currentStatus={event.rsvp_status} 
          />
        </div>
      )}

      {/* About this event */}
      <div className="text-left">
        <h2 className="text-2xl font-bold mb-4 text-left tracking-tight text-midnight font-montserrat">
          About this event
        </h2>
        <div className="prose prose-lg max-w-none text-left">
          <p className="whitespace-pre-line text-left text-base leading-7 text-overcast font-lato font-light">
            {event.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Additional Information Section */}
      {event.extra_info && (
        <div className="text-left bg-ivory/50 rounded-xl p-6 border border-sage/10">
          <h3 className="text-lg font-semibold mb-4 text-left tracking-tight text-midnight font-montserrat">
            Additional Information
          </h3>
          <p className="text-overcast leading-7 whitespace-pre-wrap text-left text-sm font-lato font-light">
            {event.extra_info}
          </p>
        </div>
      )}

      {/* Friends Attending - only show if authenticated and there are friend attendees */}
      {isAuthenticated && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
        <div className="text-left bg-gradient-to-r from-sage/10 to-clay/10 rounded-xl p-6 border border-sage/20">
          <h3 className="text-lg font-semibold mb-4 text-left tracking-tight text-midnight font-montserrat flex items-center">
            <span className="bg-gradient-to-r from-midnight to-overcast bg-clip-text text-transparent">
              Friends Attending
            </span>
          </h3>
          <div className="space-y-6">
            {friendAttendees.going.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-midnight mb-3 text-left flex items-center font-lato">
                  <div className="w-3 h-3 bg-sage rounded-full mr-2"></div>
                  Going ({friendAttendees.going.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {friendAttendees.going.map(attendee => (
                    <button 
                      key={attendee.id} 
                      onClick={() => handleUserClick(attendee.id)} 
                      className="flex items-center gap-2 bg-ivory/80 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-coconut hover:shadow-md transition-all duration-200 cursor-pointer border border-overcast/20"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-sage to-clay rounded-full flex items-center justify-center text-midnight text-xs font-bold font-montserrat">
                        {attendee.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-midnight font-lato">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {friendAttendees.interested.length > 0 && (
              <div>
                <h4 className="text-base font-medium text-midnight mb-3 text-left flex items-center font-lato">
                  <div className="w-3 h-3 bg-clay rounded-full mr-2"></div>
                  Interested ({friendAttendees.interested.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {friendAttendees.interested.map(attendee => (
                    <button 
                      key={attendee.id} 
                      onClick={() => handleUserClick(attendee.id)} 
                      className="flex items-center gap-2 bg-ivory/80 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-coconut hover:shadow-md transition-all duration-200 cursor-pointer border border-overcast/20"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-clay to-seafoam rounded-full flex items-center justify-center text-midnight text-xs font-bold font-montserrat">
                        {attendee.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-midnight font-lato">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
