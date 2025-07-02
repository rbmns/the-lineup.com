import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRsvpedEvents } from '@/components/profile/UserRsvpedEvents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserEvents } from '@/hooks/useUserEvents';
import { Calendar, Clock } from 'lucide-react';

const MyEvents: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { upcomingEvents, pastEvents, isLoading: eventsLoading } = useUserEvents(user?.id);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Events</h1>
          <p className="text-neutral">View and manage your event RSVPs</p>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Past ({pastEvents.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            <UserRsvpedEvents 
              userId={user.id} 
              events={upcomingEvents}
              isLoading={eventsLoading}
              emptyMessage="No upcoming events. Browse events to find something interesting!"
              title=""
            />
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            <UserRsvpedEvents 
              userId={user.id} 
              events={pastEvents}
              isLoading={eventsLoading}
              emptyMessage="No past events yet. Start attending events to build your history!"
              title=""
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyEvents;