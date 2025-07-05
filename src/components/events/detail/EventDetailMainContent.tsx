import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { EventRsvpSection } from '@/components/events/detail-sections/EventRsvpSection';
import { filterFriendsFromAttendees } from '@/services/friendsService';
import { useAuth } from '@/contexts/AuthContext';
import { useRecurringEvents } from '@/hooks/useRecurringEvents';
import { User, MessageCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatEventDate, formatEventTime } from '@/utils/timezone-utils';
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
  const {
    user
  } = useAuth();
  const {
    recurringEvents,
    isLoading: recurringLoading
  } = useRecurringEvents(event);
  const handleUserClick = (userId: string) => {
    console.log('Navigating to user profile:', userId);
    navigate(`/user/${userId}`);
  };
  const handleRecurringEventClick = (recurringEvent: Event) => {
    navigate(`/events/${recurringEvent.id}`);
  };

  // Filter out past events and sort by date using new timestampz fields
  const upcomingRecurringEvents = recurringEvents.filter(recurringEvent => {
    if (!recurringEvent.start_datetime) return false;
    const eventDate = new Date(recurringEvent.start_datetime);
    const today = new Date();
    return eventDate >= today;
  }).sort((a, b) => {
    if (!a.start_datetime || !b.start_datetime) return 0;
    return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime();
  });
  return <div className="lg:col-span-2 space-y-8">
        {/* RSVP Section - only show if authenticated */}
        {isAuthenticated && <div className={`transition-all duration-300 bg-gradient-to-r from-ocean-teal/5 to-coastal-haze/20 rounded-xl p-6 border border-ocean-teal/20 ${rsvpFeedback ? 'scale-105' : ''} ${rsvpFeedback === 'going' ? 'ring-2 ring-emerald-200 ring-opacity-50' : rsvpFeedback === 'interested' ? 'ring-2 ring-sky-200 ring-opacity-50' : ''}`}>
          <EventRsvpSection isOwner={isOwner} onRsvp={onRsvp} isRsvpLoading={rsvpLoading} currentStatus={event.rsvp_status} />
        </div>}

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
        
        {/* Tags under description */}
        {event.tags && event.tags.length > 0 && <div className="mt-6">
            <h3 className="text-h4 font-montserrat text-graphite-grey mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(event.tags) ? event.tags : typeof event.tags === 'string' ? event.tags.startsWith('[') ? JSON.parse(event.tags) : event.tags.split(',').map(t => t.trim()) : []).filter(Boolean).map((tag, index) => <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>)}
            </div>
          </div>}
      </div>

      {/* Recurring Events Section */}
      {upcomingRecurringEvents.length > 0 && <div className="text-left">
          <h2 className="text-h2 font-montserrat text-graphite-grey mb-6">
            Upcoming {event.title} Events
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Other dates for this recurring event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingRecurringEvents.slice(0, 5).map(recurringEvent => <div key={recurringEvent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleRecurringEventClick(recurringEvent)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {recurringEvent.start_datetime && formatEventDate(recurringEvent.start_datetime, recurringEvent.timezone || 'Europe/Amsterdam')}
                        </div>
                        
                        {recurringEvent.start_datetime && <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-500" />
                            {formatEventTime(recurringEvent.start_datetime, recurringEvent.timezone || 'Europe/Amsterdam')}
                          </div>}
                        
                        {recurringEvent.venues?.city && <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {recurringEvent.venues.city}
                          </div>}
                      </div>
                      
                      {recurringEvent.venues?.name && <div className="text-sm text-gray-500 mt-1">
                          at {recurringEvent.venues.name}
                        </div>}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Event
                    </Button>
                  </div>)}
                
                {upcomingRecurringEvents.length > 5 && <div className="text-center pt-4">
                    <Badge variant="secondary">
                      +{upcomingRecurringEvents.length - 5} more upcoming events
                    </Badge>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>}

          {/* Additional Information Section */}
          {event.extra_info}
    </div>;
};