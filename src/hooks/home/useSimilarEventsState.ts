
import { useState } from 'react';
import { Event } from '@/types';

export const useSimilarEventsState = () => {
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);

  const resetSimilarEvents = () => {
    setSimilarEvents([]);
  };

  return {
    similarEvents,
    setSimilarEvents,
    resetSimilarEvents
  };
};
