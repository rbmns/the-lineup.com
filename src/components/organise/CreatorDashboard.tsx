
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, BarChart3, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { format } from 'date-fns';

export const CreatorDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { data: userEvents, isLoading, error } = useUserCreatedEvents();

  console.log('🔍 Dashboard Debug:', {
    isAuthenticated,
    userId: user?.id,
    userEvents,
    isLoading,
    error
  });

  const events = userEvents || [];
  const activeEvents = events.filter(event => new Date(event.start_datetime) > new Date());
  const totalAttendees = 0; // We'll implement proper attendee counting later

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Dashboard</h1>
        <p className="text-gray-600">Create and manage your events</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAuthenticated ? (isLoading ? '...' : activeEvents.length) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated ? 'Currently active events' : 'Sign in to view your events'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAuthenticated ? (isLoading ? '...' : totalAttendees) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated ? 'Across all your events' : 'Sign in to view stats'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Created</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAuthenticated ? (isLoading ? '...' : events.length) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAuthenticated ? 'Total events created' : 'Sign in to view history'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sign in to view your events</p>
              </div>
            ) : isLoading ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Loading your events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events yet</p>
                <p className="text-sm">Create your first event to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.start_datetime), 'MMM d, yyyy - HH:mm')}
                      </p>
                      <p className="text-xs text-gray-400">{event.destination}</p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/events/${event.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {events.length > 5 && (
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <Link to="/profile?tab=created">
                      View All Events ({events.length})
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
