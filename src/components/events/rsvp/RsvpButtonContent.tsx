
import React from 'react';
import { Check, Star, Loader2 } from 'lucide-react';

interface RsvpButtonContentProps {
  status: 'Going' | 'Interested';
  isLoading: boolean;
}

export const RsvpButtonContent: React.FC<RsvpButtonContentProps> = ({
  status,
  isLoading
}) => {
  if (isLoading) {
    return (
      <span className="flex items-center gap-1.5">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="font-medium">{status}</span>
      </span>
    );
  }
  
  if (status === 'Going') {
    return (
      <span className="flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5" />
        <span className="font-medium">Going</span>
      </span>
    );
  } else {
    return (
      <span className="flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5" />
        <span className="font-medium">Interested</span>
      </span>
    );
  }
};
