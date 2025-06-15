
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

export const VibeField: React.FC<VibeFieldProps> = ({ control }) => {
  const { data: vibes, isLoading } = useEventVibes();

  if (isLoading) {
    return (
      <FormItem>
        <Label htmlFor="vibe">Vibe</Label>
        <Skeleton className="h-10 w-full" />
      </FormItem>
    );
  }

  return (
    <FormField
      control={control}
      name="vibe"
      render={({ field }) => (
        <FormItem>
          <Label htmlFor="vibe">Vibe</Label>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger id="vibe">
                <SelectValue placeholder="Select a vibe for your event" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(vibes || []).map((vibe) => (
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
