
import React, { useState } from 'react';
import { FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 p-0 h-auto font-medium text-gray-700 hover:text-gray-900"
          type="button"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Optional Additional Info
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4 pt-4 border-t border-gray-200">
        {/* Fee & Booking Link */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
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
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    type="url"
                    placeholder="https://booking-website.com"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Extra Info */}
        <FormField
          control={form.control}
          name="extra_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Extra Info
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Extra information about your event..."
                  className="min-h-[100px] resize-none"
                  rows={4}
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
                Tags
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-600">
                Add relevant tags to help people find your event
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
