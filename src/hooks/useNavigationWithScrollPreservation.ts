
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollPosition } from './useScrollPosition';

/**
 * Hook that provides navigation functions with built-in scroll preservation
 */
export const useNavigationWithScrollPreservation = () => {
  const navigate = useNavigate();
  const { savePosition, restorePosition } = useScrollPosition();
  const pendingNavigationRef = useRef<string | null>(null);
  
  /**
   * Navigate to a new path while preserving scroll position
   */
  const navigateWithScrollPreservation = useCallback((path: string, options?: { replace?: boolean, state?: any }) => {
    // Save current scroll position
    const position = savePosition();
    
    // Remember where we're navigating to
    pendingNavigationRef.current = path;
    
    // Navigate with state indicating this came from preserved scroll navigation
    navigate(path, {
      ...options,
      state: {
        ...(options?.state || {}),
        preserveScroll: true,
        scrollPosition: position,
        scrollNavigationTimestamp: Date.now()
      }
    });
    
    // Log for debugging
    console.log(`Navigating with scroll preservation to: ${path}, saved position: ${position}px`);
  }, [navigate, savePosition]);
  
  /**
   * Execute an async action and restore scroll position afterward
   */
  const withScrollPreservation = useCallback(async <T>(action: () => Promise<T>): Promise<T> => {
    // Save position before action
    const position = savePosition();
    
    try {
      // Execute the action
      const result = await action();
      
      // Restore position after action completes
      setTimeout(() => {
        restorePosition(position);
      }, 50);
      
      return result;
    } catch (error) {
      // Still restore position on error
      setTimeout(() => {
        restorePosition(position);
      }, 50);
      throw error;
    }
  }, [savePosition, restorePosition]);
  
  return {
    navigateWithScrollPreservation,
    withScrollPreservation,
  };
};
