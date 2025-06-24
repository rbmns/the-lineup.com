
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventForm } from '@/components/events/EventForm';
import { useAuth } from '@/contexts/AuthContext';
import { useEventDetails } from '@/hooks/useEventDetails';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { BackButton } from '@/components/profile/BackButton';

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { event, isLoading: eventLoading, error } = useEventDetails(eventId ?? null);
  const { isAdmin, isLoading: isCreatorStatusLoading } = useCreatorStatus();

  const isLoading = authLoading || eventLoading || isCreatorStatusLoading;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      toast.error("You must be logged in to edit an event.");
      navigate('/login', { replace: true });
      return;
    }

    if (!event) {
        if (!error) {
            return;
        }
        toast.error("Event not found.");
        navigate('/events', { replace: true });
        return;
    }
    
    const isOwner = event.creator?.id === user.id;

    if (!isOwner && !isAdmin) {
      toast.error("You are not authorized to edit this event.");
      navigate('/profile', { replace: true });
    }

  }, [user, event, isLoading, navigate, isAdmin, error]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton defaultPath="/profile" />
        <div className="mb-8 mt-4">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Event</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Loading event details...
          </p>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6 mt-8 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  const isOwner = event?.creator?.id === user?.id;
  if (!event || (!isOwner && !isAdmin)) {
    return null; // Redirecting...
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton defaultPath="/profile" />
      <div className="mb-8 mt-4">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Event</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Update your event details and information.
        </p>
      </div>
      
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <EventForm eventId={eventId} isEditMode={true} initialData={event} />
      </div>
    </div>
  );
};

export default EditEvent;
