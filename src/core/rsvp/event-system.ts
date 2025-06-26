
/**
 * CRITICAL: RSVP EVENT SYSTEM
 * 
 * ⚠️  WARNING: This manages RSVP events across the application
 * ⚠️  Modifying this can break RSVP integrations
 */

import { RsvpEvent } from './types';

type RsvpEventListener = (event: RsvpEvent) => void;

class RsvpEventSystem {
  private listeners: Map<string, RsvpEventListener[]> = new Map();
  
  /**
   * CRITICAL: Subscribe to RSVP events
   */
  subscribe(eventType: string, listener: RsvpEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType)!.push(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }
  
  /**
   * CRITICAL: Emit RSVP events
   */
  emit(event: RsvpEvent): void {
    console.log('📡 RSVP Event:', event.type, event);
    
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('❌ RSVP Event Listener Error:', error);
        }
      });
    }
  }
  
  /**
   * CRITICAL: Clear all listeners (for testing)
   */
  clear(): void {
    this.listeners.clear();
  }
}

// Global RSVP event system instance
export const rsvpEvents = new RsvpEventSystem();

/**
 * CRITICAL: RSVP Event Helpers
 */
export const emitRsvpEvent = {
  started: (eventId: string, status: 'Going' | 'Interested') => 
    rsvpEvents.emit({ type: 'rsvp:started', eventId, status }),
  
  completed: (eventId: string, status: 'Going' | 'Interested' | null, success: boolean) => 
    rsvpEvents.emit({ type: 'rsvp:completed', eventId, status, success }),
  
  error: (eventId: string, error: string) => 
    rsvpEvents.emit({ type: 'rsvp:error', eventId, error }),
  
  cacheUpdated: (eventId: string, status: 'Going' | 'Interested' | null) => 
    rsvpEvents.emit({ type: 'rsvp:cache-updated', eventId, status }),
};
