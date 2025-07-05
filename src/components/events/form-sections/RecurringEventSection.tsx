import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const WEEKDAYS = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

export const RecurringEventSection: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();
  const isRecurring = form.watch('isRecurring');

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
        )}>Recurring Event</h2>
      </div>
      
      {/* Recurring Toggle */}
      <FormField
        control={form.control}
        name="isRecurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-4 bg-white/50 rounded-lg border border-ocean-teal/10">
            <div className="space-y-0.5">
              <FormLabel className="text-sm font-medium text-graphite-grey">
                This is a recurring event
              </FormLabel>
              <div className="text-sm text-graphite-grey/70">
                Create multiple events for different days of the week
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Recurring Event Fields - Only show when recurring is enabled */}
      {isRecurring && (
        <div className="mt-4 space-y-4">
          {/* Weekday Selector */}
          <FormField
            control={form.control}
            name="recurringDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Select Days *
                </FormLabel>
                <FormControl>
                  <div className={cn(
                    "grid gap-2",
                    isMobile ? "grid-cols-4" : "grid-cols-7"
                  )}>
                    {WEEKDAYS.map((day) => {
                      const isSelected = field.value?.includes(day.key) || false;
                      return (
                        <Button
                          key={day.key}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-10",
                            isSelected 
                              ? "bg-ocean-teal text-white hover:bg-ocean-teal/90" 
                              : "border-ocean-teal/20 hover:border-ocean-teal"
                          )}
                          onClick={() => {
                            const currentDays = field.value || [];
                            if (isSelected) {
                              field.onChange(currentDays.filter((d: string) => d !== day.key));
                            } else {
                              field.onChange([...currentDays, day.key]);
                            }
                          }}
                        >
                          {day.label}
                        </Button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Picker */}
          <FormField
            control={form.control}
            name="recurringTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-graphite-grey">
                  Time *
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="h-11 border-2 border-mist-grey focus:border-ocean-teal"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range */}
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            {/* Start Date */}
            <FormField
              control={form.control}
              name="recurringStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    Start Date *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 border-2 border-mist-grey focus:border-ocean-teal justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick start date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="recurringEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    End Date *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 border-2 border-mist-grey focus:border-ocean-teal justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick end date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues('recurringStartDate');
                          return date < (startDate || new Date());
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preview */}
          {isRecurring && form.watch('recurringDays')?.length > 0 && form.watch('recurringStartDate') && form.watch('recurringEndDate') && (
            <div className="p-4 bg-ocean-teal/5 rounded-lg border border-ocean-teal/20">
              <div className="text-sm font-medium text-ocean-teal mb-1">Preview</div>
              <div className="text-sm text-graphite-grey">
                This will create multiple events for the selected days between {' '}
                {form.watch('recurringStartDate') && format(form.watch('recurringStartDate'), "MMM d")} and {' '}
                {form.watch('recurringEndDate') && format(form.watch('recurringEndDate'), "MMM d, yyyy")}
                {form.watch('recurringTime') && ` at ${form.watch('recurringTime')}`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};