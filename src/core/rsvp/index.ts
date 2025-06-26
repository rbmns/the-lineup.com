
/**
 * CRITICAL: RSVP SYSTEM MAIN EXPORT
 * 
 * ⚠️  WARNING: This is the main entry point for the RSVP system
 * ⚠️  Only import RSVP functionality through this file
 * ⚠️  Direct imports from other files may bypass protection mechanisms
 */

// Core types and interfaces
export type { RsvpStatus, RsvpState, IRsvpHandler, IRsvpCache } from './types';
export { validateRsvpSystemIntegrity } from './types';

// Configuration
export { RSVP_CONFIG, RSVP_CONSTANTS } from './config';

// Protected handler (main interface)
export { useProtectedRsvpHandler } from './protected-handler';

// Error boundary
export { RsvpErrorBoundary, withRsvpErrorBoundary } from './error-boundary';

// Event system
export { rsvpEvents, emitRsvpEvent } from './event-system';

// Monitoring
export { rsvpMonitor, logRsvpHealth, getRsvpMetrics, getRsvpHealthStatus } from './monitoring';

// Simple integrity check function
export const checkRsvpIntegrity = (): boolean => {
  try {
    // Import the constants within the function scope
    const { RSVP_CONFIG, RSVP_CONSTANTS } = require('./config');
    
    // Basic integrity checks
    if (typeof RSVP_CONFIG !== 'object') return false;
    if (typeof RSVP_CONSTANTS !== 'object') return false;
    return true;
  } catch (error) {
    console.error('RSVP integrity check failed:', error);
    return false;
  }
};

/**
 * CRITICAL: System Initialization
 * 
 * This runs when the RSVP system is imported and performs initial checks
 */
console.log('🔒 RSVP System Initialized - Version 1.0.0');
console.log('⚠️  WARNING: This system is protected - modifications may break functionality');

// Run initial integrity check
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    if (!checkRsvpIntegrity()) {
      console.error('🚨 RSVP System failed initial integrity check');
    }
  }, 1000);
}
