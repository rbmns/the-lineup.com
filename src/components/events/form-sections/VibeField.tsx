
import React from 'react';
import { Control } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useEventVibes } from '@/hooks/useEventVibes';
import { Skeleton } from '@/components/ui/skeleton';

interface VibeFieldProps {
  control: Control<FormValues>;
}

const NO_VIBE_VALUE = '__NO_VIBE__';

export const VibeField: React.FC<VibeFieldProps> = ({ control }) => {
  const { data: vibes, isLoading, isError, error } = useEventVibes();

  console.log('VibeField - vibes data:', vibes, 'isLoading:', isLoading, 'isError:', isError);

  if (isLoading) {
    return (
      <FormItem>
        <Label htmlFor="vibe">Vibe</Label>
        <Skeleton className="h-10 w-full" />
      </FormItem>
    );
  }

  if (isError) {
    console.error('VibeField error:', error);
    return (
      <FormItem>
        <Label htmlFor="vibe">Vibe</Label>
        <div className="text-sm text-destructive p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="font-semibold">Error loading vibes</p>
          <p>{error?.message || 'Failed to load vibe options'}</p>
        </div>
      </FormItem>
    );
  }

  // Ensure we have vibes to display
  const vibeOptions = vibes && vibes.length > 0 ? vibes : ['party', 'chill', 'wellness', 'active', 'social', 'creative'];

  return (
    <FormField
      control={control}
      name="vibe"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="vibe">Vibe</Label>
          <Select 
            onValueChange={(value) => field.onChange(value === NO_VIBE_VALUE ? null : value)} 
            value={field.value ?? NO_VIBE_VALUE}
          >
            <FormControl>
              <SelectTrigger id="vibe">
                <SelectValue placeholder="Select a vibe for your event" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={NO_VIBE_VALUE}>
                <span className="text-muted-foreground">-- No Vibe --</span>
              </SelectItem>
              {vibeOptions.map((vibe) => (
                <SelectItem key={vibe} value={vibe}>
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
