
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      const checkIsMobile = () => {
        const mobileCheck = window.innerWidth < 768;
        setIsMobile(mobileCheck);
      };

      // Set initial state
      checkIsMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIsMobile);

      // Cleanup
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    }
  }, []);

  return isMobile;
};
