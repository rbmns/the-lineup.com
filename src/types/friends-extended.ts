
import { UserProfile } from './index';

export interface UserProfileWithFriendship extends UserProfile {
  friendshipId?: string;
  friendshipStatus: 'none' | 'pending' | 'accepted';
}
