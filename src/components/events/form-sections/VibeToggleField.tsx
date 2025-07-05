
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEventVibes } from '@/hooks/useEventVibes';
import { Skeleton } from '@/components/ui/skeleton';
import { useFormContext } from 'react-hook-form';

export const VibeToggleField: React.FC = () => {
  const form = useFormContext();
  const { vibes, isLoading, isError, error } = useEventVibes();

  if (isLoading) {
    return (
      <div>
        <FormLabel htmlFor="vibe">Event Vibe (Optional)</FormLabel>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('VibeToggleField error:', error);
    return (
      <div>
        <FormLabel htmlFor="vibe">Event Vibe (Optional)</FormLabel>
        <div className="text-sm text-destructive p-2 bg-destructive/10 border border-destructive/20 rounded-sm mt-2">
          <p className="font-semibold">Error loading vibes</p>
          <p>{error?.message || 'Failed to load vibe options'}</p>
        </div>
      </div>
    );
  }

  // Ensure we have vibes to display
  const vibeOptions = vibes && vibes.length > 0 ? vibes : ['party', 'chill', 'wellness', 'active', 'social', 'creative'];

  return (
    <FormField
      control={form.control}
      name="vibe"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="vibe">Event Vibe (Optional)</FormLabel>
          <FormControl>
            <ToggleGroup 
              type="single" 
              value={field.value || ""} 
              onValueChange={field.onChange}
              className="flex flex-wrap gap-1.5 mt-2"
            >
              {vibeOptions.map((vibe) => (
                <ToggleGroupItem
                  key={vibe}
                  value={vibe}
                  variant="outline"
                  className={`capitalize text-xs px-2 py-1.5 rounded-sm transition-colors ${
                    field.value === vibe 
                      ? 'bg-ocean-teal text-pure-white border-ocean-teal'
                      : 'bg-pure-white text-graphite-grey border-mist-grey hover:bg-coastal-haze hover:border-ocean-teal hover:text-ocean-teal'
                  }`}
                >
                  {vibe}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
