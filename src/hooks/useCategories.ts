
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface UseCategoriesResult {
  categories: Category[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const useCategories = (): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // For the purpose of this example, we'll extract unique event types from the events table
        // In a real app, this might be a dedicated categories table
        const { data, error } = await supabase
          .from('events')
          .select('event_type')
          .not('event_type', 'is', null);
          
        if (error) throw error;
        
        // Extract unique categories and transform them
        const uniqueCategories = [...new Set(data.map(item => item.event_type))];
        const formattedCategories = uniqueCategories
          .filter(Boolean)
          .map(name => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setCategories(formattedCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};

export default useCategories;
