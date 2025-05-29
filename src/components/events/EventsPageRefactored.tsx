
import React from 'react';
import { EventsPageHeader } from '@/components/events/EventsPageHeader';
import { useEventPageMeta } from '@/components/events/EventsPageMeta';
import { EventsDataProvider } from '@/components/events/page-components/EventsDataProvider';
import { EventsPageFilters } from '@/components/events/page-components/EventsPageFilters';
import { EventsResultsDisplay } from '@/components/events/page-components/EventsResultsDisplay';
import { FilterStateProvider } from '@/contexts/FilterStateContext';
import { useAuth } from '@/contexts/AuthContext';

const EventsPageRefactored = () => {
  useEventPageMeta();
  const { isAuthenticated } = useAuth();
  
  return (
    <FilterStateProvider>
      <div className="min-h-screen bg-gray-50">
        <EventsPageHeader 
          title="What's Happening?" 
          subtitle="Discover events in the Zandvoort area"
        />
        
        <div className="w-full px-4 md:px-6 py-4 md:py-8">
          <div className="max-w-7xl mx-auto">
            <EventsDataProvider>
              <div className="space-y-6">
                {/* Basic filters and results display for now */}
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-4">Events coming soon!</h2>
                  <p className="text-gray-600">We're working on loading your events.</p>
                </div>
              </div>
            </EventsDataProvider>
          </div>
        </div>
      </div>
    </FilterStateProvider>
  );
};

export default EventsPageRefactored;
