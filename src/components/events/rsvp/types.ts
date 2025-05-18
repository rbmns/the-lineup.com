
export type RsvpStatus = 'Going' | 'Interested' | null;

// Define a consistent type for RSVP handler functions
export type RsvpHandler = (status: 'Going' | 'Interested') => Promise<boolean>;
