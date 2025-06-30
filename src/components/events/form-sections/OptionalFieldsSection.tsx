
import React from 'react';
import { FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

interface OptionalFieldsSectionProps {
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export const OptionalFieldsSection: React.FC<OptionalFieldsSectionProps> = ({ 
  errors, 
  control, 
  watch, 
  setValue 
}) => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <div className="border-t border-mist-grey pt-6">
        <h3 className="text-lg font-medium text-graphite-grey mb-4">Optional Information</h3>
        
        <div className="space-y-4">
          {/* Organizer Link */}
          <FormField
            control={form.control}
            name="organizer_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Organizer Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fee */}
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Fee (€)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Booking Link */}
          <FormField
            control={form.control}
            name="booking_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Booking Link
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/book"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="outdoor, sports, fun"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Extra Info */}
          <FormField
            control={form.control}
            name="extra_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Additional Information
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional details about your event..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
