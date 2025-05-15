
import { UserProfile } from './index';

export type FriendRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  user_id: string;
  friend_id?: string;
  sender_id?: string;
  receiver_id?: string;
  profile: UserProfile;
  sender_profile?: UserProfile;
};

export type FriendsData = {
  friends: UserProfile[];
  requests: FriendRequest[];
  suggestions: UserProfile[];
  allProfiles: UserProfile[];
};
