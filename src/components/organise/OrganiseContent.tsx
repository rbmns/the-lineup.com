
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { CreatorDashboard } from './CreatorDashboard';
import { RequestCreatorForm } from './RequestCreatorForm';
import { EventbriteEventsList } from '@/components/eventbrite/EventbriteEventsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const OrganiseContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    isCreator, 
    hasRequestPending, 
    isLoading: statusLoading 
  } = useCreatorStatus(user?.id);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Organize Events</h1>
        
        <Tabs defaultValue="eventbrite" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="eventbrite">Import from Eventbrite</TabsTrigger>
            <TabsTrigger value="create">Create Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="eventbrite" className="mt-6">
            <EventbriteEventsList />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            {isCreator ? (
              <CreatorDashboard />
            ) : hasRequestPending ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Request Pending</h2>
                <p className="text-gray-600">
                  Your request for creator access is being reviewed. We'll notify you once it's approved.
                </p>
              </div>
            ) : (
              <RequestCreatorForm />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
