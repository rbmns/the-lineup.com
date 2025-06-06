
import React from 'react';
import { cn } from '@/lib/utils';

interface EventCardDescriptionProps {
  description: string | null;
  compact?: boolean;
  className?: string;
}

export const EventCardDescription: React.FC<EventCardDescriptionProps> = ({ 
  description, 
  compact = false,
  className 
}) => {
  // Always return null to hide descriptions on event cards
  return null;
};
