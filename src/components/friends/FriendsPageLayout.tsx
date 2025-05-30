
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FriendsGrid } from './FriendsGrid';
import { SuggestedFriendsTabContent } from './SuggestedFriendsTabContent';
import { RequestsGrid } from './RequestsGrid';
import { FriendsEventsTabContent } from './FriendsEventsTabContent';

interface FriendsPageLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  friends: any[];
  requests: any[];
  suggestedFriends: any[];
  loading: boolean;
  onAcceptRequest: (requestId: string) => Promise<boolean>;
  onDeclineRequest: (requestId: string) => Promise<boolean>;
  currentUserId?: string;
  friendIds: string[];
}

export const FriendsPageLayout = ({
  activeTab,
  setActiveTab,
  searchQuery,
  onSearchChange,
  friends,
  requests,
  suggestedFriends,
  loading,
  onAcceptRequest,
  onDeclineRequest,
  currentUserId,
  friendIds
}: FriendsPageLayoutProps) => {
  const handleAddFriend = async (friendId: string) => {
    // TODO: Implement add friend functionality
    console.log('Add friend:', friendId);
  };

  const handleDismiss = (friendId: string) => {
    // TODO: Implement dismiss functionality
    console.log('Dismiss suggestion:', friendId);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search friends by name..."
          className="pl-9 bg-white border-gray-200 focus-visible:ring-blue-500 text-gray-900"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 p-1">
          <TabsTrigger 
            value="all-friends" 
            className="relative data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            All Friends
            {friends.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-gray-500 text-white text-xs">
                {friends.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="suggestions" 
            className="relative data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Suggestions
            {suggestedFriends.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-500 text-white text-xs">
                {suggestedFriends.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="requests" 
            className="relative data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Requests
            {requests.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {requests.length}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="events" 
            className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
          >
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-friends" className="space-y-6 mt-6">
          <FriendsGrid friends={friends} loading={loading} />
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6 mt-6">
          <SuggestedFriendsTabContent
            suggestedFriends={suggestedFriends}
            loading={loading}
            onAddFriend={handleAddFriend}
            onDismiss={handleDismiss}
            currentUserId={currentUserId}
            friendIds={friendIds}
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-6 mt-6">
          <RequestsGrid 
            requests={requests} 
            loading={loading}
            onAccept={onAcceptRequest}
            onDecline={onDeclineRequest}
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-6 mt-6">
          <FriendsEventsTabContent
            friendIds={friendIds}
            currentUserId={currentUserId}
            friends={friends}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
