
import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const FriendsEventsTabContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
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
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')} className="w-full">
        {/* Time Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              Upcoming
              {upcomingCount > 0 && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  {upcomingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              Past
              {pastCount > 0 && (
                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                  {pastCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Type Filter Pills */}
          <div className="flex gap-3">
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
        </div>

        <TabsContent value="upcoming">
          {/* Empty State - No Upcoming Events */}
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-600">
              Events from your friends will appear here when they create them.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="past">
          {/* Empty State - No Past Events */}
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
            <p className="text-gray-600">
              Past events from your friends will appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
