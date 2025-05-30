
import { NavigateFunction } from 'react-router-dom';

export const navigateToUserProfile = (userId: string, navigate: NavigateFunction) => {
  if (!userId) {
    console.error('Cannot navigate to profile: userId is required');
    return;
  }
  
  console.log(`Navigating to user profile: ${userId}`);
  navigate(`/user/${userId}`);
};

export const navigateToUsernameProfile = (username: string, navigate: NavigateFunction) => {
  if (!username) {
    console.error('Cannot navigate to profile: username is required');
    return;
  }
  
  console.log(`Navigating to username profile: ${username}`);
  navigate(`/profile/${username}`);
};
