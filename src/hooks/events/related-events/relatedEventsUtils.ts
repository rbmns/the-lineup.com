
import { Event } from '@/types';

export const calculateEventSimilarity = (event1: Event, event2: Event): number => {
  let score = 0;
  
  // Same category gets highest score
  if (event1.event_category && event2.event_category && event1.event_category === event2.event_category) {
    score += 50;
  }
  
  // Same venue gets high score
  if (event1.venue_id && event2.venue_id && event1.venue_id === event2.venue_id) {
    score += 40;
  }
  
  // Similar tags
  if (event1.tags && event2.tags) {
    const commonTags = event1.tags.filter(tag => event2.tags?.includes(tag));
    score += commonTags.length * 10;
  }
  
  // Same creator
  if (event1.created_by && event2.created_by && event1.created_by === event2.created_by) {
    score += 20;
  }
  
  return score;
};

export const getRelatedEvents = (currentEvent: Event, allEvents: Event[], limit: number = 4): Event[] => {
  const eventsWithScores = allEvents
    .filter(event => event.id !== currentEvent.id)
    .map(event => ({
      event,
      score: calculateEventSimilarity(currentEvent, event)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
    
  return eventsWithScores.map(({ event }) => event);
};
