
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
        <h2 className="text-h2 font-montserrat text-graphite-grey mb-6">
          About this event
        </h2>
        <div className="prose prose-lg max-w-none text-left">
          <p className="whitespace-pre-line text-left text-body-base leading-7 text-graphite-grey/80 font-lato font-light">
            {event.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Additional Information Section */}
      {event.extra_info && (
        <div className="text-left bg-coastal-haze rounded-xl p-6 border border-mist-grey/30">
          <h3 className="text-h4 font-montserrat text-graphite-grey mb-4">
            Additional Information
          </h3>
          <p className="text-graphite-grey/80 leading-7 whitespace-pre-wrap text-left text-body-base font-lato">
            {event.extra_info}
          </p>
        </div>
      )}
    </div>
  );
};
