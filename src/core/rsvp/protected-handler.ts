
/**
 * CRITICAL: PROTECTED RSVP HANDLER
 * 
 * ⚠️  WARNING: This is the core RSVP handler that MUST NOT be modified
 * ⚠️  All RSVP operations should go through this protected interface
 * ⚠️  Breaking changes here will affect the entire RSVP system
 */

import { useCallback, useReducer, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { RsvpStatus, IRsvpHandler } from './types';
import { rsvpReducer, initialRsvpState, validateStateMachine } from './state-machine';
import { emitRsvpEvent } from './event-system';
import { RSVP_CONFIG, RSVP_CONSTANTS } from './config';

/**
 * CRITICAL: Protected RSVP Handler Hook
 * 
 * This hook provides the core RSVP functionality with built-in protection
 * against common issues like race conditions, state corruption, and cache invalidation.
 */
export function useProtectedRsvpHandler(userId: string | undefined): IRsvpHandler {
  const [state, dispatch] = useReducer(rsvpReducer, initialRsvpState);
  const queryClient = useQueryClient();
  const operationRef = useRef<Promise<boolean> | null>(null);
  
  // Validate state machine integrity on each render
  useEffect(() => {
    if (!validateStateMachine(state)) {
      console.error('❌ RSVP State Machine Integrity Check Failed');
      dispatch({ type: 'RESET' });
    }
  }, [state]);

  // Emit events for state changes
  useEffect(() => {
    if (state.currentState === 'SUCCESS' && state.eventId && state.status) {
      emitRsvpEvent.completed(state.eventId, state.status, true);
    } else if (state.currentState === 'ERROR' && state.eventId && state.error) {
      emitRsvpEvent.error(state.eventId, state.error);
    }
  }, [state]);

  /**
   * CRITICAL: Core RSVP Handler
   * 
   * ⚠️  WARNING: This function handles all RSVP operations
   * ⚠️  Modifying this can break RSVP functionality across the app
   */
  const handleRsvp = useCallback(async (eventId: string, status: RsvpStatus): Promise<boolean> => {
    // Prevent multiple concurrent operations
    if (operationRef.current) {
      console.warn('⚠️  RSVP operation already in progress');
      return false;
    }

    if (!userId) {
      console.warn('⚠️  No user ID provided for RSVP');
      return false;
    }

    // Start the operation
    dispatch({ type: 'START_RSVP', payload: { eventId, status } });
    emitRsvpEvent.started(eventId, status);

    // Store state for restoration
    const scrollPosition = window.scrollY;
    const urlParams = window.location.search;
    
    // Set global flag
    if (typeof window !== 'undefined') {
      (window as any)[RSVP_CONSTANTS.GLOBAL_FLAGS.RSVP_IN_PROGRESS] = true;
    }

    const operation = async (): Promise<boolean> => {
      try {
        // Check existing RSVP
        const { data: existingRsvp, error: checkError } = await supabase
          .from('event_rsvps')
          .select('*')
          .eq('user_id', userId)
          .eq('event_id', eventId)
          .maybeSingle();

        if (checkError) throw checkError;

        let newStatus: RsvpStatus = status;
        
        // Toggle logic
        if (existingRsvp?.status === status) {
          newStatus = null;
        }

        // Perform database operation
        if (newStatus === null && existingRsvp) {
          // Delete RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .delete()
            .eq('id', existingRsvp.id);
          if (error) throw error;
        } else if (existingRsvp) {
          // Update RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .update({ status: newStatus })
            .eq('id', existingRsvp.id);
          if (error) throw error;
        } else if (newStatus) {
          // Create RSVP
          const { error } = await supabase
            .from('event_rsvps')
            .insert({ user_id: userId, event_id: eventId, status: newStatus });
          if (error) throw error;
        }

        // Update cache with surgical precision
        queryClient.setQueryData([RSVP_CONSTANTS.CACHE_KEYS.EVENT_DETAIL, eventId], (oldData: any) => {
          if (!oldData) return oldData;
          return { ...oldData, rsvp_status: newStatus };
        });

        // Update events list cache
        queryClient.setQueriesData({ queryKey: [RSVP_CONSTANTS.CACHE_KEYS.EVENTS] }, (oldData: any) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((event: any) => 
            event.id === eventId ? { ...event, rsvp_status: newStatus } : event
          );
        });

        // Emit cache update event
        emitRsvpEvent.cacheUpdated(eventId, newStatus);

        // Restore state if needed
        if (RSVP_CONFIG.preserveScrollPosition && Math.abs(window.scrollY - scrollPosition) > 50) {
          window.scrollTo({ top: scrollPosition, behavior: 'auto' });
        }

        if (RSVP_CONFIG.preserveFilters && window.location.search !== urlParams) {
          window.history.replaceState({}, '', `${window.location.pathname}${urlParams}`);
        }

        dispatch({ type: 'RSVP_SUCCESS', payload: { eventId, newStatus } });
        return true;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        dispatch({ type: 'RSVP_ERROR', payload: { eventId, error: errorMessage } });
        return false;
      }
    };

    operationRef.current = operation();
    const result = await operationRef.current;
    operationRef.current = null;

    // Reset global flag
    if (typeof window !== 'undefined') {
      (window as any)[RSVP_CONSTANTS.GLOBAL_FLAGS.RSVP_IN_PROGRESS] = false;
    }

    return result;
  }, [userId, queryClient]);

  return {
    handleRsvp,
    getCurrentStatus: useCallback((eventId: string) => {
      return state.eventId === eventId ? state.status : null;
    }, [state]),
    isLoading: useCallback((eventId?: string) => {
      return eventId ? 
        (state.eventId === eventId && (state.currentState === 'LOADING' || state.currentState === 'RETRYING')) :
        (state.currentState === 'LOADING' || state.currentState === 'RETRYING');
    }, [state]),
  };
}

/**
 * CRITICAL: Runtime Integrity Check
 * 
 * Call this function to verify the RSVP system hasn't been corrupted
 */
export function checkRsvpIntegrity(): boolean {
  console.log('🔒 Running RSVP System Integrity Check...');
  
  try {
    // Check if core functions exist
    if (typeof useProtectedRsvpHandler !== 'function') {
      throw new Error('useProtectedRsvpHandler is not available');
    }
    
    // Check if state machine is working
    const testState = rsvpReducer(initialRsvpState, { type: 'RESET' });
    if (!validateStateMachine(testState)) {
      throw new Error('State machine validation failed');
    }
    
    console.log('✅ RSVP System Integrity Check Passed');
    return true;
  } catch (error) {
    console.error('❌ RSVP System Integrity Check Failed:', error);
    return false;
  }
}
