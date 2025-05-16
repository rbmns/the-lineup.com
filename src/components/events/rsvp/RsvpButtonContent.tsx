
import React from 'react';
import { Check, Star, Loader2 } from 'lucide-react';

interface RsvpButtonContentProps {
  status: 'Going' | 'Interested';
  isActive: boolean;
  isLoading: boolean;
  localLoading: 'Going' | 'Interested' | null;
  variant?: 'default' | 'compact' | 'minimal';
}

export const RsvpButtonContent: React.FC<RsvpButtonContentProps> = ({
  status,
  isActive,
  isLoading,
  localLoading,
  variant = 'default'
}) => {
  // Use isLoading to determine if this specific button type should show a loader
  const isButtonActuallyLoading = isLoading && (isActive || localLoading === status);
  
  if (isButtonActuallyLoading) {
    return (
      <span className="flex items-center gap-1.5">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {variant !== 'minimal' && <span className="font-medium">{status}</span>}
      </span>
    );
  }
  
  if (status === 'Going') {
    return (
      <span className="flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        {variant !== 'minimal' && <span className="font-medium">Going</span>}
      </span>
    );
  } else {
    return (
      <span className="flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5" />
        {variant !== 'minimal' && <span className="font-medium">Interested</span>}
      </span>
    );
  }
};
