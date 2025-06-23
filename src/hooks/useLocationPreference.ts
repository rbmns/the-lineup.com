
import { useState, useEffect } from 'react';

const LOCATION_STORAGE_KEY = 'preferred_area_id';

export const useLocationPreference = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored && stored !== 'null') {
      setSelectedAreaId(stored);
    }
    setIsLoaded(true);
  }, []);

  // Save preference to localStorage when it changes
  const updateLocationPreference = (areaId: string | null) => {
    setSelectedAreaId(areaId);
    if (areaId) {
      localStorage.setItem(LOCATION_STORAGE_KEY, areaId);
    } else {
      localStorage.removeItem(LOCATION_STORAGE_KEY);
    }
  };

  return {
    selectedAreaId,
    updateLocationPreference,
    isLoaded
  };
};
