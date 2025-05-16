
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RsvpStatus } from '../EventRsvpButtons';

interface RsvpStatusBadgeProps {
  status: RsvpStatus;
  className?: string;
}

export const RsvpStatusBadge: React.FC<RsvpStatusBadgeProps> = ({ status, className }) => {
  if (!status) return null;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "py-1 px-2 text-xs font-medium transition-all duration-200",
        status === 'Going' 
          ? "bg-green-50 text-green-700 border-green-200" 
          : "bg-blue-50 text-blue-700 border-blue-200",
        className
      )}
    >
      {status}
    </Badge>
  );
};
