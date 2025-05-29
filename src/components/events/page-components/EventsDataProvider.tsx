
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useEventProcessor } from '@/hooks/useEventProcessor';
import { useAuth } from '@/contexts/AuthContext';

interface EventsDataContextType {
  events: Event[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const EventsDataContext = createContext<EventsDataContextType | undefined>(undefined);

export const useEventsData = () => {
  const context = useContext(EventsDataContext);
  if (!context) {
    throw new Error('useEventsData must be used within an EventsDataProvider');
  }
  return context;
};

interface EventsDataProviderProps {
  children: ReactNode;
}

export const EventsDataProvider: React.FC<EventsDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { processEvent } = useEventProcessor();

  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*),
          creator:profiles(*),
          event_rsvps(*)
        `)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data?.map((eventData: any) => processEvent(eventData, user?.id)) || [];
    },
  });

  const contextValue: EventsDataContextType = {
    events,
    isLoading,
    error: error as Error | null,
    refetch,
  };

  return (
    <EventsDataContext.Provider value={contextValue}>
      {children}
    </EventsDataContext.Provider>
  );
};
