
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleEventForm } from '@/components/events/SimpleEventForm';
import { OrganizerActivationModal } from '@/components/events/OrganizerActivationModal';
import { PublishEventModal } from '@/components/events/PublishEventModal';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

type EventFormData = {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  capacity?: string;
  vibe: string;
  category: string;
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
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventSubmit = (data: EventFormData) => {
    console.log('Event form submitted:', data);
    setEventData(data);
    
    if (isAuthenticated) {
      // User is logged in, show organizer modal
      setShowOrganizerModal(true);
    } else {
      // User is not logged in, show publish modal for auth
      setShowPublishModal(true);
    }
  };

  const handleOrganizerSubmit = async (organizerData: OrganizerData) => {
    if (!eventData || !user) return;

    setIsSubmitting(true);
    
    try {
      // Here you would normally create the event and organizer data
      console.log('Creating event with organizer data:', {
        event: eventData,
        organizer: organizerData
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Event Created! 🎉",
        description: "Your event is now live and ready for attendees.",
      });

      // Show success and redirect
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

  const handlePublishWithAuth = async (userData: { email: string; password: string; gdprConsent: boolean }) => {
    if (!eventData) return;

    setIsSubmitting(true);
    
    try {
      // Here you would:
      // 1. Create user account
      // 2. Create event with user as organizer
      console.log('Creating user and event:', {
        user: userData,
        event: eventData
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Welcome to The Lineup! 🎉",
        description: "Your event is now live! You're now an organizer on The Lineup.",
      });

      // Close modal and redirect
      setShowPublishModal(false);
      setTimeout(() => {
        navigate('/events');
      }, 1000);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <SimpleEventForm 
        onSubmit={handleEventSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
      
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
    </div>
  );
}
