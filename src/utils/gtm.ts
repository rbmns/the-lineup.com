
/**
 * Google Tag Manager utilities
 */

// Push an event to the dataLayer
export const pushToDataLayer = (data: Record<string, any>): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page view with GTM
export const trackPageView = (path: string, title?: string): void => {
  pushToDataLayer({
    event: 'virtualPageview',
    page: {
      path,
      title: title || document.title
    }
  });
};

// Track event with GTM - updated to accept category string and properties object
export const trackEvent = (
  eventCategory: string, 
  eventProperties?: Record<string, any>
): void => {
  pushToDataLayer({
    event: 'trackEvent',
    eventCategory,
    ...eventProperties
  });
};

// Track user login
export const trackLogin = (method: string): void => {
  pushToDataLayer({
    event: 'login',
    method
  });
};

// Track user signup
export const trackSignup = (method: string): void => {
  pushToDataLayer({
    event: 'signup',
    method
  });
};

// Track RSVP action
export const trackRsvp = (eventId: string, status: string): void => {
  pushToDataLayer({
    event: 'rsvp',
    eventId,
    status
  });
};
