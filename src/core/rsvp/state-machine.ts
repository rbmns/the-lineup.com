
/**
 * CRITICAL: RSVP STATE MACHINE
 * 
 * ⚠️  WARNING: This state machine controls RSVP behavior
 * ⚠️  Modifying state transitions can break the RSVP system
 */

import { RsvpState, RsvpAction } from './types';
import { RSVP_CONFIG } from './config';

export interface RsvpMachineState {
  currentState: RsvpState;
  eventId: string | null;
  status: 'Going' | 'Interested' | null;
  error: string | null;
  retryCount: number;
}

export const initialRsvpState: RsvpMachineState = {
  currentState: 'IDLE',
  eventId: null,
  status: null,
  error: null,
  retryCount: 0,
};

/**
 * CRITICAL: RSVP State Reducer
 * 
 * ⚠️  WARNING: This function controls all RSVP state transitions
 * ⚠️  Do not modify without understanding the full impact
 */
export function rsvpReducer(state: RsvpMachineState, action: RsvpAction): RsvpMachineState {
  console.log('🔄 RSVP State Transition:', state.currentState, '->', action.type);
  
  switch (action.type) {
    case 'START_RSVP':
      if (state.currentState !== 'IDLE' && state.currentState !== 'ERROR') {
        console.warn('⚠️  Invalid RSVP state transition: Cannot start RSVP from', state.currentState);
        return state;
      }
      return {
        ...state,
        currentState: 'LOADING',
        eventId: action.payload.eventId,
        status: action.payload.status,
        error: null,
        retryCount: 0,
      };

    case 'RSVP_SUCCESS':
      if (state.currentState !== 'LOADING' && state.currentState !== 'RETRYING') {
        console.warn('⚠️  Invalid RSVP state transition: Cannot succeed from', state.currentState);
        return state;
      }
      return {
        ...state,
        currentState: 'SUCCESS',
        status: action.payload.newStatus,
        error: null,
      };

    case 'RSVP_ERROR':
      if (state.currentState !== 'LOADING' && state.currentState !== 'RETRYING') {
        console.warn('⚠️  Invalid RSVP state transition: Cannot error from', state.currentState);
        return state;
      }
      return {
        ...state,
        currentState: 'ERROR',
        error: action.payload.error,
      };

    case 'RETRY':
      if (state.currentState !== 'ERROR') {
        console.warn('⚠️  Invalid RSVP state transition: Cannot retry from', state.currentState);
        return state;
      }
      if (state.retryCount >= RSVP_CONFIG.maxRetries) {
        console.warn('⚠️  Maximum RSVP retries exceeded');
        return state;
      }
      return {
        ...state,
        currentState: 'RETRYING',
        retryCount: state.retryCount + 1,
        error: null,
      };

    case 'RESET':
      return initialRsvpState;

    default:
      console.warn('⚠️  Unknown RSVP action type:', action);
      return state;
  }
}

/**
 * CRITICAL: State Machine Validator
 * 
 * Ensures state machine integrity
 */
export function validateStateMachine(state: RsvpMachineState): boolean {
  const validStates: RsvpState[] = ['IDLE', 'LOADING', 'SUCCESS', 'ERROR', 'RETRYING'];
  
  if (!validStates.includes(state.currentState)) {
    console.error('❌ Invalid RSVP state:', state.currentState);
    return false;
  }
  
  if (state.retryCount < 0 || state.retryCount > RSVP_CONFIG.maxRetries) {
    console.error('❌ Invalid RSVP retry count:', state.retryCount);
    return false;
  }
  
  return true;
}
