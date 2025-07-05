
import { NavigateFunction } from 'react-router-dom';
import { DateRange } from 'react-day-picker';

export const navigateToUserProfile = (userId: string, navigate: NavigateFunction) => {
  navigate(`/user/${userId}`);
};

export const navigateToEvent = (eventId: string, navigate: NavigateFunction) => {
  if (!eventId) {
    console.error('Cannot navigate: Missing event ID');
    return;
  }
  navigate(`/events/${eventId}`);
};

export const safeGoBack = (navigate: NavigateFunction, defaultPath: string = '/events') => {
  try {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(defaultPath);
    }
  } catch (error) {
    console.error('Navigation error:', error);
    navigate(defaultPath);
  }
};

interface FilterState {
  eventTypes: string[];
  venues: string[];
  dateRange?: DateRange;
  dateFilter: string;
}

export const updateUrlParameters = (
  filterState: FilterState,
  navigate: NavigateFunction,
  pathname: string
) => {
  const searchParams = new URLSearchParams();
  
  // Add event types
  filterState.eventTypes.forEach(type => {
    searchParams.append('type', type);
  });
  
  // Add venues
  filterState.venues.forEach(venue => {
    searchParams.append('venue', venue);
  });
  
  // Add date filter
  if (filterState.dateFilter) {
    searchParams.set('dateFilter', filterState.dateFilter);
  }
  
  // Add date range
  if (filterState.dateRange?.from) {
    searchParams.set('dateFrom', filterState.dateRange.from.toISOString());
  }
  if (filterState.dateRange?.to) {
    searchParams.set('dateTo', filterState.dateRange.to.toISOString());
  }
  
  const newUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  navigate(newUrl, { replace: true });
};
