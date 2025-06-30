
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseEventFormSubmissionProps {
  isEditMode?: boolean;
  originalOnSubmit: (data: any) => Promise<void>;
  onEventCreated?: (eventId: string, eventTitle: string) => void;
}

export const useEventFormSubmission = ({
  isEditMode = false,
  originalOnSubmit,
  onEventCreated
}: UseEventFormSubmissionProps) => {
  const { isAuthenticated, user, session } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [createdEventTitle, setCreatedEventTitle] = useState<string>('');
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const handleFormSubmit = async (data: any) => {
    console.log("Form submit called with data:", data);
    console.log("Is authenticated:", isAuthenticated);
    console.log("User object:", user);
    console.log("Session object:", session);
    console.log("Is edit mode:", isEditMode);

    // If editing an existing event, proceed normally
    if (isEditMode) {
      return originalOnSubmit(data);
    }

    // Check authentication using multiple indicators for reliability
    const isUserAuthenticated = isAuthenticated && user && session;

    // If not authenticated, store form data and show auth modal
    if (!isUserAuthenticated) {
      console.log("User not authenticated, showing auth modal");
      setPendingFormData(data);
      setShowAuthModal(true);
      return;
    }

    // If authenticated, proceed with submission
    console.log("User authenticated, proceeding with submission");
    return originalOnSubmit(data);
  };

  const handleAuthSuccess = async () => {
    console.log("Auth success callback called");
    setShowAuthModal(false);
    
    if (pendingFormData) {
      console.log("Submitting pending form data after auth success");
      
      // Show a toast to let user know we're processing their event
      toast({
        title: "Publishing your event...",
        description: "Please wait while we publish your event.",
      });

      // Add a delay to ensure auth state is fully propagated for new accounts
      setTimeout(async () => {
        // Check auth state before proceeding - for new accounts, they should be logged in now
        if (isAuthenticated && user && session) {
          try {
            console.log("Auth confirmed, now submitting event");
            await originalOnSubmit(pendingFormData);
            setPendingFormData(null);
          } catch (error) {
            console.error("Error submitting form after auth:", error);
            toast({
              title: "Event publishing failed",
              description: "Please try again or check your connection.",
              variant: "destructive"
            });
          }
        } else {
          console.log("Auth state not yet confirmed, retrying in a moment");
          // For new accounts, auth state might take longer to propagate
          setTimeout(async () => {
            if (isAuthenticated && user && session) {
              try {
                console.log("Auth confirmed on retry, now submitting event");
                await originalOnSubmit(pendingFormData);
                setPendingFormData(null);
              } catch (error) {
                console.error("Error submitting form after auth retry:", error);
                toast({
                  title: "Event publishing failed",
                  description: "Please try refreshing the page and try again.",
                  variant: "destructive"
                });
              }
            } else {
              console.log("Auth state still not confirmed, asking user to try again");
              toast({
                title: "Please try again",
                description: "Your account was created but there was an issue publishing your event. Please try again.",
                variant: "destructive"
              });
              setPendingFormData(null);
            }
          }, 2000);
        }
      }, 1000);
    }
  };

  const handleAuthModalClose = () => {
    console.log("Auth modal closed without success");
    setShowAuthModal(false);
    setPendingFormData(null);
  };

  const handleEventCreated = (eventId: string, eventTitle: string) => {
    setCreatedEventId(eventId);
    setCreatedEventTitle(eventTitle);
    setShowSuccessModal(true);
    if (onEventCreated) {
      onEventCreated(eventId, eventTitle);
    }
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
    createdEventTitle
  };
};
