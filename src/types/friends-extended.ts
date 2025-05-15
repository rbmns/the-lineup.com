
import { UserProfile } from './index';

export interface UserProfileWithFriendship extends UserProfile {
  friendshipId?: string;
  friendshipStatus: 'none' | 'pending' | 'accepted';
}

export interface FriendRequestWithProfile {
  id: string;
  status: string;
  created_at: string;
  user_id: string;
  friend_id: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string[] | null;
    email: string;
  };
}
