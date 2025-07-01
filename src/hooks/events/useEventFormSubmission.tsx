
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '@/lib/eventService';
import { processFormData } from '@/components/events/form/EventFormUtils';
import { toast } from 'sonner';
import { EventFormData } from '@/components/events/form/EventFormSchema';

export const useEventFormSubmission = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (data: EventFormData) => {
    console.log('Event form submitted:', data);
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsCreating(true);
    
    try {
      const processedData = await processFormData(data, user.id);
      console.log('Processed event data:', processedData);
      
      const { data: createdEvent, error } = await createEvent(processedData);
      
      if (error) {
        console.error('Error creating event:', error);
        toast.error('Failed to create event. Please try again.');
        return;
      }
      
      if (!createdEvent) {
        toast.error('No event data returned. Please try again.');
        return;
      }
      
      console.log('Event created successfully:', createdEvent);
      setCreatedEventId(createdEvent.id);
      setCreatedEventTitle(createdEvent.title || 'Your Event');
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // The form will be automatically submitted after successful auth
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleEventCreated = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return {
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated,
    showAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    createdEventId,
    createdEventTitle,
    isCreating,
  };
};
