
import { useFriendStatus } from './useFriendStatus';
import { useFriendData } from './useFriendData';

export const useFriends = (userId: string | undefined) => {
  const { checkFriendshipStatus } = useFriendStatus(userId);
  const { 
    loading,
    friends,
    requests,
    pendingRequests,
    pendingRequestIds,
    refreshFriendsData
  } = useFriendData(userId);

  return {
    loading,
    friends,
    requests,
    pendingRequests,
    pendingRequestIds,
    checkFriendshipStatus,
    refreshFriendsData
  };
};
