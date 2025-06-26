
/**
 * CRITICAL: RSVP SYSTEM CONFIGURATION
 * 
 * ⚠️  WARNING: Modifying these values can affect RSVP system behavior
 * ⚠️  Test thoroughly after any changes
 */

import { RsvpConfig } from './types';

export const RSVP_CONFIG: RsvpConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  optimisticUpdates: true,
  preserveScrollPosition: true,
  preserveFilters: true,
} as const;

// RSVP System Constants - DO NOT MODIFY
export const RSVP_CONSTANTS = {
  CACHE_KEYS: {
    EVENTS: 'events',
    EVENT_DETAIL: 'event',
    ATTENDEES: 'event-attendees',
  },
  EVENT_NAMES: {
    RSVP_STARTED: 'rsvp:started',
    RSVP_COMPLETED: 'rsvp:completed',
    RSVP_ERROR: 'rsvp:error',
    CACHE_UPDATED: 'rsvp:cache-updated',
  },
  GLOBAL_FLAGS: {
    RSVP_IN_PROGRESS: 'rsvpInProgress',
  },
} as const;

/**
 * CRITICAL: Configuration validation
 * 
 * This ensures the configuration is valid and hasn't been corrupted
 */
export function validateRsvpConfig(config: RsvpConfig): boolean {
  if (config.maxRetries < 0 || config.maxRetries > 10) {
    console.error('❌ Invalid RSVP config: maxRetries must be between 0 and 10');
    return false;
  }
  
  if (config.retryDelay < 100 || config.retryDelay > 10000) {
    console.error('❌ Invalid RSVP config: retryDelay must be between 100ms and 10s');
    return false;
  }
  
  return true;
}

// Validate config on import
if (!validateRsvpConfig(RSVP_CONFIG)) {
  throw new Error('RSVP Configuration is invalid');
}
