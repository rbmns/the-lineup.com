
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CreateEventButtonProps {
  onAuthRequired: () => void;
}

export const CreateEventButton: React.FC<CreateEventButtonProps> = ({
  onAuthRequired
}) => {
  const { isAuthenticated } = useAuth();
  const {
    canCreateEvents,
    creatorRequestStatus,
    isLoading: isCreatorStatusLoading
  } = useCreatorStatus();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const shouldShowCreateButton = isAuthenticated && canCreateEvents;

  const handleCreateEventClick = () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    if (isCreatorStatusLoading) return;
    
    const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';
    
    if (hasPermission) {
      navigate('/events/create');
    } else {
      navigate('/events');
    }
  };

  if (!shouldShowCreateButton) return null;

  return (
    <Button
      onClick={handleCreateEventClick}
      disabled={isCreatorStatusLoading}
      className={cn(
        "bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center gap-2 flex-shrink-0",
        isMobile ? "text-sm px-3 py-2" : "text-sm px-4 py-2"
      )}
    >
      <Plus className="h-4 w-4" />
      {!isMobile && "Create Event"}
    </Button>
  );
};
