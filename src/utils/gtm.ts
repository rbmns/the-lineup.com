
/**
 * Google Tag Manager utilities
 */

// Initialize the dataLayer array if it doesn't exist
export const initializeDataLayer = (): void => {
  window.dataLayer = window.dataLayer || [];
};

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

// Track event with GTM
export const trackEvent = (
  category: string, 
  action: string, 
  label?: string, 
  value?: number
): void => {
  pushToDataLayer({
    event: 'trackEvent',
    eventCategory: category,
    eventAction: action,
    eventLabel: label,
    eventValue: value
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
