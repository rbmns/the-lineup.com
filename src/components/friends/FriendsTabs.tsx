
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface FriendsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  friendsContent: React.ReactNode;
  discoverContent: React.ReactNode;
  pendingRequestsCount?: number;
}

export const FriendsTabs: React.FC<FriendsTabsProps> = ({
  activeTab,
  setActiveTab,
  friendsContent,
  discoverContent,
  pendingRequestsCount = 0
}) => {
  const [requestCount, setRequestCount] = useState<number>(0);
  
  // Update request count whenever pendingRequestsCount changes
  useEffect(() => {
    setRequestCount(pendingRequestsCount);
  }, [pendingRequestsCount]);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="friends" className="relative">
          My Friends
          {requestCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-purple text-white text-xs h-5 min-w-[20px] flex items-center justify-center px-1.5 rounded-full"
            >
              {requestCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="discover">Discover People</TabsTrigger>
      </TabsList>
      
      <TabsContent value="friends">
        {friendsContent}
      </TabsContent>
      
      <TabsContent value="discover">
        {discoverContent}
      </TabsContent>
    </Tabs>
  );
};
