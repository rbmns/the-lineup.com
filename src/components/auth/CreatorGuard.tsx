
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface CreatorGuardProps {
  children: React.ReactNode;
}

export const CreatorGuard: React.FC<CreatorGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return; // Wait until authentication loading is done
    }

    if (!user) {
      toast.error("You must be logged in to create an event.");
      navigate('/login', { replace: true });
      return;
    }

    // Allow any authenticated user to create events
    // The database RLS policies will handle the security
  }, [user, authLoading, navigate]);

  if (authLoading) {
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

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};
