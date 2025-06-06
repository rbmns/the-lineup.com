
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useEventAttendees } from '@/hooks/event-rsvp/useEventAttendees';
import { useSuggestedFriends } from '@/hooks/useSuggestedFriends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';
import { EventAttendeesList } from '@/components/events/EventAttendeesList';
import { useEffect, useState } from 'react';

interface SocialSidebarProps {
  selectedEventId?: string | null;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({ selectedEventId }) => {
  const { isAuthenticated, user } = useAuth();
  const { data: selectedEvent } = useEventDetails(selectedEventId);
  const { getAttendeesForEvent } = useEventAttendees();
  const { suggestedFriends, loading: suggestedLoading } = useSuggestedFriends(user?.id);
  const [eventAttendees, setEventAttendees] = useState<{ going: any[], interested: any[] }>({ going: [], interested: [] });

  // Fetch attendees when event is selected
  useEffect(() => {
    if (selectedEventId && isAuthenticated) {
      getAttendeesForEvent(selectedEventId).then(attendees => {
        setEventAttendees(attendees);
      });
    } else {
      setEventAttendees({ going: [], interested: [] });
    }
  }, [selectedEventId, isAuthenticated, getAttendeesForEvent]);

  return (
    <div className="hidden xl:block w-80 bg-gray-50 border-l overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="font-semibold">Social</h2>
        </div>

        {isAuthenticated ? (
          <>
            {/* Event-specific attendees (only show when event is selected) */}
            {selectedEventId && selectedEvent && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Event Attendees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{eventAttendees.going.length}</div>
                      <div className="text-gray-600">Going</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{eventAttendees.interested.length}</div>
                      <div className="text-gray-600">Interested</div>
                    </div>
                  </div>
                  
                  {/* Show attendees list */}
                  <EventAttendeesList 
                    going={eventAttendees.going}
                    interested={eventAttendees.interested}
                  />
                </CardContent>
              </Card>
            )}

            {/* Suggested Friends */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Suggested Friends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedLoading ? (
                  <div className="text-sm text-gray-600">Loading suggestions...</div>
                ) : suggestedFriends.length > 0 ? (
                  <div className="space-y-2">
                    {suggestedFriends.slice(0, 3).map((friend) => (
                      <div key={friend.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {friend.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{friend.username}</p>
                          <p className="text-xs text-gray-500 truncate">{friend.connectionReason}</p>
                        </div>
                      </div>
                    ))}
                    {suggestedFriends.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{suggestedFriends.length - 3} more suggestions
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    No friend suggestions available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Friends' Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Friends' Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  See what events your friends are attending
                </div>
                <div className="text-xs text-gray-500">
                  Coming soon...
                </div>
              </CardContent>
            </Card>

            {/* Friends' Casual Plans */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Casual Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  Friends' upcoming casual plans
                </div>
                <div className="text-xs text-gray-500">
                  Coming soon...
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Sign Up Teaser */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-blue-900">
                  Join the Community
                </h3>
                <p className="text-sm text-blue-700">
                  Sign up to see who's attending events, connect with friends, and get personalized recommendations.
                </p>
                <Button size="sm" className="w-full">
                  Sign Up Free
                </Button>
              </CardContent>
            </Card>

            {/* Preview Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">See event attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UserPlus className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Get friend suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Friends' event activity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
