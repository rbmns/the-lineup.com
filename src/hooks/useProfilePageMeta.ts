
import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';

export const useProfilePageMeta = (
  username: string | undefined, 
  user: any,
  profileUsername: string | undefined
) => {
  useCanonical(username ? `/profile/${username}` : '/profile', profileUsername);
  
  useEffect(() => {
    if (username) {
      document.title = `@${username} | Events`;
    } else if (user) {
      document.title = 'My Profile | Events';
    }
  }, [username, user, profileUsername]);
};
