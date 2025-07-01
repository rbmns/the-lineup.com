
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
  const [pendingEventData, setPendingEventData] = useState<any>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (data: EventFormData) => {
    console.log('Event form submitted:', data);
    
    if (!user) {
      // For unauthenticated users, process the form data and show auth modal
      console.log('User not authenticated, processing form data and showing auth modal');
      try {
        const processedData = await processFormData(data, null); // Pass null for unauthenticated users
        setPendingEventData(processedData);
        setShowAuthModal(true);
      } catch (error) {
        console.error('Error processing form data:', error);
        toast.error('Failed to process event data. Please try again.');
      }
      return;
    }

    // For authenticated users, create the event immediately
    await createEventWithAuth(data, user.id);
  };

  const createEventWithAuth = async (data: EventFormData, userId: string) => {
    setIsCreating(true);
    
    try {
      const processedData = await processFormData(data, userId);
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

  const handleAuthSuccess = async () => {
    console.log('Authentication successful, creating event with pending data');
    setShowAuthModal(false);
    
    if (pendingEventData && user) {
      // Update the pending data with the authenticated user's ID
      const updatedEventData = {
        ...pendingEventData,
        creator: user.id
      };
      
      setIsCreating(true);
      
      try {
        const { data: createdEvent, error } = await createEvent(updatedEventData);
        
        if (error) {
          console.error('Error creating event after auth:', error);
          toast.error('Failed to create event. Please try again.');
          return;
        }
        
        if (!createdEvent) {
          toast.error('No event data returned. Please try again.');
          return;
        }
        
        console.log('Event created successfully after auth:', createdEvent);
        setCreatedEventId(createdEvent.id);
        setCreatedEventTitle(createdEvent.title || 'Your Event');
        setShowSuccessModal(true);
        
      } catch (error: any) {
        console.error('Failed to create event after auth:', error);
        toast.error('Failed to create event. Please try again.');
      } finally {
        setIsCreating(false);
        setPendingEventData(null);
      }
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setPendingEventData(null);
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
