
export const isProfileClickable = (friendshipStatus: string, isOwnProfile: boolean): boolean => {
  // Own profile is always clickable
  if (isOwnProfile) return true;
  
  // Friends' profiles are clickable
  if (friendshipStatus === 'accepted') return true;
  
  // Non-friends' profiles are not clickable for privacy
  return false;
};

export const getFriendshipDisplayText = (status: string): string => {
  switch (status) {
    case 'accepted':
      return 'Friends';
    case 'pending':
      return 'Request sent';
    case 'requested':
      return 'Accept request';
    default:
      return 'Add Friend';
  }
};
