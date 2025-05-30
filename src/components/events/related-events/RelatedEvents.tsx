
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

  // Use our custom hook to fetch related events with improved relevance scoring
  const { relatedEvents, loading } = useFetchRelatedEvents({
    eventType,
    currentEventId: eventId,
    tags: eventTags,
    vibe: vibe ? String(vibe) : undefined,
    minResults: 4, // Increased minimum results for better selection
    startDate,
    userId: user?.id,
    dateDifference: 21 // Show events within 21 days of the current event
  });

  // Generate a section title based on event type and result count
  const getSectionTitle = () => {
    if (!relatedEvents || relatedEvents.length === 0) {
      return "Related Events";
    }
    
    // If all events are the same type, use a type-based headline
    const allSameType = relatedEvents.every(event => event.event_category === eventType);
    
    if (allSameType && eventType) {
      return `More ${eventType} events around the same time`;
    }
    
    // If events have mixed types, use a more general headline
    return "Events you might be interested in";
  };

  // Only render when the section becomes visible
  if (!isVisible) {
    return <div id="related-events-section" className="w-full"></div>;
  }

  return (
    <div id="related-events-section" className="w-full">
      <h2 className="text-2xl font-bold mb-6">{getSectionTitle()}</h2>
      
      {loading ? (
        <RelatedEventsLoader />
      ) : (
        <RelatedEventsGrid 
          events={relatedEvents || []} 
          referenceEventType={eventType}
        />
      )}
    </div>
  );
};

export default RelatedEvents;
