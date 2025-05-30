
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, X, Calendar } from 'lucide-react';

interface EventBasedSuggestionsProps {
  onAddFriend?: (friendId: string) => void;
  onDismiss?: (friendId: string) => void;
}

export const EventBasedSuggestions: React.FC<EventBasedSuggestionsProps> = ({
  onAddFriend,
  onDismiss
}) => {
  // No dummy data - component will be empty until real data is provided
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-center mb-2">Friend Suggestions Based on Events</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">People You May Know</h3>
          <p className="text-sm text-gray-600">Based on events you've attended</p>
        </div>
      </div>
      
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No event-based suggestions yet</h3>
        <p className="text-gray-600">
          Attend some events to find people you may know!
        </p>
      </div>
    </Card>
  );
};
