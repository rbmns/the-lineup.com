
import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FriendsCasualPlansTabContent: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');

  // No mock data - all counts are 0
  const upcomingCount = 0;
  const pastCount = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Friends' Casual Plans</h2>
        <span className="text-sm text-gray-500">{upcomingCount} upcoming</span>
      </div>
      
      {/* Time Filter Tabs */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={timeFilter === 'upcoming' ? 'default' : 'ghost'}
          onClick={() => setTimeFilter('upcoming')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Upcoming
          {upcomingCount > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
              {upcomingCount}
            </span>
          )}
        </Button>
        <Button
          variant={timeFilter === 'past' ? 'default' : 'ghost'}
          onClick={() => setTimeFilter('past')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Past
          {pastCount > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
              {pastCount}
            </span>
          )}
        </Button>
      </div>

      {/* Empty State - No Casual Plans */}
      <Card className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming casual plans</h3>
        <p className="text-gray-600 mb-4">
          Your friends haven't created any upcoming casual plans yet
        </p>
        <Button variant="outline">
          Discover Plans
        </Button>
      </Card>
    </div>
  );
};
