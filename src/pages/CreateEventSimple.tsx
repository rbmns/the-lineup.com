
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleEventForm } from '@/components/events/SimpleEventForm';
import { OrganizerActivationModal } from '@/components/events/OrganizerActivationModal';
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
  const { user } = useAuth();
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventSubmit = (data: EventFormData) => {
    console.log('Event form submitted:', data);
    setEventData(data);
    setShowOrganizerModal(true);
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

  const handleCancel = () => {
    navigate('/events');
  };

  const handleCloseModal = () => {
    setShowOrganizerModal(false);
    setEventData(null);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-midnight mb-4">Authentication Required</h1>
        <p className="text-overcast">Please log in to create an event.</p>
      </div>
    );
  }

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
    </div>
  );
}
