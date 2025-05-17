
import { supabase } from '@/lib/supabase';
import { pushToDataLayer } from './gtm';

interface PageViewData {
  page: string;
  referrer?: string;
  user_id?: string | null;
  session_id: string;
  timestamp: string;
  user_agent?: string;
}

/**
 * Generate a unique session ID if one doesn't exist
 * This helps track anonymous users across pages in the same session
 */
function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

/**
 * Track a page view using Supabase
 */
export async function trackPageView(page: string) {
  try {
    // Don't track if the user declined cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'false') return;

    // Use the correct API to get session information
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id || null;
    const sessionId = getOrCreateSessionId();

    // Prepare the data for the page view
    const pageViewData: PageViewData = {
      page,
      user_id: userId,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent
    };

    // Log the pageview to the server
    console.log('Tracking page view:', pageViewData);
    
    // We'll use a custom tracking RPC function in Supabase
    await supabase.rpc('track_page_view', pageViewData);
    
    // No need to call GTM here as it's handled in PageViewTracker component
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track a specific user event or interaction
 */
export async function trackEvent(eventName: string, eventData: Record<string, any> = {}) {
  try {
    // Don't track if the user declined cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'false') return;

    // Use the correct API to get session information
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user?.id || null;
    const sessionId = getOrCreateSessionId();

    // Prepare the data for the event
    const eventTrackingData = {
      event_name: eventName,
      user_id: userId,
      session_id: sessionId, 
      timestamp: new Date().toISOString(),
      properties: eventData
    };

    // Log the event to the server
    console.log('Tracking event:', eventTrackingData);
    
    // Track in Supabase
    await supabase.rpc('track_user_event', eventTrackingData);
    
    // Also track in GTM
    pushToDataLayer({
      event: 'trackEvent',
      eventCategory: eventName,
      eventAction: eventData.action || 'interact',
      eventLabel: eventData.label,
      eventValue: eventData.value
    });
    
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.error('Error tracking event:', error);
  }
}
