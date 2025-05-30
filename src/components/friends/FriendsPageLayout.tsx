
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search friends by name..."
          className="pl-10 bg-white border-gray-200 rounded-lg h-12 text-gray-900 placeholder-gray-500"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto p-1 bg-gray-100 rounded-lg">
          <TabsTrigger 
            value="all-friends" 
            className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
          >
            All Friends
          </TabsTrigger>
          
          <TabsTrigger 
            value="suggestions" 
            className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
          >
            Suggestions
          </TabsTrigger>
          
          <TabsTrigger 
            value="requests" 
            className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 relative"
          >
            Requests
            {requests.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="events" 
            className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
          >
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-friends" className="mt-6">
          <FriendsGrid friends={friends} loading={loading} />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <SuggestedFriendsTabContent
            suggestedFriends={suggestedFriends}
            loading={loading}
            onAddFriend={handleAddFriend}
            onDismiss={handleDismiss}
            currentUserId={currentUserId}
            friendIds={friendIds}
          />
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <RequestsGrid 
            requests={requests} 
            loading={loading}
            onAccept={onAcceptRequest}
            onDecline={onDeclineRequest}
          />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
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
