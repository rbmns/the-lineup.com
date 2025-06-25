
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, BarChart3, Edit, Trash2 } from 'lucide-react';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading, refetch } = useUserCreatedEvents();

  const upcomingEvents = events.filter(event => new Date(event.start_date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.start_date) < new Date());

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('creator', user?.id);

      if (error) throw error;

      toast.success('Event deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Dashboard</h1>
        <p className="text-gray-600">Manage your events and track their performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently active events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              All time events created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Completed events
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link to="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/profile?tab=created">
                <Calendar className="mr-2 h-4 w-4" />
                View All Events
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events created yet</p>
                <p className="text-sm">Create your first event to get started!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{event.title}</h3>
                        <Badge variant={new Date(event.start_date) >= new Date() ? "default" : "secondary"}>
                          {new Date(event.start_date) >= new Date() ? "Upcoming" : "Past"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatEventCardDateTime(event.start_date, event.start_time, event.end_date)}
                      </p>
                      {event.venues?.name && (
                        <p className="text-sm text-gray-500">{event.venues.name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/events/${event.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {events.length > 5 && (
                  <div className="text-center pt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/profile?tab=created">
                        View All {events.length} Events
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {events.length > 0 && (
        <Alert className="mt-6">
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            You've created {events.length} event{events.length !== 1 ? 's' : ''} so far. 
            {upcomingEvents.length > 0 && ` You have ${upcomingEvents.length} upcoming event${upcomingEvents.length !== 1 ? 's' : ''}.`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
