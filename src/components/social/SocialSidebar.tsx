import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { RequestCreatorModal } from './RequestCreatorModal';
import { UserService } from '@/services/UserService';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { toast } from "sonner";

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

const SIDEBAR_WIDTH_PX = 224; // 56 x 4px

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  visible = true,
  onToggleVisibility,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  // For event creator handling:
  const [isEventCreator, setIsEventCreator] = useState<boolean | null>(null); // null = unknown
  const [showRequestCreator, setShowRequestCreator] = useState(false);
  const [creatorRequestStatus, setCreatorRequestStatus] = useState<string | null>(null); // 'pending', 'not_requested', null (loading)

  // Fetch user roles and request status if logged in
  useEffect(() => {
    let isMounted = true;
    if (user) {
      UserService.getUserRoles(user.id).then(({ data }) => {
        if (isMounted) {
          setIsEventCreator(data?.includes('event_creator') || false);
        }
      });
      CreatorRequestService.getCreatorRequestStatus(user.id).then(({ data }) => {
        if (isMounted) {
          setCreatorRequestStatus(data?.status || 'not_requested');
        }
      });
    } else {
      setIsEventCreator(null);
      setCreatorRequestStatus(null);
    }
    return () => { isMounted = false; }
  }, [user]);

  // Show the "Expand" button if sidebar is hidden
  if (!visible) {
    return (
      <div
        className="fixed z-50"
        style={{
          top: '50%',
          right: `${SIDEBAR_WIDTH_PX}px`,
          transform: 'translateY(-50%)',
        }}
      >
        <button
          className="bg-white border border-gray-200 shadow-lg rounded-r-lg rounded-l-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
          style={{
            height: '48px',
            minWidth: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
          aria-label="Expand social sidebar"
          onClick={onToggleVisibility}
        >
          {/* ChevronRight means "open" */}
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  }

  // Callback to close Auth Modal (passed to AuthOverlay)
  const handleCloseAuthOverlay = () => {
    setShowAuth(false);
  };

  // Handler for browse events: close modal, then navigate.
  const handleBrowseEvents = () => {
    setShowAuth(false);
    setTimeout(() => {
      if (window.location.pathname !== '/events') {
        navigate('/events');
      }
    }, 0);
  };

  // New callback for "Create Event"
  const handleCreateEventClick = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    // If event creator status still loading, optimistically disable
    if (isEventCreator === null || creatorRequestStatus === null) return;
    if (isEventCreator) {
      navigate('/events/create');
    } else {
      setShowRequestCreator(true);
    }
  };

  // Handle request action
  const handleRequestCreator = async () => {
    if (!user) return;
    const { error } = await CreatorRequestService.requestCreatorAccess(user.id);
    if (error) {
      toast.error("There was an issue submitting your request. Please try again.");
    } else {
      toast.success("Your request has been submitted!");
      setCreatorRequestStatus('pending');
    }
  };

  // If sidebar is visible
  return (
    <>
      <div className="fixed top-0 right-0 h-full z-50 flex">
        <div className="relative h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
          {/* Collapse Button */}
          <div
            className="absolute"
            style={{
              left: '-48px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <button
              className="bg-white border border-gray-200 shadow-lg rounded-r-lg rounded-l-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
              style={{
                height: '48px',
                minWidth: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}
              aria-label="Collapse social sidebar"
              onClick={onToggleVisibility}
            >
              {/* ChevronLeft means "close" */}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <SocialHeader />
            {/* Spacing/padding around Create Event button */}
            <div className="py-2">
              <Button
                size="sm"
                className="w-full flex items-center justify-center gap-2 bg-ocean-deep-600 text-white hover:bg-ocean-deep-700 shadow-sm rounded-md py-2 px-4 transition-all"
                onClick={handleCreateEventClick}
                disabled={isEventCreator === null || creatorRequestStatus === null} // Disable while checking roles or request status
              >
                <Plus className="w-4 h-4" />
                Create Event
              </Button>
            </div>
            {!user && <SignUpPrompt />}
            <CommunitySection />
          </div>
        </div>
      </div>
      {/* Event Creator Request Modal */}
      <RequestCreatorModal
        open={showRequestCreator}
        onClose={() => setShowRequestCreator(false)}
        onRequest={handleRequestCreator}
        requestStatus={creatorRequestStatus}
      />
      {/* Auth Overlay Modal: only show if prompted and not logged in */}
      {showAuth && !user && (
        <AuthOverlay
          title="Create your account"
          description="Sign up or log in to create and share your own events!"
          browseEventsButton={true}
          onClose={handleCloseAuthOverlay}
          onBrowseEvents={handleBrowseEvents}
        >
          {/* Passing empty fragment as required `children` prop */}
          <></>
        </AuthOverlay>
      )}
    </>
  );
};
