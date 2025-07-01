
import { useState, useCallback } from 'react';
import { EventFormData } from '@/components/events/form/EventFormSchema';

const FORM_DATA_KEY = 'pending_event_creation';

export const useFormDataPersistence = () => {
  const [storedFormData, setStoredFormData] = useState<EventFormData | null>(null);

  const storeFormData = useCallback((data: EventFormData) => {
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
      setStoredFormData(data);
      console.log('📦 Form data stored for later submission');
    } catch (error) {
      console.error('Failed to store form data:', error);
    }
  }, []);

  const getStoredFormData = useCallback((): EventFormData | null => {
    try {
      const stored = localStorage.getItem(FORM_DATA_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setStoredFormData(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to retrieve stored form data:', error);
    }
    return null;
  }, []);

  const clearStoredFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
      setStoredFormData(null);
      console.log('🗑️ Stored form data cleared');
    } catch (error) {
      console.error('Failed to clear stored form data:', error);
    }
  }, []);

  const hasStoredFormData = useCallback(() => {
    return localStorage.getItem(FORM_DATA_KEY) !== null;
  }, []);

  return {
    storeFormData,
    getStoredFormData,
    clearStoredFormData,
    hasStoredFormData,
    storedFormData
  };
};
