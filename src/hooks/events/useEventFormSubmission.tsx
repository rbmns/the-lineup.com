
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createEvent, updateEvent } from '@/lib/eventService';
import { processFormData } from '@/components/events/form/EventFormUtils';
import { toast } from 'sonner';
import { EventFormData } from '@/components/events/form/EventFormSchema';
import { useTracking } from '@/services/trackingService';

export const useEventFormSubmission = (eventId?: string, isEditMode?: boolean) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState('');
  const [pendingEventData, setPendingEventData] = useState<any>(null);
  const [pendingEventEmail, setPendingEventEmail] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackEventCreation } = useTracking();

  const handleFormSubmit = async (data: EventFormData) => {
    console.log('🚀 Event form submitted in useEventFormSubmission:', data);
    console.log('🔐 Current user state:', user ? `User ID: ${user.id}` : 'No user authenticated');
    
    if (!user) {
      // For unauthenticated users, create pending event and show auth modal
      console.log('👤 User not authenticated, creating pending event and showing auth modal');
      await createPendingEvent(data);
      return;
    }

    // For authenticated users, create or update the event immediately
    if (isEditMode && eventId) {
      console.log('✅ User authenticated, updating event...');
      await updateEventWithAuth(data, user.id, eventId);
    } else {
      console.log('✅ User authenticated, creating event immediately...');
      await createEventWithAuth(data, user.id);
    }
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
      
      // Track the event creation
      await trackEventCreation({
        event_id: createdEvent.id,
        event_title: createdEvent.title || 'Untitled Event',
        event_category: createdEvent.event_category || 'Unknown',
        event_vibe: createdEvent.vibe || 'Unknown',
        destination: createdEvent.destination || 'Unknown',
        creator_id: userId,
      });
      
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('Failed to create event:', error);
      toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const updateEventWithAuth = async (data: EventFormData, userId: string, eventId: string) => {
    setIsCreating(true);
    
    try {
      const processedData = await processFormData(data, userId);
      console.log('Processed event update data:', processedData);
      
      const { data: updatedEvent, error } = await updateEvent(eventId, processedData);
      
      if (error) {
        console.error('Error updating event:', error);
        toast.error(`Failed to update event: ${error.message || 'Unknown error'}`);
        return;
      }
      
      if (!updatedEvent) {
        toast.error('No event data returned. Please try again.');
        return;
      }
      
      console.log('Event updated successfully:', updatedEvent);
      toast.success('Event updated successfully!');
      navigate(`/events/${eventId}`);
      
    } catch (error: any) {
      console.error('Failed to update event:', error);
      toast.error(`Failed to update event: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const createPendingEvent = async (data: EventFormData) => {
    setIsCreating(true);
    
    try {
      const processedData = await processFormData(data, null);
      // Add pending status and temporary email from form data
      const pendingEventData = {
        ...processedData,
        status: 'pending',
        creator: null,
        creator_email: null // Will be filled when user signs up
      };
      
      console.log('Creating pending event:', pendingEventData);
      
      const { data: createdEvent, error } = await createEvent(pendingEventData);
      
      if (error) {
        console.error('Error creating pending event:', error);
        toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
        return;
      }
      
      if (!createdEvent) {
        toast.error('No event data returned. Please try again.');
        return;
      }
      
      console.log('Pending event created successfully:', createdEvent);
      setCreatedEventId(createdEvent.id);
      setCreatedEventTitle(createdEvent.title || 'Your Event');
      
      // Show signup modal instead of success modal
      setShowAuthModal(true);
      
    } catch (error: any) {
      console.error('Failed to create pending event:', error);
      toast.error(`Failed to create event: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAuthSuccess = async () => {
    console.log('Authentication successful, updating pending event');
    setShowAuthModal(false);
    
    if (createdEventId && user) {
      // Update the pending event with the authenticated user's ID and change status to published
      setIsCreating(true);
      
      try {
        const { data: updatedEvent, error } = await updateEvent(createdEventId, {
          creator: user.id,
          creator_email: user.email,
          status: 'published'
        });
        
        if (error) {
          console.error('Error updating pending event after auth:', error);
          toast.error(`Failed to publish event: ${error.message || 'Unknown error'}`);
          return;
        }
        
        if (!updatedEvent) {
          toast.error('No event data returned. Please try again.');
          return;
        }
        
        console.log('Pending event updated successfully after auth:', updatedEvent);
        
        // Track the event creation
        await trackEventCreation({
          event_id: updatedEvent.id,
          event_title: updatedEvent.title || 'Untitled Event',
          event_category: updatedEvent.event_category || 'Unknown',
          event_vibe: updatedEvent.vibe || 'Unknown',
          destination: updatedEvent.destination || 'Unknown',
          creator_id: user.id,
        });
        
        setShowSuccessModal(true);
        
      } catch (error: any) {
        console.error('Failed to update pending event after auth:', error);
        toast.error(`Failed to publish event: ${error.message || 'Unknown error'}`);
      } finally {
        setIsCreating(false);
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
    showPendingModal,
    setShowSuccessModal,
    setShowPendingModal,
    createdEventId,
    createdEventTitle,
    isCreating,
  };
};
