
import React from 'react';
import { PrePublishAuthModal } from './PrePublishAuthModal';
import { EventPublishedModal } from './EventPublishedModal';

interface EventFormModalsProps {
  showAuthModal: boolean;
  onAuthModalClose: () => void;
  onAuthSuccess: () => void;
  showSuccessModal: boolean;
  onSuccessModalClose: () => void;
  createdEventId?: string;
  createdEventTitle: string;
}

export const EventFormModals: React.FC<EventFormModalsProps> = ({
  showAuthModal,
  onAuthModalClose,
  onAuthSuccess,
  showSuccessModal,
  onSuccessModalClose,
  createdEventId,
  createdEventTitle,
}) => {
  return (
    <>
      <PrePublishAuthModal
        open={showAuthModal}
        onOpenChange={onAuthModalClose}
        onAuthSuccess={onAuthSuccess}
      />

      <EventPublishedModal
        open={showSuccessModal}
        onOpenChange={onSuccessModalClose}
        eventId={createdEventId}
        eventTitle={createdEventTitle}
      />
    </>
  );
};
