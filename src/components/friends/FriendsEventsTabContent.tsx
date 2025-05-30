
import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const FriendsEventsTabContent: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [typeFilter, setTypeFilter] = useState<'all' | 'events' | 'casual-plans'>('all');

  // No mock data - all counts are 0
  const upcomingCount = 0;
  const pastCount = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Friends' Events Tab</h2>
      </div>
      
      {/* Time Filter Pills */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={timeFilter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('upcoming')}
          className="rounded-full"
        >
          Upcoming {upcomingCount > 0 && <Badge variant="secondary" className="ml-2">{upcomingCount}</Badge>}
        </Button>
        <Button
          variant={timeFilter === 'past' ? 'default' : 'outline'}
          onClick={() => setTimeFilter('past')}
          className="rounded-full"
        >
          Past {pastCount > 0 && <Badge variant="secondary" className="ml-2">{pastCount}</Badge>}
        </Button>
      </div>

      {/* Type Filter Pills */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={typeFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setTypeFilter('all')}
          className="rounded-full"
        >
          All
        </Button>
        <Button
          variant={typeFilter === 'events' ? 'default' : 'outline'}
          onClick={() => setTypeFilter('events')}
          className="rounded-full"
        >
          Events
        </Button>
        <Button
          variant={typeFilter === 'casual-plans' ? 'default' : 'outline'}
          onClick={() => setTypeFilter('casual-plans')}
          className="rounded-full"
        >
          Casual Plans
        </Button>
      </div>

      {/* Empty State - No Events */}
      <Card className="p-8 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
        <p className="text-gray-600">
          Events from your friends will appear here when they create them.
        </p>
      </Card>
    </div>
  );
};
