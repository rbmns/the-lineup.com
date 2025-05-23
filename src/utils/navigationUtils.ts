
import { NavigateFunction } from 'react-router-dom';

/**
 * Navigate to a user's profile page
 */
export const navigateToUserProfile = (userId: string, navigate: NavigateFunction) => {
  if (!userId) return;
  
  // Navigate to user profile page
  navigate(`/user/${userId}`);
};
