
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FriendsTabsNewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  suggestedFriendsCount: number;
  allFriendsContent: React.ReactNode;
  suggestionsContent: React.ReactNode;
  requestsContent: React.ReactNode;
}

export const FriendsTabsNew = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  suggestedFriendsCount,
  allFriendsContent,
  suggestionsContent,
  requestsContent
}: FriendsTabsNewProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className={`
        w-full 
        ${isMobile 
          ? 'grid grid-cols-3 h-12'
          : 'grid grid-cols-3 h-12'
        }
      `}>
        <TabsTrigger 
          value="all-friends" 
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium
            ${isMobile ? 'flex-col gap-1 text-xs' : ''}
          `}
        >
          <Users className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span>All Friends</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="suggestions" 
          className={`
            relative flex items-center gap-2 px-4 py-2 text-sm font-medium
            ${isMobile ? 'flex-col gap-1 text-xs' : ''}
          `}
        >
          <UserPlus className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span>Suggestions</span>
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-secondary text-white"
            >
              {suggestedFriendsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="requests" 
          className={`
            relative flex items-center gap-2 px-4 py-2 text-sm font-medium
            ${isMobile ? 'flex-col gap-1 text-xs' : ''}
          `}
        >
          <Bell className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span>Requests</span>
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-white"
            >
              {pendingRequestsCount}
            </Badge>
          )}
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
    </Tabs>
  );
};
