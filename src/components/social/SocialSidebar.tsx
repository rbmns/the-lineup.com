import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { RequestCreatorModal } from './RequestCreatorModal';
import { CreatorRequestsManager } from './CreatorRequestsManager';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

const SIDEBAR_WIDTH_PX = 224; // 56 x 4px

interface CreatorRequestFormValues {
  reason: string;
  contact_email?: string;
  contact_phone?: string;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  visible = true,
  onToggleVisibility,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  // For event creator handling:
  const {
    isLoading: isCreatorStatusLoading,
    canCreateEvents,
    isAdmin,
    creatorRequestStatus,
  } = useCreatorStatus();

  const [showRequestCreator, setShowRequestCreator] = useState(false);
  const [showRequestsManager, setShowRequestsManager] = useState(false);

  const fetchAdminRequests = async () => {
    const { data, error } = await CreatorRequestService.getCreatorRequestsForAdmin();
    if (error) {
      console.log("Could not fetch creator requests, user might not be admin.");
      return [];
    }
    return data || [];
  };

  const { data: adminRequests } = useQuery({
    queryKey: ['adminCreatorRequests'],
    queryFn: fetchAdminRequests,
    enabled: isAdmin,
    refetchInterval: 60000,
  });
  
  const pendingRequestsCount = adminRequests?.filter(r => !r.is_read).length || 0;


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
    if (isCreatorStatusLoading) return;
    
    const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';
    
    if (hasPermission) {
      navigate('/events/create');
    } else {
      setShowRequestCreator(true);
    }
  };

  // Handle request action
  const handleRequestCreator = async (formData: CreatorRequestFormValues) => {
    if (!user) return;
    const { error } = await CreatorRequestService.requestCreatorAccess(user.id, formData);
    if (error) {
      toast.error("There was an issue submitting your request. Please try again.");
    } else {
      toast.success("Your request has been submitted!");
      

      // Fetch user profile for notification details
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user.id)
        .single();
      
      // Trigger DB notification to admin
      if (profile) {
        const { error: notificationError } = await CreatorRequestService.notifyAdminOfCreatorRequest(
          user.id, 
          formData, 
          {
            username: profile.username || 'N/A',
            email: profile.email || user.email || 'N/A',
          }
        );

        if(notificationError){
            console.error("Failed to create admin notification", notificationError);
        }
      }
    }
  };

  // If sidebar is visible
  return (
    <>
      <div className="fixed top-0 right-0 h-full z-50 flex">
        <div className="relative h-full w-56 bg-card shadow-lg overflow-y-auto">
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

            {isAdmin && (
              <div className="py-2 border-b">
                <h3 className="text-xs font-semibold uppercase text-muted-foreground px-1 mb-2">Admin</h3>
                <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => setShowRequestsManager(true)}
                >
                    <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Creator Requests
                    </span>
                    {pendingRequestsCount > 0 && (
                        <Badge variant="destructive" className="h-5">{pendingRequestsCount}</Badge>
                    )}
                </Button>
              </div>
            )}

            {/* Spacing/padding around Create Event button */}
            <div className="py-2">
              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleCreateEventClick}
                disabled={isCreatorStatusLoading} // Disable while checking roles or request status
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
      {/* Creator Requests Manager Modal for admins */}
      {isAdmin && 
        <CreatorRequestsManager
            open={showRequestsManager}
            onClose={() => setShowRequestsManager(false)}
        />
      }
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
