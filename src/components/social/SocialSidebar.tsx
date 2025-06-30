
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';
import { AdminSection } from './AdminSection';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { RequestCreatorModal } from './RequestCreatorModal';
import { CreatorRequestsManager } from './CreatorRequestsManager';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { SidebarToggleButton } from './SidebarToggleButton';

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

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
  const [showRequestCreator, setShowRequestCreator] = useState(false);
  const [showRequestsManager, setShowRequestsManager] = useState(false);

  const {
    isLoading: isCreatorStatusLoading,
    canCreateEvents,
    isAdmin,
    creatorRequestStatus,
  } = useCreatorStatus();

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

  // Show toggle button if sidebar is hidden
  if (!visible) {
    return (
      <SidebarToggleButton visible={false} onClick={onToggleVisibility || (() => {})} />
    );
  }

  const handleCloseAuthOverlay = () => {
    setShowAuth(false);
  };

  const handleBrowseEvents = () => {
    setShowAuth(false);
    setTimeout(() => {
      if (window.location.pathname !== '/events') {
        navigate('/events');
      }
    }, 0);
  };

  const handleCreateEventClick = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (isCreatorStatusLoading) return;
    
    const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';
    
    if (hasPermission) {
      navigate('/events/create');
    } else {
      setShowRequestCreator(true);
    }
  };

  const handleRequestCreator = async (formData: CreatorRequestFormValues) => {
    if (!user) return;
    const { error } = await CreatorRequestService.requestCreatorAccess(user.id, formData);
    if (error) {
      toast.error("There was an issue submitting your request. Please try again.");
    } else {
      toast.success("Your request has been submitted!");
    }
  };

  const shouldShowCreateButton = !user || (user && canCreateEvents);

  return (
    <>
      <div className="fixed top-0 right-0 h-full z-50 flex">
        <div className="relative h-full w-56 bg-card shadow-lg overflow-y-auto">
          <SidebarToggleButton visible={true} onClick={onToggleVisibility || (() => {})} />
          
          <div className="p-4 space-y-4">
            <SocialHeader />

            {isAdmin && (
              <AdminSection 
                pendingRequestsCount={pendingRequestsCount}
                onShowRequestsManager={() => setShowRequestsManager(true)}
              />
            )}

            {shouldShowCreateButton && (
              <div className="py-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  onClick={handleCreateEventClick}
                  disabled={isCreatorStatusLoading}
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </Button>
              </div>
            )}
            
            {!user && <SignUpPrompt />}
            <CommunitySection />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAdmin && 
        <CreatorRequestsManager
            open={showRequestsManager}
            onClose={() => setShowRequestsManager(false)}
        />
      }
      
      <RequestCreatorModal
        open={showRequestCreator}
        onClose={() => setShowRequestCreator(false)}
        onRequest={handleRequestCreator}
        requestStatus={creatorRequestStatus}
      />
      
      {showAuth && !user && (
        <AuthOverlay
          isOpen={showAuth}
          title="Create your account"
          description="Sign up or log in to create and share your own events!"
          browseEventsButton={true}
          onClose={handleCloseAuthOverlay}
          onBrowseEvents={handleBrowseEvents}
        >
          <></>
        </AuthOverlay>
      )}
    </>
  );
};
