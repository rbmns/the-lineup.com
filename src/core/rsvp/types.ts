
/**
 * CRITICAL: RSVP SYSTEM CORE TYPES
 * 
 * ⚠️  WARNING: DO NOT MODIFY THESE TYPES WITHOUT UNDERSTANDING THE FULL IMPACT
 * ⚠️  These types are used throughout the RSVP system and changes can break functionality
 * ⚠️  If you need to modify, please review all usages and update integration tests
 */

import { z } from 'zod';

// Core RSVP Status Types
export type RsvpStatus = 'Going' | 'Interested' | null;

// RSVP State Machine States
export type RsvpState = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' | 'RETRYING';

// RSVP Action Types
export type RsvpAction = 
  | { type: 'START_RSVP'; payload: { eventId: string; status: RsvpStatus } }
  | { type: 'RSVP_SUCCESS'; payload: { eventId: string; newStatus: RsvpStatus } }
  | { type: 'RSVP_ERROR'; payload: { eventId: string; error: string } }
  | { type: 'RESET' }
  | { type: 'RETRY' };

// Runtime validation schemas
export const RsvpStatusSchema = z.enum(['Going', 'Interested']).nullable();

export const RsvpEventSchema = z.object({
  id: z.string(),
  rsvp_status: RsvpStatusSchema,
});

export const RsvpRequestSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  status: z.enum(['Going', 'Interested']),
});

// RSVP Configuration Interface
export interface RsvpConfig {
  readonly maxRetries: number;
  readonly retryDelay: number;
  readonly optimisticUpdates: boolean;
  readonly preserveScrollPosition: boolean;
  readonly preserveFilters: boolean;
}

// RSVP Handler Interface - MUST BE IMPLEMENTED BY ALL RSVP HANDLERS
export interface IRsvpHandler {
  handleRsvp(eventId: string, status: RsvpStatus): Promise<boolean>;
  getCurrentStatus(eventId: string): RsvpStatus;
  isLoading(eventId?: string): boolean;
}

// RSVP Cache Interface
export interface IRsvpCache {
  updateEventStatus(eventId: string, status: RsvpStatus): void;
  getEventStatus(eventId: string): RsvpStatus;
  invalidateEvent(eventId: string): void;
}

// RSVP Events for the event system
export type RsvpEvent = 
  | { type: 'rsvp:started'; eventId: string; status: RsvpStatus }
  | { type: 'rsvp:completed'; eventId: string; status: RsvpStatus; success: boolean }
  | { type: 'rsvp:error'; eventId: string; error: string }
  | { type: 'rsvp:cache-updated'; eventId: string; status: RsvpStatus };

/**
 * CRITICAL: RSVP SYSTEM INTEGRITY CHECK
 * 
 * This function should be called during development to ensure the RSVP system
 * maintains its integrity. Add this to your testing suite.
 */
export function validateRsvpSystemIntegrity(): boolean {
  console.warn('🔒 RSVP System Integrity Check - DO NOT REMOVE THIS WARNING');
  
  // Check if core types are still valid
  try {
    RsvpStatusSchema.parse('Going');
    RsvpStatusSchema.parse('Interested');
    RsvpStatusSchema.parse(null);
    return true;
  } catch (error) {
    console.error('❌ RSVP System Integrity FAILED:', error);
    return false;
  }
}
