
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { RequestCreatorForm } from './RequestCreatorForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const OrganiseContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    canCreateEvents, 
    creatorRequestStatus, 
    isLoading: statusLoading 
  } = useCreatorStatus();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600">You need to be signed in to organize events.</p>
        </div>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  const hasRequestPending = creatorRequestStatus === 'pending';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Organize Events</h1>
        
        {canCreateEvents ? (
          <div className="space-y-6">
            <p className="text-lg text-gray-600 mb-8">
              Ready to create your next event? Start organizing and bring people together.
            </p>
            <Button 
              onClick={() => navigate('/events/create')}
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Event
            </Button>
          </div>
        ) : hasRequestPending ? (
          <div className="py-8">
            <h2 className="text-xl font-semibold mb-4">Request Pending</h2>
            <p className="text-gray-600">
              Your request for creator access is being reviewed. We'll notify you once it's approved.
            </p>
          </div>
        ) : (
          <RequestCreatorForm />
        )}
      </div>
    </div>
  );
};
