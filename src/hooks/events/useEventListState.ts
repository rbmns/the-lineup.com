
import { useState, useRef } from 'react';
import { Event } from '@/types';

export const useEventListState = () => {
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const initialRenderRef = useRef<boolean>(true);
  const scrollRestoredRef = useRef<boolean>(false);
  const rsvpInProgressRef = useRef<boolean>(false);
  
  return {
    similarEvents,
    setSimilarEvents,
    initialRenderRef,
    scrollRestoredRef,
    rsvpInProgressRef
  };
};
