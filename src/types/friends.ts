
import { UserProfile } from './index';

export type FriendRequest = {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  user_id: string;
  profile: UserProfile;
};

export type FriendsData = {
  friends: UserProfile[];
  requests: FriendRequest[];
  suggestions: UserProfile[];
  allProfiles: UserProfile[];
};
