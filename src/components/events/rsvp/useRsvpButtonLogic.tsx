
import { useState, useEffect } from 'react';
import { RsvpStatus } from '../EventRsvpButtons';

interface UseRsvpButtonLogicProps {
  currentStatus?: RsvpStatus | null;
  onRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  isLoading?: boolean;
}

export const useRsvpButtonLogic = ({
  currentStatus = null,
  onRsvp,
  isLoading = false
}: UseRsvpButtonLogicProps) => {
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);
  const [localLoading, setLocalLoading] = useState<'Going' | 'Interested' | null>(null);

  // Update localStatus whenever currentStatus prop changes
  useEffect(() => {
    console.log(`EventRsvpButtons: currentStatus changed to ${currentStatus} from ${localStatus}`);
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  const isGoing = localStatus === 'Going';
  const isInterested = localStatus === 'Interested';

  const combinedIsLoading = (buttonType: 'Going' | 'Interested') => 
    isLoading || localLoading === buttonType;

  // Handle RSVP with optimistic UI updates
  const handleRsvpClick = async (status: 'Going' | 'Interested') => {
    // Disable if parent says it's loading, or if local action is in progress
    if (isLoading || localLoading || false) return;
    
    setLocalLoading(status);
    const prevLocalStatus = localStatus; // Store previous status for potential revert
    
    // Calculate new status - if same as current, set null (toggle off), otherwise use new status
    const newOptimisticStatus = localStatus === status ? null : status;
    
    // Important: Ensure we NEVER have two statuses active at once - always clear previous status first
    setLocalStatus(newOptimisticStatus);
      
    // Apply button click feedback animation and immediate color change
    const button = document.getElementById(`rsvp-${status.toLowerCase()}`);
    if (button) {
      button.classList.add('button-click-animation');
      
      // Update button appearance based on new status
      if (newOptimisticStatus === status) {
        // Active state
        button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
        button.classList.remove('bg-gray-100', 'text-gray-700');
        
        // If we're activating this button, ensure the other button is deactivated
        const otherStatus = status === 'Going' ? 'interested' : 'going';
        const otherButton = document.getElementById(`rsvp-${otherStatus}`);
        if (otherButton) {
          otherButton.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
          otherButton.classList.add('bg-gray-100', 'text-gray-700');
        }
      } else {
        // Inactive state
        button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
        button.classList.add('bg-gray-100', 'text-gray-700');
      }
      
      setTimeout(() => button.classList.remove('button-click-animation'), 100); // Faster animation
    }
      
    // Visual feedback on event card
    const eventCard = button?.closest('[data-event-id]');
    if (eventCard) {
      const animationClass = status === 'Going' ? 'rsvp-going-animation' : 'rsvp-interested-animation';
      eventCard.classList.add(animationClass);
      setTimeout(() => eventCard.classList.remove(animationClass), 200); // Faster animation
    }
      
    try {
      const success = await onRsvp(status);
      if (!success) {
        // Revert optimistic update if the actual call failed
        setLocalStatus(prevLocalStatus);
        
        // Revert button appearance
        if (button) {
          if (prevLocalStatus === status) { // If it was active and failed to deactivate
            button.classList.add(status === 'Going' ? 'bg-green-500' : 'bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-100', 'text-gray-700');
          } else { // If it was inactive and failed to activate
            button.classList.remove('bg-green-500', 'bg-blue-500', 'text-white');
            button.classList.add('bg-gray-100', 'text-gray-700');
          }
        }
      }
    } catch (error) {
      console.error('RSVP error:', error);
      setLocalStatus(prevLocalStatus); // Revert on exception
    } finally {
      setTimeout(() => {
        setLocalLoading(null);
      }, 100); // Reduced delay for faster feedback
    }
  };

  return {
    localStatus,
    isGoing,
    isInterested,
    localLoading,
    combinedIsLoading,
    handleRsvpClick
  };
};
