
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
import { filterFriendsFromAttendees } from '@/services/friendsService';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, User, Calendar, MapPin, Tag } from 'lucide-react';

interface EventDetailMainContentProps {
  event: Event;
  attendees?: { going: any[]; interested: any[] };
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
  const [friendAttendees, setFriendAttendees] = useState<{ going: any[]; interested: any[] }>({
    going: [],
    interested: []
  });

  // Filter attendees to only show friends
  useEffect(() => {
    const filterAttendees = async () => {
      if (!attendees || !user?.id || !isAuthenticated) {
        setFriendAttendees({ going: [], interested: [] });
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
        setFriendAttendees({ going: [], interested: [] });
      }
    };

    filterAttendees();
  }, [attendees, user?.id, isAuthenticated]);

  const handleUserClick = (userId: string) => {
    console.log('Navigating to user profile:', userId);
    navigate(`/user/${userId}`);
  };

  return (
    <div className="lg:col-span-2 space-y-10">
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

      {/* Event Details Overview */}
      <div className="bg-gradient-to-r from-sage/5 to-clay/5 rounded-2xl p-8 border border-sage/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date & Time */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-sage/20 rounded-full">
              <Calendar className="h-6 w-6 text-sage" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-midnight mb-1">When</h3>
              <p className="font-mono text-sm text-overcast leading-relaxed">
                {event.start_date && new Date(event.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {event.start_time && (
                  <>
                    <br />
                    {event.start_time} {event.end_time && `- ${event.end_time}`}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-clay/20 rounded-full">
              <MapPin className="h-6 w-6 text-clay" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-midnight mb-1">Where</h3>
              <p className="font-mono text-sm text-overcast leading-relaxed">
                {event.venues?.name && (
                  <>
                    <span className="font-medium">{event.venues.name}</span>
                    <br />
                  </>
                )}
                {event.venues?.street && `${event.venues.street}, `}
                {event.venues?.city && event.venues.city}
                {event.venues?.postal_code && ` ${event.venues.postal_code}`}
                {!event.venues?.name && event.location && event.location}
                {!event.venues && !event.location && 'Location TBD'}
              </p>
            </div>
          </div>

          {/* Category & Vibe */}
          {(event.event_category || event.vibe) && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-seafoam/20 rounded-full">
                <Tag className="h-6 w-6 text-seafoam" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-midnight mb-1">Category</h3>
                <div className="space-y-1">
                  {event.event_category && (
                    <span className="inline-block px-3 py-1 bg-sage/20 text-sage text-sm font-mono rounded-full">
                      {event.event_category}
                    </span>
                  )}
                  {event.vibe && (
                    <span className="inline-block px-3 py-1 bg-clay/20 text-clay text-sm font-mono rounded-full ml-2">
                      {event.vibe}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          {(event.fee !== null && event.fee !== undefined) && (
            <div className="flex items-start gap-4">
              <div className="p-3 bg-coral/20 rounded-full">
                <span className="text-lg font-bold text-coral">€</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-midnight mb-1">Price</h3>
                <p className="font-mono text-sm text-overcast">
                  {event.fee === 0 ? 'Free' : `€${event.fee}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About this event */}
      <div className="text-left">
        <h2 className="text-3xl font-bold mb-6 text-left tracking-tight text-midnight">About this event</h2>
        <div className="prose prose-lg max-w-none text-left">
          <p className="whitespace-pre-line text-left text-lg leading-8 text-overcast font-light">{event.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Additional Information */}
      {event.extra_info && (
        <div className="text-left bg-ivory/50 rounded-2xl p-8 border border-sage/10">
          <h2 className="text-2xl font-semibold mb-4 text-left tracking-tight text-midnight">Additional Information</h2>
          <p className="text-overcast leading-8 whitespace-pre-wrap text-left text-base font-light">
            {event.extra_info}
          </p>
        </div>
      )}

      {/* Enhanced Host/Organizer Section */}
      <div className="text-left bg-gradient-to-r from-sage/10 to-clay/10 rounded-2xl p-8 border border-sage/20">
        <h2 className="text-3xl font-bold mb-6 text-left tracking-tight text-midnight flex items-center">
          <User className="h-8 w-8 mr-3 text-sage" />
          Hosted by
        </h2>
        
        <div className="space-y-6">
          {/* Main organizer info */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-sage to-clay rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-coconut">
                {event.organiser_name ? event.organiser_name.charAt(0).toUpperCase() : 
                 event.creator?.username ? event.creator.username.charAt(0).toUpperCase() : 'H'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-midnight mb-2">
                {event.organiser_name || event.creator?.username || 'Event Host'}
              </h3>
              {event.creator?.email && (
                <p className="font-mono text-sm text-overcast mb-2">
                  Contact: {event.creator.email}
                </p>
              )}
            </div>
          </div>

          {/* Additional organizer details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.organizer_link && (
              <div className="bg-coconut/50 rounded-xl p-4">
                <h4 className="font-semibold text-midnight mb-2 flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Organizer Website
                </h4>
                <a
                  href={event.organizer_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-clay hover:text-midnight hover:underline transition-colors font-mono break-all"
                >
                  {event.organizer_link}
                </a>
              </div>
            )}

            {event.booking_link && (
              <div className="bg-coconut/50 rounded-xl p-4">
                <h4 className="font-semibold text-midnight mb-2 flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Booking Link
                </h4>
                <a
                  href={event.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-clay hover:text-midnight hover:underline transition-colors font-mono break-all"
                >
                  Book Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Friends Attending - only show if authenticated and there are friend attendees */}
      {isAuthenticated && (friendAttendees.going.length > 0 || friendAttendees.interested.length > 0) && (
        <div className="text-left bg-gradient-to-r from-sage/10 to-clay/10 rounded-2xl p-8 border border-sage/20">
          <h2 className="text-3xl font-bold mb-8 text-left tracking-tight text-midnight flex items-center">
            <span className="bg-gradient-to-r from-midnight to-overcast bg-clip-text text-transparent">
              Friends Attending
            </span>
          </h2>
          <div className="space-y-8">
            {friendAttendees.going.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-midnight mb-4 text-left flex items-center">
                  <div className="w-4 h-4 bg-sage rounded-full mr-3"></div>
                  Going ({friendAttendees.going.length})
                </h3>
                <div className="flex flex-wrap gap-4">
                  {friendAttendees.going.map(attendee => (
                    <button
                      key={attendee.id}
                      onClick={() => handleUserClick(attendee.id)}
                      className="flex items-center gap-3 bg-ivory/80 backdrop-blur-sm rounded-full px-5 py-4 hover:bg-coconut hover:shadow-lg transition-all duration-200 cursor-pointer border border-overcast/20"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-sage to-clay rounded-full flex items-center justify-center text-midnight text-sm font-bold">
                        {attendee.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-base font-medium text-midnight">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {friendAttendees.interested.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-midnight mb-4 text-left flex items-center">
                  <div className="w-4 h-4 bg-clay rounded-full mr-3"></div>
                  Interested ({friendAttendees.interested.length})
                </h3>
                <div className="flex flex-wrap gap-4">
                  {friendAttendees.interested.map(attendee => (
                    <button
                      key={attendee.id}
                      onClick={() => handleUserClick(attendee.id)}
                      className="flex items-center gap-3 bg-ivory/80 backdrop-blur-sm rounded-full px-5 py-4 hover:bg-coconut hover:shadow-lg transition-all duration-200 cursor-pointer border border-overcast/20"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-clay to-seafoam rounded-full flex items-center justify-center text-midnight text-sm font-bold">
                        {attendee.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-base font-medium text-midnight">{attendee.username}</span>
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
