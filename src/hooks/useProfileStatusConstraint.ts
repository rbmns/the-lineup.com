
import { useState, useEffect } from 'react';

// Predefined status options that match what's in the database
const PREDEFINED_STATUS_OPTIONS = ['Traveler', 'Surfer', 'Digital Nomad', 'Yogi', 'Event Host', 'Other'];

export const useProfileStatusConstraint = () => {
  const [statusOptions, setStatusOptions] = useState<string[]>(PREDEFINED_STATUS_OPTIONS);
  const [loading, setLoading] = useState(false);

  // We're using the predefined options directly instead of fetching
  // This ensures the profile page loads immediately without refresh issues
  
  return { statusOptions, loading };
};
