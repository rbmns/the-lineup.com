
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchEventAttendees } from '@/lib/eventService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SocialSidebarProps {
  selectedEventId?: string;
  visible?: boolean;
  onToggleVisibility?: () => void;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({ 
  selectedEventId, 
  visible = true,
  onToggleVisibility 
}) => {
  const { user } = useAuth();

  const { data: attendees, isLoading } = useQuery({
    queryKey: ['event-attendees', selectedEventId],
    queryFn: () => fetchEventAttendees(selectedEventId!),
    enabled: !!selectedEventId,
  });

  if (!visible) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="bg-white shadow-lg border border-sand hover:bg-sand rounded-l-lg rounded-r-none px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-16 bottom-0 w-72 bg-white border-l border-sand shadow-lg z-40 overflow-y-auto">
      {/* Toggle button */}
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="bg-white shadow-lg border border-sand hover:bg-sand rounded-l-lg rounded-r-none px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-seafoam-green" />
          <h2 className="text-lg font-semibold text-ocean-deep">Social</h2>
        </div>

        {/* Sign up prompt for non-authenticated users */}
        {!user && (
          <Card className="border-seafoam-green bg-seafoam-green/5">
            <CardContent className="p-4">
              <div className="text-center">
                <UserPlus className="h-8 w-8 text-seafoam-green mx-auto mb-2" />
                <p className="text-sm text-ocean-deep mb-3">Join the community!</p>
                <Button asChild size="sm" className="w-full">
                  <Link to="/login">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedEventId ? (
          <Card className="border-sand">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-seafoam-green" />
                Event Attendees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-sand rounded-full animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-sand rounded animate-pulse" />
                        <div className="h-2 bg-sand rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : attendees && (attendees.going.length > 0 || attendees.interested.length > 0) ? (
                <div className="space-y-4">
                  {attendees.going.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          Going ({attendees.going.length})
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {attendees.going.slice(0, 4).map((attendee: any) => (
                          <div key={attendee.id} className="flex items-center gap-2">
                            <Avatar className="w-7 h-7">
                              <AvatarImage 
                                src={attendee.avatar_url?.[0]} 
                                alt={attendee.username || 'User'} 
                              />
                              <AvatarFallback className="bg-seafoam-green text-white text-xs">
                                {(attendee.username || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ocean-deep truncate">
                                {attendee.username || 'Anonymous'}
                              </p>
                              {attendee.tagline && (
                                <p className="text-xs text-gray-500 truncate">
                                  {attendee.tagline}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {attendees.going.length > 4 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{attendees.going.length - 4} more going
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {attendees.interested.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          Interested ({attendees.interested.length})
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {attendees.interested.slice(0, 3).map((attendee: any) => (
                          <div key={attendee.id} className="flex items-center gap-2">
                            <Avatar className="w-7 h-7">
                              <AvatarImage 
                                src={attendee.avatar_url?.[0]} 
                                alt={attendee.username || 'User'} 
                              />
                              <AvatarFallback className="bg-sky-blue text-white text-xs">
                                {(attendee.username || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ocean-deep truncate">
                                {attendee.username || 'Anonymous'}
                              </p>
                              {attendee.tagline && (
                                <p className="text-xs text-gray-500 truncate">
                                  {attendee.tagline}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {attendees.interested.length > 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            +{attendees.interested.length - 3} more interested
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Users className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No attendees yet</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to RSVP!</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-sand">
            <CardContent className="pt-5">
              <div className="text-center py-4">
                <Calendar className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Select an event</p>
                <p className="text-xs text-gray-400 mt-1">to see who's attending</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community section placeholder */}
        <Card className="border-sand">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-seafoam-green" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-3">
              <p className="text-sm text-gray-500">Coming soon...</p>
              <p className="text-xs text-gray-400 mt-1">Connect with locals</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
