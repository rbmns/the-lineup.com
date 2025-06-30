
import React from 'react';
import { FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Plus } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
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
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 p-6 rounded-lg border border-ocean-teal/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 text-xl font-semibold text-ocean-teal hover:text-ocean-teal/80 transition-colors w-full text-left group"
          >
            <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
            <Plus className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-45"
            )} />
            Optional Information
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200 ml-auto",
              isOpen && "rotate-180"
            )} />
          </button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
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
                      className="h-11 border-2 border-mist-grey focus:border-ocean-teal"
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
                      className="h-11 border-2 border-mist-grey focus:border-ocean-teal"
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
                      className="h-11 border-2 border-mist-grey focus:border-ocean-teal"
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
                      className="h-11 border-2 border-mist-grey focus:border-ocean-teal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Extra Info - Full width */}
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
                    className="min-h-[120px] border-2 border-mist-grey focus:border-ocean-teal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
