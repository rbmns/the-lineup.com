
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, X, Calendar, MapPin } from 'lucide-react';
import { useEventBasedSuggestions } from '@/hooks/useEventBasedSuggestions';

interface EventBasedSuggestionsProps {
  currentUserId?: string;
  friendIds: string[];
  onAddFriend?: (friendId: string) => void;
  onDismiss?: (friendId: string) => void;
}

export const EventBasedSuggestions: React.FC<EventBasedSuggestionsProps> = ({
  currentUserId,
  friendIds,
  onAddFriend,
  onDismiss
}) => {
  const { suggestions, isLoading } = useEventBasedSuggestions(currentUserId, friendIds);

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl?: string[]) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-2">Friend Suggestions Based on Events</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center mb-2">Friend Suggestions Based on Events</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">People You May Know</h3>
          <p className="text-sm text-gray-600">Based on events you've attended</p>
        </div>
      </div>
      
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={getAvatarUrl(suggestion.avatar_url) || undefined} />
                    <AvatarFallback>{getInitials(suggestion.username || 'U')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {suggestion.username || 'Unknown User'}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.mutual_event_count} mutual event{suggestion.mutual_event_count !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {suggestion.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{suggestion.location}</span>
                      </div>
                    )}
                    
                    {suggestion.tagline && (
                      <p className="text-sm text-gray-600 truncate mb-2">{suggestion.tagline}</p>
                    )}
                    
                    {/* Show recent mutual events */}
                    <div className="space-y-1">
                      {suggestion.mutual_events.slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">
                            {event.title} {formatDate(event.start_date) && `• ${formatDate(event.start_date)}`}
                          </span>
                        </div>
                      ))}
                      {suggestion.mutual_events.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{suggestion.mutual_events.length - 2} more event{suggestion.mutual_events.length - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => onAddFriend?.(suggestion.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDismiss?.(suggestion.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No event-based suggestions yet</h3>
          <p className="text-gray-600">
            Attend some events to find people you may know!
          </p>
        </div>
      )}
    </Card>
  );
};
