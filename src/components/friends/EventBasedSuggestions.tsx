
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, X, UserPlus } from 'lucide-react';
import { useEventBasedSuggestions } from '@/hooks/useEventBasedSuggestions';

interface EventBasedSuggestionsProps {
  currentUserId?: string;
  friendIds: string[];
  onAddFriend: (friendId: string) => Promise<void>;
  onDismiss: (friendId: string) => void;
}

export const EventBasedSuggestions: React.FC<EventBasedSuggestionsProps> = ({
  currentUserId,
  friendIds,
  onAddFriend,
  onDismiss
}) => {
  const { suggestions, isLoading } = useEventBasedSuggestions(currentUserId, friendIds);

  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = (avatarUrl: string[] | null) => {
    if (avatarUrl && Array.isArray(avatarUrl) && avatarUrl.length > 0) {
      return avatarUrl[0];
    }
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  if (isLoading || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Friend Suggestions Based on Events</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">People You May Know</h3>
            <p className="text-sm text-gray-600 mb-4">Based on events you've attended</p>
            
            <div className="space-y-4">
              {suggestions.slice(0, 4).map((suggestion) => (
                <Card key={suggestion.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={getAvatarUrl(suggestion.avatar_url) || undefined} />
                        <AvatarFallback>{getInitials(suggestion.username)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {suggestion.username || 'Unknown User'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {suggestion.mutual_event_count} mutual event{suggestion.mutual_event_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => onAddFriend(suggestion.id)}
                              className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDismiss(suggestion.id)}
                              className="p-2 h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {suggestion.mutual_events.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              You both attended {suggestion.mutual_events[0].title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatDate(suggestion.mutual_events[0].start_date)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {suggestions.length > 4 && (
              <div className="text-center mt-6">
                <Button variant="outline" className="text-gray-700 border-gray-300">
                  See all suggestions
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
