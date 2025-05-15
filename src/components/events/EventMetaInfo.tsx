
import React from 'react';
import { Event } from '@/types';

interface EventMetaInfoProps {
  event: Event;
  hideDateAndTime?: boolean;
}

export const EventMetaInfo: React.FC<EventMetaInfoProps> = ({ 
  event,
  hideDateAndTime = true 
}) => {
  // No longer showing tags or date/time information as requested
  return null;
};
