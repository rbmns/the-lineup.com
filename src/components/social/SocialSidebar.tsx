
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
import { CreatorRequestsManager } from './CreatorRequestsManager';
import { CreatorRequestService } from '@/services/CreatorRequestService';
import { useQuery } from '@tanstack/react-query';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { SidebarToggleButton } from './SidebarToggleButton';

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  visible = true,
  onToggleVisibility,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [showRequestsManager, setShowRequestsManager] = useState(false);

  const { isAdmin } = useCreatorStatus();

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
    navigate('/events/create');
  };

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

            <div className="py-2">
              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleCreateEventClick}
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

      {/* Modals */}
      {isAdmin && 
        <CreatorRequestsManager
            open={showRequestsManager}
            onClose={() => setShowRequestsManager(false)}
        />
      }
      
      {showAuth && !user && (
        <AuthOverlay
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
