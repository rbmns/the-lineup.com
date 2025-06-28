
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { MasterEventCard } from '@/components/ui/MasterEventCard';
import { useAuth } from '@/contexts/AuthContext';

interface HomeEventsPreviewProps {
  events: Event[] | undefined;
  isLoading: boolean;
}

export const HomeEventsPreview: React.FC<HomeEventsPreviewProps> = ({
  events,
  isLoading
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const displayEvents = events?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-midnight mb-4">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ivory border border-overcast rounded-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-overcast/20"></div>
                <div className="p-4">
                  <div className="h-4 bg-overcast/20 rounded mb-3"></div>
                  <div className="h-3 bg-overcast/20 rounded mb-2"></div>
                  <div className="h-3 bg-overcast/20 rounded mb-3"></div>
                  <div className="h-6 bg-overcast/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-midnight mb-4">Upcoming Events</h2>
          <p className="text-lg text-overcast max-w-2xl mx-auto font-body">
            Join others in experiences that match your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayEvents.map((event) => (
            <MasterEventCard
              key={event.id}
              event={event}
              showRsvpButtons={false} // Home page cards don't show RSVP buttons
              onClick={() => navigate(`/events/${event.id}`)}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/events')}
            size="lg"
            variant="outline"
            className="border-2 border-overcast/20 text-midnight hover:bg-coconut px-8 font-body"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};
