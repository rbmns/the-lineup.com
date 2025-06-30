
import React from 'react';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { PrePublishAuthModal } from './PrePublishAuthModal';
import { EventPublishedModal } from './EventPublishedModal';
import { Venue } from '@/types';

interface EventFormModalsProps {
  isCreateVenueModalOpen: boolean;
  setCreateVenueModalOpen: (open: boolean) => void;
  onVenueCreated: (venue: Venue) => void;
  showAuthModal: boolean;
  onAuthModalClose: () => void;
  onAuthSuccess: () => void;
  showSuccessModal: boolean;
  onSuccessModalClose: () => void;
  createdEventId?: string;
  createdEventTitle: string;
}

export const EventFormModals: React.FC<EventFormModalsProps> = ({
  isCreateVenueModalOpen,
  setCreateVenueModalOpen,
  onVenueCreated,
  showAuthModal,
  onAuthModalClose,
  onAuthSuccess,
  showSuccessModal,
  onSuccessModalClose,
  createdEventId,
  createdEventTitle
}) => {
  return (
    <>
      <CreateVenueModal 
        open={isCreateVenueModalOpen} 
        onOpenChange={setCreateVenueModalOpen} 
        onComplete={onVenueCreated} 
      />

      <PrePublishAuthModal 
        open={showAuthModal} 
        onClose={onAuthModalClose} 
        onSuccess={onAuthSuccess} 
      />

      <EventPublishedModal 
        open={showSuccessModal} 
        onClose={onSuccessModalClose} 
        eventId={createdEventId} 
        eventTitle={createdEventTitle} 
      />
    </>
  );
};
