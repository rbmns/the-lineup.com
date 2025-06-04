
import { NavigateFunction } from 'react-router-dom';

export const navigateToUserProfile = (userId: string, navigate: NavigateFunction) => {
  navigate(`/user/${userId}`);
};
