// Re-export all sharing utilities from the dedicated sharing folder
export * from '../sharing';

// RSVP sharing utilities
export const generateRsvpShareText = (eventTitle: string, status: 'Going' | 'Interested'): string => {
  return `I'm ${status.toLowerCase()} to ${eventTitle}! Join me!`;
};

// Other RSVP-specific utilities can be added here
