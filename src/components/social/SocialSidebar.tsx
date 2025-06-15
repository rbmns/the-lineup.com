
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AuthOverlay } from '@/components/auth/AuthOverlay';

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
                onClick={() => {
                  if (user) {
                    navigate('/events/create');
                  } else {
                    setShowAuth(true);
                  }
                }}
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

