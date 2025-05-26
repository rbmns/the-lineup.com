
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface FriendsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  suggestedFriendsCount?: number;
  friendsContent: React.ReactNode;
  discoverContent: React.ReactNode;
  suggestedContent?: React.ReactNode;
}

export const FriendsTabs = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  suggestedFriendsCount = 0,
  friendsContent,
  discoverContent,
  suggestedContent
}: FriendsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="friends" className="relative">
          My Friends
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {pendingRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="suggested" className="relative">
          Suggested
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
            >
              {suggestedFriendsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger value="discover">
          Discover
        </TabsTrigger>
      </TabsList>

      <TabsContent value="friends" className="space-y-4">
        {friendsContent}
      </TabsContent>

      <TabsContent value="suggested" className="space-y-4">
        {suggestedContent || (
          <div className="text-center py-8 text-gray-500">
            Suggested friends feature not available
          </div>
        )}
      </TabsContent>

      <TabsContent value="discover" className="space-y-4">
        {discoverContent}
      </TabsContent>
    </Tabs>
  );
};
