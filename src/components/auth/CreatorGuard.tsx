
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserService } from '@/services/UserService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface CreatorGuardProps {
  children: React.ReactNode;
}

export const CreatorGuard: React.FC<CreatorGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create an event.");
      navigate('/login');
      return;
    }

    let isMounted = true;
    UserService.getUserRoles(user.id)
      .then(({ data }) => {
        if (isMounted) {
          const canCreateEvents = data?.includes('event_creator') || data?.includes('admin') || false;
          if (!canCreateEvents) {
            toast.error("You don't have permission to create events.");
            navigate('/');
          }
          setHasPermission(canCreateEvents);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Could not verify your permissions.");
          navigate('/');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    
    return () => { isMounted = false; }
  }, [user, authLoading, navigate]);

  if (loading || authLoading || hasPermission === null) {
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

  return <>{children}</>;
};
