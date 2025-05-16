
import React from 'react';
import LazyEventsList from '../LazyEventsList';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsLoadingState } from '../list-components/EventsLoadingState';
import NoResultsFound from '../list-components/NoResultsFound';
import { EventsEmptyState } from '../list-components/EventsEmptyState';
import EventsHeader from '../list-components/EventsHeader';
import EventsSignUpTeaser from '../list-components/EventsSignUpTeaser';
import { useAuth } from '@/contexts/AuthContext';

// First, let's create the CategoryFilterBar component
import { Button as ButtonUI } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategories,
  onCategoryChange,
  onClearFilters
}) => {
  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {selectedCategories.map(category => (
        <ButtonUI
          key={category}
          variant="secondary"
          size="sm"
          className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center"
          onClick={() => onCategoryChange(category)}
        >
          {category}
          <X className="ml-1 h-3 w-3" />
        </ButtonUI>
      ))}
      
      {selectedCategories.length > 0 && (
        <ButtonUI
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-600"
        >
          Clear all
        </ButtonUI>
      )}
    </div>
  );
};

interface CategoryFilteredEventsContentProps {
  mainEvents: Event[];
  relatedEvents?: Event[];
  isLoading: boolean;
  onRsvp?: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons?: boolean;
  hasActiveFilters?: boolean;
  loadingEventId?: string | null;
  searchQuery?: string;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onClearFilters: () => void;
  showSignUpTeaser?: boolean;
  title?: string;
  subtitle?: string;
  emptyStateMessage?: string;
  showHeader?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  showTabs?: boolean;
}

const CategoryFilteredEventsContent: React.FC<CategoryFilteredEventsContentProps> = ({
  mainEvents,
  relatedEvents = [],
  isLoading,
  onRsvp,
  showRsvpButtons = false,
  hasActiveFilters = false,
  loadingEventId,
  searchQuery = '',
  selectedCategories,
  onCategoryChange,
  onClearFilters,
  showSignUpTeaser = false,
  title = 'Events',
  subtitle,
  emptyStateMessage = 'No events found',
  showHeader = true,
  activeTab = 'all',
  onTabChange,
  showTabs = false
}) => {
  const { user } = useAuth();
  const hasEvents = mainEvents.length > 0;
  const hasRelatedEvents = relatedEvents.length > 0;
  
  // Determine if we should show the sign-up teaser
  const shouldShowTeaser = showSignUpTeaser && !user;
  
  // Determine if we should render the teaser after a certain row
  const renderTeaserAfterRow = shouldShowTeaser ? 1 : false;
  
  if (isLoading) {
    return <EventsLoadingState />;
  }
  
  return (
    <div className="space-y-6">
      {showHeader && (
        <EventsHeader 
          title={title}
          subtitle={subtitle}
        />
      )}
      
      <CategoryFilterBar
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
        onClearFilters={onClearFilters}
      />
      
      {showTabs && (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {!hasEvents && !isLoading && (
              hasActiveFilters ? (
                <NoResultsFound 
                  message={`No events match your filters`}
                  searchQuery={searchQuery}
                  resetFilters={onClearFilters}
                />
              ) : (
                <EventsEmptyState message={emptyStateMessage} />
              )
            )}
            
            {hasEvents && (
              <LazyEventsList
                events={mainEvents}
                isLoading={isLoading}
                onRsvp={onRsvp}
                showRsvpButtons={showRsvpButtons}
                loadingEventId={loadingEventId}
                renderTeaserAfterRow={renderTeaserAfterRow}
                showTeaser={shouldShowTeaser}
                teaser={<EventsSignUpTeaser />}
                searchQuery={searchQuery}
              />
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-6">
            {!hasRelatedEvents && !isLoading && (
              <NoResultsFound 
                message="No recommended events found"
                searchQuery=""
              />
            )}
            
            {hasRelatedEvents && (
              <LazyEventsList
                events={relatedEvents}
                isLoading={isLoading}
                onRsvp={onRsvp}
                showRsvpButtons={showRsvpButtons}
                loadingEventId={loadingEventId}
                renderTeaserAfterRow={renderTeaserAfterRow}
                showTeaser={shouldShowTeaser}
                teaser={<EventsSignUpTeaser />}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {!showTabs && (
        <>
          {!hasEvents && !isLoading && (
            hasActiveFilters ? (
              <NoResultsFound 
                message={`No events match your filters`}
                searchQuery={searchQuery}
                resetFilters={onClearFilters}
              />
            ) : (
              <EventsEmptyState message={emptyStateMessage} />
            )
          )}
          
          {hasEvents && (
            <LazyEventsList
              events={mainEvents}
              isLoading={isLoading}
              onRsvp={onRsvp}
              showRsvpButtons={showRsvpButtons}
              loadingEventId={loadingEventId}
              renderTeaserAfterRow={renderTeaserAfterRow}
              showTeaser={shouldShowTeaser}
              teaser={<EventsSignUpTeaser />}
              searchQuery={searchQuery}
            />
          )}
        </>
      )}
      
      {hasActiveFilters && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="text-sm"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilteredEventsContent;
export { CategoryFilteredEventsContent };
