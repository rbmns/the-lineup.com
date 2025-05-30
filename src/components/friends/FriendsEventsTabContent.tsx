
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const FriendsEventsTabContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Friends' Events</h2>
      </div>
      
      <Card className="p-8 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Events from friends</h3>
        <p className="text-gray-600">
          See what events your friends are attending and discover new experiences together.
        </p>
      </Card>
    </div>
  );
};
