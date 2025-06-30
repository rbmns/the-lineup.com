
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { useVenues } from '@/hooks/useVenues';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, BarChart3, Edit, Eye } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { format, isAfter, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: events = [], isLoading: eventsLoading } = useUserCreatedEvents();
  const { venues, isLoading: venuesLoading } = useVenues();

  // Filter venues created by current user
  const userVenues = venues.filter(venue => venue.creator_id === user?.id);

  // Separate upcoming and past events
  const now = startOfDay(new Date());
  const upcomingEvents = events.filter(event => isAfter(new Date(event.start_date), now));
  const pastEvents = events.filter(event => !isAfter(new Date(event.start_date), now));

  // Sort events by date (upcoming: earliest first, past: latest first)
  const sortedUpcomingEvents = upcomingEvents.sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  const sortedPastEvents = pastEvents.sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  if (!user) {
    navigate('/login');
    return null;
  }

  if (eventsLoading || venuesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F73] mx-auto mb-4"></div>
          <p className="text-[#005F73]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Dashboard"
        subtitle="Manage your events and venues"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
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
                  Events created
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Venues</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userVenues.length}</div>
                <p className="text-xs text-muted-foreground">
                  Venues created
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Events Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Events</CardTitle>
                  <Button asChild size="sm">
                    <Link to="/events/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.length > 0 ? (
                  <>
                    {/* Upcoming Events */}
                    {sortedUpcomingEvents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Upcoming Events</h4>
                        {sortedUpcomingEvents.map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{event.title}</h5>
                              <p className="text-xs text-gray-600">
                                {format(new Date(event.start_date), 'MMM dd, yyyy')}
                              </p>
                              {event.venues?.name && (
                                <p className="text-xs text-gray-500">{event.venues.name}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {(event.going_count || 0) + (event.interested_count || 0)}
                              </Badge>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/events/${event.slug || event.id}`}>
                                    <Eye className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <Link to={`/events/${event.slug || event.id}/edit`}>
                                    <Edit className="h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Past Events */}
                    {sortedPastEvents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Past Events</h4>
                        {sortedPastEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{event.title}</h5>
                              <p className="text-xs text-gray-600">
                                {format(new Date(event.start_date), 'MMM dd, yyyy')}
                              </p>
                              {event.venues?.name && (
                                <p className="text-xs text-gray-500">{event.venues.name}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {(event.going_count || 0) + (event.interested_count || 0)}
                              </Badge>
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/events/${event.slug || event.id}`}>
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                        {sortedPastEvents.length > 3 && (
                          <p className="text-xs text-gray-500 text-center mt-2">
                            +{sortedPastEvents.length - 3} more past events
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No events created yet</p>
                    <p className="text-sm">Create your first event to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Venues Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Venues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userVenues.length > 0 ? (
                  userVenues.map((venue) => (
                    <div key={venue.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{venue.name}</h5>
                        <p className="text-xs text-gray-600">
                          {[venue.street, venue.city, venue.postal_code].filter(Boolean).join(', ') || 'Address not provided'}
                        </p>
                        {venue.website && (
                          <a 
                            href={venue.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Visit website
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {venue.google_maps && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={venue.google_maps} target="_blank" rel="noopener noreferrer">
                              <MapPin className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No venues created yet</p>
                    <p className="text-sm">Create venues when adding events!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Organizer Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Organizer Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium">{profile?.username || user.email?.split('@')[0]}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {profile?.location && (
                    <p className="text-sm text-gray-500">📍 {profile.location}</p>
                  )}
                </div>
                <Button variant="outline" asChild>
                  <Link to="/profile/edit">
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
