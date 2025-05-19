
import { useState } from 'react';

export const useSearchTracking = (userId: string | undefined) => {
  // Track search queries
  const trackSearch = async (term: string) => {
    try {
      await fetch('/api/track-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: term,
          search_user_id: userId || null
        })
      });
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  return { trackSearch };
};
