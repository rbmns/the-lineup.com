
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
    console.log('🚀 Event form submitted in useEventFormSubmission:', data);
    console.log('🔐 Current user state:', user ? `User ID: ${user.id}` : 'No user authenticated');
    
    if (!user) {
      // For unauthenticated users, process the form data and show auth modal
      console.log('👤 User not authenticated, processing form data and showing auth modal');
      try {
        console.log('📝 Processing form data for unauthenticated user...');
        const processedData = await processFormData(data, null); // Pass null for unauthenticated users
        console.log('✅ Form data processed successfully:', processedData);
        setPendingEventData(processedData);
        console.log('🔑 Showing auth modal...');
        setShowAuthModal(true);
      } catch (error) {
        console.error('❌ Error processing form data:', error);
        toast.error('Failed to process event data. Please try again.');
      }
      return;
    }

    // For authenticated users, create the event immediately
    console.log('✅ User authenticated, creating event immediately...');
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
        
        // Provide more specific error messages
        if (error.code === '23502') {
          toast.error('Missing required fields. Please fill in all required information.');
        } else if (error.code === '23505') {
          toast.error('An event with this information already exists.');
        } else if (error.code === '42501') {
          toast.error('You don\'t have permission to create events. Please sign in or contact support.');
        } else if (error.message?.includes('row-level security')) {
          toast.error('Permission denied. Please sign in to create events.');
        } else {
          toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
        }
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
      toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
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
          
          // Provide more specific error messages
          if (error.code === '23502') {
            toast.error('Missing required fields. Please check your event information.');
          } else if (error.code === '42501') {
            toast.error('Permission denied. Please try refreshing the page and signing in again.');
          } else {
            toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
          }
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
        toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
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
