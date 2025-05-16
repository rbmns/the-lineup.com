import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import { CategoryFilter } from '@/components/events/category-filters/CategoryFilter';
import { CategoryFilteredEventsContent } from '@/components/events/category-filters/CategoryFilteredEventsContent';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/utils/analytics';
import { SignUpTeaser } from '@/components/events/SignUpTeaser';
import { LazyEventsList } from '@/components/events/LazyEventsList';

const EventsPage: React.FC = () => {
  const [mainEvents, setMainEvents] = useState<Event[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const { user } = useAuth();
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  
  const renderTeaserAfterRow = 2;
  const showTeaser = true;
  const teaser = <SignUpTeaser />;

  // Fetch events on mount and when category changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching events:", error);
        } else {
          setMainEvents(data || []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedCategory]);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
      setHasActiveFilters(true);
    } else {
      setSearchParams({});
      setHasActiveFilters(false);
    }
  }, [selectedCategory, setSearchParams]);

  // Load category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Handle RSVP
  const onRsvp = useCallback(async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      alert("Please sign in to RSVP");
      return false;
    }
    
    setLoadingEventId(eventId);
    
    try {
      const { data, error } = await supabase
        .from('event_rsvps')
        .upsert(
          { 
            event_id: eventId, 
            user_id: user.id, 
            status: status,
            updated_at: new Date()
          },
          { onConflict: ['event_id', 'user_id'] }
        )
        .select()
      
      if (error) {
        console.error("Error updating RSVP:", error);
        alert("Failed to update RSVP");
        return false;
      } else {
        trackEvent('event_rsvp', { eventId: eventId, status: status });
        return true;
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
      alert("Failed to update RSVP");
      return false;
    } finally {
      setLoadingEventId(null);
    }
  }, [user]);
  
  const renderEventsList = () => {
    return (
      <LazyEventsList
        events={mainEvents}
        isLoading={isLoading}
        onRsvp={onRsvp}
        showRsvpButtons={true}
        renderTeaserAfterRow={renderTeaserAfterRow}
        showTeaser={showTeaser}
        teaser={teaser}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        hasActiveFilters={hasActiveFilters}
      />
      
      {selectedCategory ? (
        <CategoryFilteredEventsContent
          mainEvents={mainEvents}
          relatedEvents={relatedEvents}
          isLoading={isLoading}
          onRsvp={onRsvp}
          showRsvpButtons={true}
          hasActiveFilters={hasActiveFilters}
          loadingEventId={loadingEventId}
        />
      ) : (
        renderEventsList()
      )}
    </div>
  );
};

export default EventsPage;
