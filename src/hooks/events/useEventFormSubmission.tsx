import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { EventFormData } from '@/components/events/form/EventFormSchema';
import { useState, useCallback, useEffect } from 'react';
import { useFormDataPersistence } from './useFormDataPersistence';

export const useEventFormSubmission = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState('');
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  const {
    storeFormData,
    getStoredFormData,
    clearStoredFormData,
    hasStoredFormData
  } = useFormDataPersistence();

  // Enhanced authentication check with better session handling
  const checkAuthentication = useCallback(async () => {
    setIsAuthChecking(true);
    try {
      // First check the context user
      if (user) {
        console.log('✅ User found in context:', user.id);
        return user;
      }

      console.log('⏳ No user in context, checking Supabase session...');
      
      // Check Supabase session directly with retry logic
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session check error:', error);
        return null;
      }
      
      if (!session?.user) {
        console.log('❌ No active Supabase session');
        return null;
      }
      
      console.log('✅ Found Supabase session user:', session.user.id);
      return session.user;
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      return null;
    } finally {
      setIsAuthChecking(false);
    }
  }, [user]);

  // Check for stored form data on component mount
  useEffect(() => {
    if (hasStoredFormData() && user) {
      console.log('🔄 Found stored form data and authenticated user, attempting retry...');
      const storedData = getStoredFormData();
      if (storedData) {
        // Small delay to ensure auth context is fully updated
        setTimeout(() => {
          console.log('🚀 Retrying event creation with stored data');
          createEventMutation.mutate(storedData);
        }, 500);
      }
    }
  }, [user]);

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      console.log('🔄 Starting event creation process...');
      
      // Check authentication
      const authenticatedUser = await checkAuthentication();
      
      if (!authenticatedUser) {
        console.log('❌ No authenticated user, storing form data and showing auth modal');
        storeFormData(data);
        setShowAuthModal(true);
        throw new Error('Authentication required');
      }

      console.log('✅ User authenticated:', authenticatedUser.id);

      // Create start_datetime from date and time
      const startDatetime = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.startTime}`);
      
      // Create end_datetime if end date and time are provided
      let endDatetime = null;
      if (data.endDate && data.endTime) {
        endDatetime = new Date(`${data.endDate.toISOString().split('T')[0]}T${data.endTime}`);
      } else if (data.endTime) {
        endDatetime = new Date(`${data.startDate.toISOString().split('T')[0]}T${data.endTime}`);
      }

      // Convert form data to database format
      const eventData = {
        title: data.title,
        description: data.description || null,
        venue_id: data.venueId || null,
        location: data.location || null,
        start_date: data.startDate.toISOString().split('T')[0],
        start_time: data.startTime,
        end_date: data.endDate?.toISOString().split('T')[0] || null,
        end_time: data.endTime || null,
        start_datetime: startDatetime.toISOString(),
        end_datetime: endDatetime?.toISOString() || null,
        fixed_start_time: !data.flexibleStartTime,
        timezone: data.timezone,
        event_category: data.eventCategory || null,
        vibe: data.vibe || null,
        fee: data.fee || null,
        organizer_link: data.organizerLink || null,
        tags: data.tags?.join(',') || null,
        creator: authenticatedUser.id,
        created_by: authenticatedUser.id,
        status: 'published' as const,
      };

      console.log('📤 Sending event data:', eventData);

      const { data: event, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Event created successfully:', event);
      return event;
    },
    onSuccess: (event) => {
      // Clear stored form data on success
      clearStoredFormData();
      setIsWaitingForAuth(false);
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setCreatedEventId(event.id);
      setCreatedEventTitle(event.title);
      setShowSuccessModal(true);
      
      toast({
        title: 'Event created successfully! 🎉',
        description: 'Your event has been published and is now visible to others.',
      });
    },
    onError: (error) => {
      console.error('❌ Error creating event:', error);
      
      // Don't show auth modal if we're already waiting for auth or if auth modal is open
      if (error.message.includes('Authentication required') && !showAuthModal && !isWaitingForAuth) {
        setIsWaitingForAuth(true);
        // Form data is already stored in the mutation function
        return;
      }
      
      // Handle other errors
      if (error.message.includes('Authentication required')) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to create an event.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error creating event',
          description: error.message || 'Please try again or contact support if the problem persists.',
          variant: 'destructive',
        });
      }
    },
  });

  const handleFormSubmit = useCallback(async (data: EventFormData) => {
    console.log('📝 Form submitted with data:', data);
    console.log('👤 Current user in context:', user?.id || 'No user');
    
    createEventMutation.mutate(data);
  }, [createEventMutation, user]);

  const handleAuthSuccess = useCallback(() => {
    console.log('🎉 Authentication successful, closing modal');
    setShowAuthModal(false);
    setIsWaitingForAuth(false);
    
    // The useEffect will handle retrying with stored form data
    toast({
      title: 'Authentication successful!',
      description: 'Creating your event now...',
    });
  }, []);

  const handleAuthModalClose = useCallback(() => {
    console.log('❌ Auth modal closed without success');
    setShowAuthModal(false);
    setIsWaitingForAuth(false);
    // Keep stored form data in case user wants to try again
  }, []);

  const handleEventCreated = useCallback((eventId: string, eventTitle: string) => {
    navigate(`/events/${eventId}`);
  }, [navigate]);

  return {
    createEvent: createEventMutation.mutate,
    isCreating: createEventMutation.isPending || isAuthChecking || isWaitingForAuth,
    handleFormSubmit,
    handleAuthSuccess,
    handleAuthModalClose,
    handleEventCreated,
    showAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    createdEventId,
    createdEventTitle,
    isAuthChecking,
    isWaitingForAuth
  };
};
