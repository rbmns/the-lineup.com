
import { NavigateFunction } from 'react-router-dom';

export const navigateToUserProfile = (userId: string, navigate: NavigateFunction) => {
  if (!userId) {
    console.error('Cannot navigate to profile: userId is required');
    return;
  }
  
  console.log(`Navigating to user profile: ${userId}`);
  navigate(`/user/${userId}`);
};

export const navigateToUsernameProfile = (username: string, navigate: NavigateFunction) => {
  if (!username) {
    console.error('Cannot navigate to profile: username is required');
    return;
  }
  
  console.log(`Navigating to username profile: ${username}`);
  navigate(`/profile/${username}`);
};

export const navigateToEvent = (eventId: string, navigate: NavigateFunction) => {
  if (!eventId) {
    console.error('Cannot navigate to event: eventId is required');
    return;
  }
  
  console.log(`Navigating to event: ${eventId}`);
  navigate(`/events/${eventId}`);
};

export const safeGoBack = (navigate: NavigateFunction, defaultPath: string = '/') => {
  try {
    // Check if there's a previous page in the history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(defaultPath);
    }
  } catch (error) {
    console.error('Error during navigation:', error);
    navigate(defaultPath);
  }
};

export const updateUrlParameters = (filterState: any, navigate: NavigateFunction, pathname: string) => {
  const params = new URLSearchParams();
  
  // Add event types
  if (filterState.eventTypes?.length > 0) {
    filterState.eventTypes.forEach((type: string) => {
      params.append('type', type);
    });
  }
  
  // Add venues
  if (filterState.venues?.length > 0) {
    filterState.venues.forEach((venue: string) => {
      params.append('venue', venue);
    });
  }
  
  // Add date filter
  if (filterState.dateFilter) {
    params.set('dateFilter', filterState.dateFilter);
  }
  
  // Add date range
  if (filterState.dateRange?.from) {
    params.set('dateFrom', filterState.dateRange.from.toISOString());
    if (filterState.dateRange.to) {
      params.set('dateTo', filterState.dateRange.to.toISOString());
    }
  }
  
  const searchString = params.toString();
  const newUrl = searchString ? `${pathname}?${searchString}` : pathname;
  
  navigate(newUrl, { replace: true });
};
