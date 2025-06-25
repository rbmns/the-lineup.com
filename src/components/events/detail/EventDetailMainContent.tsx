
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';

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

  const handleUserClick = (userId: string) => {
    // Use /user/{id} route instead of /profile/{id}
    navigate(`/user/${userId}`);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* RSVP Section - only show if authenticated */}
      {isAuthenticated && (
        <div className={`transition-all duration-300 ${rsvpFeedback ? 'scale-105' : ''} ${rsvpFeedback === 'going' ? 'ring-2 ring-green-200' : rsvpFeedback === 'interested' ? 'ring-2 ring-blue-200' : ''}`}>
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
        <h2 className="text-xl font-semibold mb-4 text-left">About this event</h2>
        <div className="prose prose-sm max-w-none text-left">
          <p className="whitespace-pre-line text-left">{event.description || ''}</p>
        </div>
      </div>

      {/* Additional Info */}
      {event.extra_info && (
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-4 text-left">Additional Information</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-left">
            {event.extra_info}
          </p>
        </div>
      )}

      {/* Attendees - only show if authenticated */}
      {isAuthenticated && attendees && (attendees.going.length > 0 || attendees.interested.length > 0) && (
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-4 text-left">Friends Attending</h2>
          <div className="space-y-4">
            {attendees.going.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 text-left">
                  Going: {attendees.going.length}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attendees.going.map(attendee => (
                    <button
                      key={attendee.id}
                      onClick={() => handleUserClick(attendee.id)}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                        {attendee.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {attendees.interested.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 text-left">
                  Interested: {attendees.interested.length}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attendees.interested.map(attendee => (
                    <button
                      key={attendee.id}
                      onClick={() => handleUserClick(attendee.id)}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                        {attendee.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{attendee.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hosted by */}
      {(event.organiser_name || event.organizer_link) && (
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-4 text-left">Hosted by</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {event.organiser_name ? event.organiser_name.charAt(0).toUpperCase() : 'O'}
              </span>
            </div>
            <div>
              {event.organiser_name && (
                <p className="font-medium text-left">{event.organiser_name}</p>
              )}
              {event.organizer_link && (
                <a
                  href={event.organizer_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Visit organizer website
                </a>
              )}
              {!event.organiser_name && !event.organizer_link && (
                <p className="text-sm text-gray-600 text-left">Event Organizer</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
