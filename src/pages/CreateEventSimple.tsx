
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleEventForm } from '@/components/events/SimpleEventForm';
import { OrganizerActivationModal } from '@/components/events/OrganizerActivationModal';
import { PublishEventModal } from '@/components/events/PublishEventModal';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

type EventFormData = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity?: string;
  vibe: string;
  category: string;
  venueName?: string;
  venueAddress?: string;
};

type OrganizerData = {
  name: string;
  email: string;
  bio?: string;
  website?: string;
};

export default function CreateEventSimple() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthOverlay(true);
    }
  }, [isAuthenticated]);

  const handleEventSubmit = async (data: EventFormData) => {
    console.log('Event form submitted:', data);
    
    if (!isAuthenticated) {
      setEventData(data);
      setShowPublishModal(true);
      return;
    }

    // If authenticated, proceed with event creation
    await createEventWithVenue(data);
  };

  const createEventWithVenue = async (data: EventFormData, userId?: string) => {
    setIsSubmitting(true);
    
    try {
      let venueId = null;

      // Create venue if venue data is provided
      if (data.venueName && data.venueAddress) {
        const { data: venueIdResult, error: venueError } = await supabase.rpc(
          'create_venue_from_simple_form',
          {
            venue_name: data.venueName,
            venue_address: data.venueAddress,
            venue_city: data.location,
            creator_user_id: userId || user?.id
          }
        );

        if (venueError) {
          console.error('Error creating venue:', venueError);
          throw venueError;
        }

        venueId = venueIdResult;
      }

      // Create the event
      const eventPayload = {
        title: data.title,
        description: data.description,
        location: data.location,
        start_date: data.date,
        start_time: data.time,
        event_category: data.category,
        vibe: data.vibe,
        created_by: userId || user?.id,
        venue_id: venueId,
        status: 'published'
      };

      if (data.capacity) {
        // You could add capacity to events table if needed
      }

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert(eventPayload)
        .select()
        .single();

      if (eventError) {
        console.error('Error creating event:', eventError);
        throw eventError;
      }

      toast({
        title: "Event Created! 🎉",
        description: "Your event is now live and ready for attendees.",
      });

      setTimeout(() => {
        navigate('/events');
      }, 1000);

    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrganizerSubmit = async (organizerData: OrganizerData) => {
    if (!eventData || !user) return;
    await createEventWithVenue(eventData);
  };

  const handlePublishWithAuth = async (userData: { email: string; password: string; gdprConsent: boolean }) => {
    if (!eventData) return;

    setIsSubmitting(true);
    
    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create event with the new user
        await createEventWithVenue(eventData, authData.user.id);

        toast({
          title: "Welcome to The Lineup! 🎉",
          description: "Your event is now live! You're now an organizer on The Lineup.",
        });

        setShowPublishModal(false);
      }

    } catch (error) {
      console.error('Error creating user and event:', error);
      toast({
        title: "Error",
        description: "Failed to create account and event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  const handleCloseModal = () => {
    setShowOrganizerModal(false);
    setShowPublishModal(false);
    setEventData(null);
  };

  const handleAuthSuccess = () => {
    setShowAuthOverlay(false);
  };

  const handleBrowseEvents = () => {
    navigate('/events');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!showAuthOverlay && (
        <SimpleEventForm 
          onSubmit={handleEventSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      )}
      
      <OrganizerActivationModal
        isOpen={showOrganizerModal}
        onClose={handleCloseModal}
        onSubmit={handleOrganizerSubmit}
        isSubmitting={isSubmitting}
      />

      <PublishEventModal
        isOpen={showPublishModal}
        onClose={handleCloseModal}
        onSubmit={handlePublishWithAuth}
        isSubmitting={isSubmitting}
      />

      {showAuthOverlay && (
        <AuthOverlay
          title="Join to Create Events"
          description="Sign up or log in to create and organize your own events!"
          browseEventsButton={true}
          onClose={handleAuthSuccess}
          onBrowseEvents={handleBrowseEvents}
        >
          <></>
        </AuthOverlay>
      )}
    </div>
  );
}
