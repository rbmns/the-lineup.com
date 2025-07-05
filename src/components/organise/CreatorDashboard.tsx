
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState("overview");

  const events = userEvents || [];
  const activeEvents = events.filter(event => new Date(event.start_datetime) > new Date());
  const totalAttendees = 0; // We'll implement proper attendee counting later

  const StatsCards = () => (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {/* Active Events Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-graphite-grey">Active Events</CardTitle>
          <div className="p-2 bg-ocean-teal/10 rounded-lg">
            <Calendar className="h-4 w-4 text-ocean-teal" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1 text-ocean-teal">
            {isAuthenticated ? (isLoading ? '...' : activeEvents.length) : '-'}
          </div>
          <p className="text-xs text-graphite-grey/70">
            {isAuthenticated ? 'Currently active events' : 'Sign in to view your events'}
          </p>
        </CardContent>
      </Card>
      
      {/* Total Attendees Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-graphite-grey">Total Attendees</CardTitle>
          <div className="p-2 bg-horizon-blue/10 rounded-lg">
            <Users className="h-4 w-4 text-horizon-blue" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1 text-horizon-blue">
            {isAuthenticated ? (isLoading ? '...' : totalAttendees) : '-'}
          </div>
          <p className="text-xs text-graphite-grey/70">
            {isAuthenticated ? 'Across all your events' : 'Sign in to view stats'}
          </p>
        </CardContent>
      </Card>
      
      {/* Events Created Card */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-graphite-grey">Total Events</CardTitle>
          <div className="p-2 bg-dusk-coral/10 rounded-lg">
            <BarChart3 className="h-4 w-4 text-dusk-coral" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1 text-dusk-coral">
            {isAuthenticated ? (isLoading ? '...' : events.length) : '-'}
          </div>
          <p className="text-xs text-graphite-grey/70">
            {isAuthenticated ? 'Events you have created' : 'Sign in to view history'}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const AllEventsTab = () => (
    <div className="space-y-4">
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
          <Button asChild size="sm">
            <Link to="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:bg-coastal-haze/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <h4 className="font-medium text-graphite-grey truncate mb-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-graphite-grey/70">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-horizon-blue" />
                        <span>{format(new Date(event.start_datetime), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      {event.destination && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-dusk-coral" />
                          <span className="truncate max-w-32">{event.destination}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/events/${event.id}/edit`}>
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <StatsCards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all-events">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quick Actions Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-ocean-teal font-montserrat">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild size="sm" className="w-full justify-start">
                  <Link to="/events/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Event
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-start">
                  <Link to="/events">
                    <Eye className="mr-2 h-4 w-4" />
                    Browse All Events
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Events Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-ocean-teal font-montserrat">Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!isAuthenticated ? (
                  <div className="text-center text-graphite-grey/60 py-8 px-6">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-mist-grey" />
                    <p className="text-sm font-medium mb-1">Sign in to view your events</p>
                    <p className="text-xs">Track and manage all your created events</p>
                  </div>
                ) : isLoading ? (
                  <div className="text-center text-graphite-grey/60 py-8 px-6">
                    <div className="animate-pulse">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-mist-grey" />
                      <p className="text-sm">Loading your events...</p>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center text-graphite-grey/60 py-8 px-6">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-mist-grey" />
                    <p className="text-sm font-medium mb-2">No events yet</p>
                    <p className="text-xs mb-3">Create your first event to get started!</p>
                    <Button asChild size="sm">
                      <Link to="/events/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-0 max-h-64 overflow-y-auto">
                    {events.slice(0, 3).map((event, index) => (
                      <div 
                        key={event.id} 
                        className={cn(
                          "flex items-center justify-between p-4 hover:bg-coastal-haze/30 transition-colors group",
                          index !== events.slice(0, 3).length - 1 && "border-b border-mist-grey"
                        )}
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <h4 className="font-medium text-graphite-grey truncate group-hover:text-ocean-teal transition-colors text-sm">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-graphite-grey/70">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-horizon-blue" />
                              <span>{format(new Date(event.start_datetime), 'MMM d')}</span>
                            </div>
                            {event.destination && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-dusk-coral" />
                                <span className="truncate max-w-24">{event.destination}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/events/${event.id}/edit`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all-events">
          <AllEventsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
