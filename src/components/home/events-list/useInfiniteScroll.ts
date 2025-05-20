
import { useState, useEffect, useRef } from 'react';

interface InfiniteScrollOptions {
  initialCount: number;
  totalCount: number;
  isLoading: boolean;
}

export const useInfiniteScroll = ({ 
  initialCount, 
  totalCount, 
  isLoading 
}: InfiniteScrollOptions) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Update hasMore state when event counts change
  useEffect(() => {
    setHasMore(visibleCount < totalCount);
  }, [visibleCount, totalCount]);
  
  const loadMore = () => {
    setVisibleCount(prev => prev + initialCount);
  };
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Only set up the observer if there are more items to load
    if (!hasMore || isLoading) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);
  
  return {
    visibleCount,
    setVisibleCount,
    hasMore,
    observerTarget,
    loadMore
  };
};
