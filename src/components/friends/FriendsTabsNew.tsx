
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Bell, Calendar } from 'lucide-react';

interface FriendsTabsNewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  suggestedFriendsCount: number;
  allFriendsContent: React.ReactNode;
  suggestionsContent: React.ReactNode;
  requestsContent: React.ReactNode;
  eventsContent: React.ReactNode;
}

export const FriendsTabsNew = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  suggestedFriendsCount,
  allFriendsContent,
  suggestionsContent,
  requestsContent,
  eventsContent
}: FriendsTabsNewProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all-friends" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          All Friends
        </TabsTrigger>
        
        <TabsTrigger value="suggestions" className="relative flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Suggestions
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
            >
              {suggestedFriendsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="requests" className="relative flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Requests
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {pendingRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Events
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-friends" className="space-y-4">
        {allFriendsContent}
      </TabsContent>

      <TabsContent value="suggestions" className="space-y-4">
        {suggestionsContent}
      </TabsContent>

      <TabsContent value="requests" className="space-y-4">
        {requestsContent}
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        {eventsContent}
      </TabsContent>
    </Tabs>
  );
};
