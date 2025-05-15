
import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types';
import { FriendCard } from './FriendCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFriends } from '@/hooks/useFriends';

interface FriendSearchProps {
  searchQuery: string;
  searchResults: UserProfile[];
  onAddFriend: (id: string) => void;
  loading: boolean;
  pendingRequestIds: string[];
}

export const FriendSearch: React.FC<FriendSearchProps> = ({
  searchQuery,
  searchResults,
  onAddFriend,
  loading,
  pendingRequestIds
}) => {
  const { user } = useAuth();
  const { friends, checkFriendshipStatus } = useFriends(user?.id);
  
  // Get list of friend IDs to filter search results
  const friendIds = friends?.map(friend => friend.id) || [];
  
  // We now show all users, even if they're friends, but with different button states
  const renderLoginPrompt = () => {
    if (!user) {
      return (
        <Card className="mb-6 border-gray-200 bg-gray-50/50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <h3 className="font-medium text-lg mb-2">Connect with friends</h3>
            <p className="text-gray-600 mb-4">Log in to find and connect with friends in your area</p>
            <Link to="/login" className="bg-black hover:bg-black/90 text-white py-2 px-4 rounded inline-flex items-center">
              <LogIn className="w-4 h-4 mr-2" />
              Log in to continue
            </Link>
          </CardContent>
        </Card>
      );
    }
    return null;
  };
  
  // Function to determine friendship status for a profile
  const getFriendshipStatus = async (profileId: string) => {
    if (friendIds.includes(profileId)) {
      return 'accepted';
    }
    
    if (pendingRequestIds.includes(profileId)) {
      return 'pending';
    }
    
    // Check for incoming requests via API
    const status = await checkFriendshipStatus(profileId);
    return status;
  };
  
  return (
    <div>
      {renderLoginPrompt()}
      
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple" />
          <p className="text-gray-500">Searching...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-white to-gray-50">
              <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                <Search className="w-4 h-4 mr-2 text-purple" />
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {searchQuery.trim().length < 2 ? (
                <p className="text-gray-500 text-center py-4">Search for friends by username, location or status</p>
              ) : searchResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users match your search.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((profile) => (
                    <div key={profile.id} className="flex flex-col transform transition-transform hover:scale-[1.01]">
                      <FriendCard 
                        profile={profile} 
                        friendshipStatus={friendIds.includes(profile.id) ? 'accepted' : 
                                         pendingRequestIds.includes(profile.id) ? 'pending' : 'none'}
                        showStatus={false}
                        pendingRequestIds={pendingRequestIds}
                        onAddFriend={onAddFriend}
                        linkToProfile={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
