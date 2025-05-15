
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface EventRsvpButtonsProps {
  currentStatus: 'Going' | 'Interested' | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;  // Added loading prop
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  className,
  size = 'md',
  loading = false
}) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [localStatus, setLocalStatus] = React.useState(currentStatus);
  
  // Update local state when prop changes
  React.useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  const handleRsvp = async (status: 'Going' | 'Interested') => {
    if (!user) return;
    if (isUpdating || loading) return;
    
    try {
      setIsUpdating(true);
      
      // Optimistic update
      const isSameStatus = localStatus === status;
      setLocalStatus(isSameStatus ? null : status);
      
      // Make API call
      const success = await onRsvp(status);
      
      // If API call failed, revert optimistic update
      if (!success) {
        setLocalStatus(currentStatus);
      }
    } catch (error) {
      console.error('RSVP error:', error);
      setLocalStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  // Size-specific properties
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return "text-sm py-1 px-3 h-8 gap-1";
      case 'lg':
        return "text-base py-3 px-5 h-12 gap-2";
      case 'md':
      default:
        return "text-sm py-2 px-4 h-10 gap-1.5";
    }
  };

  const isGoing = localStatus === 'Going';
  const isInterested = localStatus === 'Interested';

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        type="button"
        variant={isGoing ? "default" : "outline"}
        className={cn(
          getSizeClasses(),
          isGoing ? "bg-green-500 hover:bg-green-600 text-white border-green-500" : 
                   "border-gray-300 text-gray-700 hover:bg-gray-50"
        )}
        disabled={isUpdating || loading}
        onClick={(e) => {
          e.stopPropagation();
          handleRsvp('Going');
        }}
      >
        <Check className={cn("h-4 w-4", size === 'lg' ? "h-5 w-5" : "")} />
        Going
      </Button>
      
      <Button
        type="button"
        variant={isInterested ? "default" : "outline"}
        className={cn(
          getSizeClasses(),
          isInterested ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500" : 
                       "border-gray-300 text-gray-700 hover:bg-gray-50"
        )}
        disabled={isUpdating || loading}
        onClick={(e) => {
          e.stopPropagation();
          handleRsvp('Interested');
        }}
      >
        <Star className={cn("h-4 w-4", size === 'lg' ? "h-5 w-5" : "")} />
        Interested
      </Button>
    </div>
  );
};
