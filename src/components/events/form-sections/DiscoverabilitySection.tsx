import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CategoryToggleField } from './CategoryToggleField';
import { VibeToggleField } from './VibeToggleField';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const DiscoverabilitySection: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "bg-coastal-haze/30 rounded-lg border border-mist-grey shadow-sm",
      isMobile ? "p-3" : "p-6"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
        <h2 className={cn(
          "font-semibold text-ocean-teal",
          isMobile ? "text-base" : "text-xl"
        )}>Help people find your event</h2>
      </div>
      <p className="text-sm text-graphite-grey/70 mb-4">
        Add category, vibe, and tags to make your event easier to discover in search
      </p>
      
      <div className="space-y-4">
        {/* Category and Vibe */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <CategoryToggleField />
          <VibeToggleField />
        </div>

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Tags (comma separated)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="outdoor, sports, fun, beginner-friendly, family"
                  className={isMobile ? "h-11 text-base" : "h-10"}
                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const tags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];
                    field.onChange(tags);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};