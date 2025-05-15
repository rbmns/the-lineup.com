
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { toast } from 'sonner';

interface EventRsvpButtonsProps {
  currentStatus?: 'Going' | 'Interested';
  onRsvp: (status: 'Going' | 'Interested') => void;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | string;
}

export const EventRsvpButtons: React.FC<EventRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  loading = false,
  className = '',
  size = 'default'
}) => {
  // Use local state to provide immediate UI feedback
  const [activeStatus, setActiveStatus] = useState<'Going' | 'Interested' | undefined>(currentStatus);
  
  // Update local state when prop changes
  useEffect(() => {
    setActiveStatus(currentStatus);
  }, [currentStatus]);

  // Size styles mapping
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1 px-2 h-7 gap-1'; 
      case 'lg':
        return 'text-base py-2.5 px-5 h-12 gap-2';
      default:
        return 'text-sm py-1.5 px-3 h-9 gap-1.5';
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  // Button style handler with enhanced visual design
  const getButtonStyles = (status: 'Going' | 'Interested') => {
    if (status === 'Going') {
      // Green styling for Going - active vs inactive states
      return activeStatus === 'Going'
        ? "bg-green-500 hover:bg-green-600 text-white font-medium transform hover:scale-[1.02] active:scale-95 transition-all duration-200"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium hover:scale-[1.02] active:scale-95 transition-all duration-200";
    } else {
      // Blue styling for Interested - active vs inactive states
      return activeStatus === 'Interested'
        ? "bg-blue-500 hover:bg-blue-600 text-white font-medium transform hover:scale-[1.02] active:scale-95 transition-all duration-200"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium hover:scale-[1.02] active:scale-95 transition-all duration-200";
    }
  };
  
  // Handle button click with enhanced visual feedback and proper event prevention
  const handleButtonClick = (e: React.MouseEvent, status: 'Going' | 'Interested') => {
    // Always prevent default and stop propagation to avoid page reloads
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) {
      toast("Please wait, processing your previous request");
      return;
    }
    
    // Apply optimistic UI update
    setActiveStatus(activeStatus === status ? undefined : status);
    
    // Add button press animation - faster and smoother
    const button = e.currentTarget as HTMLElement;
    if (button) {
      button.classList.add('button-click-animation');
      setTimeout(() => button.classList.remove('button-click-animation'), 100);
      
      // Add visual feedback for the card container
      const container = button.closest('[data-event-id]');
      if (container) {
        if (status === 'Going') {
          container.classList.add('rsvp-going-animation');
          setTimeout(() => container.classList.remove('rsvp-going-animation'), 300);
        } else {
          container.classList.add('rsvp-interested-animation');
          setTimeout(() => container.classList.remove('rsvp-interested-animation'), 300);
        }
      }
    }
    
    // Call the onRsvp handler
    onRsvp(status);
  };

  return (
    <div className={`flex gap-2 ${className}`} data-rsvp-button="container">
      <Button
        type="button"
        className={`flex items-center justify-center rounded-md ${sizeClasses} ${getButtonStyles('Going')}`}
        onClick={(e) => handleButtonClick(e, 'Going')}
        disabled={loading}
        variant="custom"
        data-rsvp-button="going"
        data-rsvp-active={activeStatus === 'Going' ? "true" : "false"}
      >
        <Check className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        <span>Going</span>
      </Button>
      <Button
        type="button"
        className={`flex items-center justify-center rounded-md ${sizeClasses} ${getButtonStyles('Interested')}`}
        onClick={(e) => handleButtonClick(e, 'Interested')}
        disabled={loading}
        variant="custom"
        data-rsvp-button="interested"
        data-rsvp-active={activeStatus === 'Interested' ? "true" : "false"}
      >
        <Star className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        <span>Interested</span>
      </Button>
    </div>
  );
};
