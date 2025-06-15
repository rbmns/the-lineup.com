
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';

interface CreatorGuardProps {
  children: React.ReactNode;
}

export const CreatorGuard: React.FC<CreatorGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { canCreateEvents, creatorRequestStatus, isLoading: isCreatorStatusLoading } = useCreatorStatus();

  const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';

  useEffect(() => {
    if (authLoading || isCreatorStatusLoading) {
      return; // Wait until all loading is done
    }

    if (!user) {
      toast.error("You must be logged in to create an event.");
      navigate('/login', { replace: true });
      return;
    }

    if (!hasPermission) {
      if (creatorRequestStatus === 'pending') {
        toast.info("Your creator request is pending approval.");
      } else {
        toast.error("You don't have permission to create events.");
      }
      navigate('/profile', { replace: true });
    }
  }, [user, authLoading, navigate, hasPermission, isCreatorStatusLoading, creatorRequestStatus]);

  if (authLoading || isCreatorStatusLoading) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <div className="bg-white rounded-lg border shadow-sm p-6 mt-8 space-y-6">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!hasPermission) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};
