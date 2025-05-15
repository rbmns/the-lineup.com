
import React, { useEffect, useState } from 'react';
import { RelatedEventsGrid } from './RelatedEventsGrid';
import { RelatedEventsLoader } from './RelatedEventsLoader';
import { useFetchRelatedEvents } from '@/hooks/events/related-events';
import { useAuth } from '@/contexts/AuthContext';

interface RelatedEventsProps {
  eventId: string;
  eventType: string;
  startDate: string;
  tags?: string[] | string | null;
  vibe?: string | null;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ 
  eventId, 
  eventType, 
  startDate,
  tags,
  vibe
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    // Get the element to observe
    const elementToObserve = document.getElementById('related-events-section');
    if (elementToObserve) {
      observer.observe(elementToObserve);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Function to parse tags into array format
  const parseTags = (tagInput: string[] | string | null): string[] => {
    if (!tagInput) return [];
    if (Array.isArray(tagInput)) return tagInput.filter(Boolean);
    if (typeof tagInput === 'string') {
      return tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    return [];
  };

  // Get the event tags as an array
  const eventTags = parseTags(tags);

  // Use our custom hook to fetch related events
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId: eventId,
    tags: eventTags,
    vibe: vibe ? String(vibe) : undefined,
    minResults: 2, // Ensure we get at least 2 events
    startDate,
    userId: user?.id
  });

  // Always render the loader or results section since we want to show it even if empty
  return (
    <div id="related-events-section" className="w-full">
      <h2 className="text-2xl font-bold mb-6">Similar Events</h2>
      
      {loading ? (
        <RelatedEventsLoader />
      ) : (
        <RelatedEventsGrid events={relatedEvents || []} />
      )}
    </div>
  );
};

export default RelatedEvents;
