import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface TrackingEvent {
  event_name: string;
  event_data?: Record<string, any>;
  user_id?: string;
  anonymous_id?: string;
  page_url?: string;
  session_id?: string;
}

export interface BookingLinkClickEvent {
  event_id: string;
  event_title: string;
  booking_url: string;
  user_id?: string;
  source_page: string;
}

class TrackingService {
  private sessionId: string;
  private anonymousId: string;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.anonymousId = this.getOrCreateAnonymousId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('tracking_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tracking_session_id', sessionId);
    }
    return sessionId;
  }

  private getOrCreateAnonymousId(): string {
    let anonymousId = localStorage.getItem('tracking_anonymous_id');
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('tracking_anonymous_id', anonymousId);
    }
    return anonymousId;
  }

  private getCurrentUserId(): string | null {
    // Get current user from auth context
    const authData = localStorage.getItem('supabase.auth.token');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async saveToDatabase(eventData: TrackingEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activity')
        .insert([{
          event_name: eventData.event_name,
          event_data: eventData.event_data || {},
          user_id: eventData.user_id || this.getCurrentUserId(),
          anonymous_id: this.anonymousId,
          session_id: this.sessionId,
          page_url: eventData.page_url || window.location.href,
          ip_address: null, // Will be filled by database/edge function if needed
          user_agent: navigator.userAgent,
        }]);

      if (error) {
        console.error('Error saving tracking event to database:', error);
      }
    } catch (error) {
      console.error('Error saving tracking event:', error);
    }
  }

  private sendToGTM(eventData: TrackingEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Check if user has consented to analytics
      const hasConsented = localStorage.getItem('cookie-consent') === 'true';
      
      if (hasConsented) {
        window.dataLayer.push({
          event: 'custom_tracking_event',
          event_name: eventData.event_name,
          event_data: eventData.event_data,
          user_id: eventData.user_id || this.getCurrentUserId(),
          anonymous_id: this.anonymousId,
          session_id: this.sessionId,
          page_url: eventData.page_url || window.location.href,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  public async trackEvent(eventName: string, eventData?: Record<string, any>, userId?: string): Promise<void> {
    const trackingEvent: TrackingEvent = {
      event_name: eventName,
      event_data: eventData,
      user_id: userId,
      page_url: window.location.href,
      session_id: this.sessionId,
      anonymous_id: this.anonymousId,
    };

    // Send to both database and GTM
    await Promise.all([
      this.saveToDatabase(trackingEvent),
      Promise.resolve(this.sendToGTM(trackingEvent))
    ]);

    console.log('Tracked event:', eventName, eventData);
  }

  // Specific tracking methods for different actions

  public async trackEventCreation(eventData: {
    event_id: string;
    event_title: string;
    event_category: string;
    event_vibe: string;
    destination: string;
    creator_id: string;
  }): Promise<void> {
    await this.trackEvent('event_created', {
      event_id: eventData.event_id,
      event_title: eventData.event_title,
      event_category: eventData.event_category,
      event_vibe: eventData.event_vibe,
      destination: eventData.destination,
      creator_id: eventData.creator_id,
    });
  }

  public async trackEventEdit(eventData: {
    event_id: string;
    event_title: string;
    changes_made: string[];
    editor_id: string;
  }): Promise<void> {
    await this.trackEvent('event_edited', {
      event_id: eventData.event_id,
      event_title: eventData.event_title,
      changes_made: eventData.changes_made,
      editor_id: eventData.editor_id,
    });
  }

  public async trackBookingLinkClick(linkData: BookingLinkClickEvent): Promise<void> {
    await this.trackEvent('booking_link_clicked', {
      event_id: linkData.event_id,
      event_title: linkData.event_title,
      booking_url: linkData.booking_url,
      source_page: linkData.source_page,
      click_timestamp: new Date().toISOString(),
    });

    // Also send to GTM with special handling for external link tracking
    if (typeof window !== 'undefined' && window.gtag) {
      const hasConsented = localStorage.getItem('cookie-consent') === 'true';
      if (hasConsented) {
        window.gtag('event', 'click', {
          event_category: 'external_booking',
          event_label: linkData.booking_url,
          custom_parameters: {
            event_id: linkData.event_id,
            event_title: linkData.event_title,
            source_page: linkData.source_page,
          }
        });
      }
    }
  }

  public async trackRSVP(rsvpData: {
    event_id: string;
    event_title: string;
    rsvp_status: 'Going' | 'Interested' | null;
    previous_status: 'Going' | 'Interested' | null;
    user_id: string;
  }): Promise<void> {
    await this.trackEvent('event_rsvp', {
      event_id: rsvpData.event_id,
      event_title: rsvpData.event_title,
      rsvp_status: rsvpData.rsvp_status,
      previous_status: rsvpData.previous_status,
      action: rsvpData.rsvp_status ? 'rsvp_added' : 'rsvp_removed',
    }, rsvpData.user_id);
  }

  public async trackPageView(pageName?: string): Promise<void> {
    await this.trackEvent('page_view', {
      page_name: pageName || document.title,
      page_path: window.location.pathname,
      page_search: window.location.search,
      referrer: document.referrer,
    });
  }

  public async trackSearch(searchData: {
    query: string;
    filters_applied?: Record<string, any>;
    results_count?: number;
    result_clicked?: string;
  }): Promise<void> {
    await this.trackEvent('search_performed', {
      query: searchData.query,
      filters_applied: searchData.filters_applied,
      results_count: searchData.results_count,
      result_clicked: searchData.result_clicked,
    });

    // Also save to the dedicated search_tracking table
    if (searchData.result_clicked) {
      try {
        await supabase
          .from('search_tracking')
          .insert([{
            query: searchData.query,
            result_id: searchData.result_clicked,
            result_type: 'event',
            clicked: true,
            user_id: this.getCurrentUserId(),
          }]);
      } catch (error) {
        console.error('Error saving search tracking:', error);
      }
    }
  }

  public async trackUserRegistration(userData: {
    user_id: string;
    signup_method: 'email' | 'google';
    referrer_source?: string;
  }): Promise<void> {
    await this.trackEvent('user_registered', {
      user_id: userData.user_id,
      signup_method: userData.signup_method,
      referrer_source: userData.referrer_source || document.referrer,
    }, userData.user_id);
  }

  public async trackUserLogin(userData: {
    user_id: string;
    login_method: 'email' | 'google';
  }): Promise<void> {
    await this.trackEvent('user_logged_in', {
      user_id: userData.user_id,
      login_method: userData.login_method,
    }, userData.user_id);
  }

  public async trackFeatureUsage(featureData: {
    feature_name: string;
    feature_category: string;
    action: string;
    additional_data?: Record<string, any>;
  }): Promise<void> {
    await this.trackEvent('feature_used', {
      feature_name: featureData.feature_name,
      feature_category: featureData.feature_category,
      action: featureData.action,
      ...featureData.additional_data,
    });
  }
}

// Export singleton instance
export const trackingService = new TrackingService();

// Convenience hook for React components
export const useTracking = () => {
  return {
    trackEvent: trackingService.trackEvent.bind(trackingService),
    trackEventCreation: trackingService.trackEventCreation.bind(trackingService),
    trackEventEdit: trackingService.trackEventEdit.bind(trackingService),
    trackBookingLinkClick: trackingService.trackBookingLinkClick.bind(trackingService),
    trackRSVP: trackingService.trackRSVP.bind(trackingService),
    trackPageView: trackingService.trackPageView.bind(trackingService),
    trackSearch: trackingService.trackSearch.bind(trackingService),
    trackUserRegistration: trackingService.trackUserRegistration.bind(trackingService),
    trackUserLogin: trackingService.trackUserLogin.bind(trackingService),
    trackFeatureUsage: trackingService.trackFeatureUsage.bind(trackingService),
  };
};