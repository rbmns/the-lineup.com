
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FlexibleStartTimeField } from './FlexibleStartTimeField';
import { EventFormData } from '@/components/events/form/EventFormSchema';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormData>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  form
}) => {
  const startDate = form.watch('startDate');
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
      isMobile ? "p-3" : "p-6"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
        <h2 className={cn(
          "font-semibold text-ocean-teal",
          isMobile ? "text-base" : "text-xl"
        )}>Date & Time</h2>
      </div>
      
      <div className="space-y-3">
        {/* Start Date and Time - Side by side on desktop, stacked on mobile */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Date *
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          isMobile ? "h-11 text-base" : "h-10"
                        )}
                      >
                        {field.value ? (
                          format(field.value, isMobile ? "MMM d, yyyy" : "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className={cn(
                      "w-auto p-0", 
                      isMobile && "w-screen max-w-sm"
                    )} 
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className={cn(
                        "pointer-events-auto",
                        isMobile && "w-full"
                      )}
                      classNames={{
                        months: isMobile ? "flex flex-col" : undefined,
                        month: isMobile ? "w-full" : undefined,
                        table: isMobile ? "w-full" : undefined,
                        head_cell: isMobile ? "text-xs w-full" : undefined,
                        cell: isMobile ? "w-full" : undefined,
                        day: isMobile ? "w-8 h-8 text-sm" : undefined,
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Time *
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className={cn(
                      "w-full bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Flexible Start Time Checkbox */}
        <FlexibleStartTimeField form={form} />

        {/* End Date and Time - Optional */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Date (optional)
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          isMobile ? "h-11 text-base" : "h-10"
                        )}
                      >
                        {field.value ? (
                          format(field.value, isMobile ? "MMM d, yyyy" : "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className={cn(
                      "w-auto p-0", 
                      isMobile && "w-screen max-w-sm"
                    )} 
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        startDate ? date < startDate : date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className={cn(
                        "pointer-events-auto",
                        isMobile && "w-full"
                      )}
                      classNames={{
                        months: isMobile ? "flex flex-col" : undefined,
                        month: isMobile ? "w-full" : undefined,
                        table: isMobile ? "w-full" : undefined,
                        head_cell: isMobile ? "text-xs w-full" : undefined,
                        cell: isMobile ? "w-full" : undefined,
                        day: isMobile ? "w-8 h-8 text-sm" : undefined,
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Time
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className={cn(
                      "w-full bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
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
