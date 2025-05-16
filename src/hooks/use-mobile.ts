
import { useEffect, useState } from 'react';

/**
 * Hook to determine if the current viewport is mobile-sized
 * @param breakpoint The width threshold for mobile detection (default: 768px)
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', checkSize);
    checkSize();

    return () => window.removeEventListener('resize', checkSize);
  }, [breakpoint]);

  return isMobile;
}
