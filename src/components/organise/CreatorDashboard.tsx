
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, BarChart3, Edit, MapPin, Clock, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const CreatorDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { data: userEvents, isLoading, error } = useUserCreatedEvents();
  const isMobile = useIsMobile();

  const events = userEvents || [];
  const activeEvents = events.filter(event => new Date(event.start_datetime) > new Date());
  const totalAttendees = 0; // We'll implement proper attendee counting later

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Active Events Card */}
        <Card className="bg-gradient-to-br from-ocean-teal to-horizon-blue text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Active Events</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {isAuthenticated ? (isLoading ? '...' : activeEvents.length) : '-'}
            </div>
            <p className="text-xs text-white/80">
              {isAuthenticated ? 'Currently active events' : 'Sign in to view your events'}
            </p>
          </CardContent>
        </Card>
        
        {/* Total Attendees Card */}
        <Card className="bg-gradient-to-br from-seafoam-drift to-dusk-coral text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Attendees</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {isAuthenticated ? (isLoading ? '...' : totalAttendees) : '-'}
            </div>
            <p className="text-xs text-white/80">
              {isAuthenticated ? 'Across all your events' : 'Sign in to view stats'}
            </p>
          </CardContent>
        </Card>
        
        {/* Events Created Card */}
        <Card className="bg-gradient-to-br from-sunrise-ochre to-sunset-orange text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Events</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {isAuthenticated ? (isLoading ? '...' : events.length) : '-'}
            </div>
            <p className="text-xs text-white/80">
              {isAuthenticated ? 'Events you have created' : 'Sign in to view history'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions Card */}
        <Card className="lg:col-span-1 border-mist-grey shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-coastal-haze to-mist-grey/50 rounded-t-lg">
            <CardTitle className="text-ocean-teal font-montserrat">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button asChild className="w-full justify-start bg-ocean-teal hover:bg-horizon-blue text-white shadow-md">
              <Link to="/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start border-ocean-teal text-ocean-teal hover:bg-coastal-haze">
              <Link to="/events">
                <Eye className="mr-2 h-4 w-4" />
                Browse All Events
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Your Events Card */}
        <Card className="lg:col-span-2 border-mist-grey shadow-md">
          <CardHeader className="bg-gradient-to-r from-coastal-haze to-mist-grey/50 rounded-t-lg">
            <CardTitle className="text-ocean-teal font-montserrat">Your Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!isAuthenticated ? (
              <div className="text-center text-graphite-grey/60 py-12 px-6">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-mist-grey" />
                <p className="text-lg font-medium mb-2">Sign in to view your events</p>
                <p className="text-sm">Track and manage all your created events</p>
              </div>
            ) : isLoading ? (
              <div className="text-center text-graphite-grey/60 py-12 px-6">
                <div className="animate-pulse">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-mist-grey" />
                  <p className="text-lg">Loading your events...</p>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center text-graphite-grey/60 py-12 px-6">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-mist-grey" />
                <p className="text-lg font-medium mb-2">No events yet</p>
                <p className="text-sm mb-4">Create your first event to get started!</p>
                <Button asChild className="bg-ocean-teal hover:bg-horizon-blue text-white">
                  <Link to="/events/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-0 max-h-80 overflow-y-auto">
                {events.slice(0, 4).map((event, index) => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "flex items-center justify-between p-4 hover:bg-coastal-haze/30 transition-colors group",
                      index !== events.length - 1 && index !== 3 && "border-b border-mist-grey"
                    )}
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="font-medium text-graphite-grey truncate group-hover:text-ocean-teal transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-graphite-grey/70">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-horizon-blue" />
                          <span>{format(new Date(event.start_datetime), 'MMM d, yyyy')}</span>
                        </div>
                        {event.destination && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-dusk-coral" />
                            <span className="truncate max-w-32">{event.destination}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white">
                      <Link to={`/events/${event.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
                {events.length > 4 && (
                  <div className="p-4 bg-coastal-haze/20">
                    <Button asChild variant="outline" className="w-full border-ocean-teal text-ocean-teal hover:bg-ocean-teal hover:text-white" size="sm">
                      <Link to="/profile?tab=created">
                        View All Events ({events.length})
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
