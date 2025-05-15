
// Re-export all RSVP-related utilities
export * from './nativeShare';
export * from './clipboardUtils';
export * from './socialShare';

// Add type utility for RSVP status
export const safeRsvpStatusCast = (status: string | null | undefined): 'Going' | 'Interested' | undefined => {
  if (status === 'Going' || status === 'Interested') {
    return status;
  }
  return undefined;
};
