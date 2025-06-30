
import React, { useEffect } from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DateTimeFieldsProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ watch, setValue, errors }) => {
  const form = useFormContext<FormValues>();
  const isMobile = useIsMobile();
  const [showEndDate, setShowEndDate] = React.useState(false);
  
  const startDate = watch('start_date');
  const startTime = watch('start_time');
  
  // Auto-set end date to match start date when start date changes
  useEffect(() => {
    if (startDate && !showEndDate) {
      setValue('end_date', startDate);
    }
  }, [startDate, setValue, showEndDate]);

  // Auto-set end time to be 2 hours after start time when start time changes
  useEffect(() => {
    if (startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHours = (hours + 2) % 24;
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setValue('end_time', endTime);
    }
  }, [startTime, setValue]);

  const handleEndDateToggle = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setShowEndDate(isChecked);
  };
  
  return (
    <div className="bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 p-6 rounded-lg border border-ocean-teal/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-ocean-teal rounded-full"></div>
        <h2 className="text-xl font-semibold text-ocean-teal">Date & Time</h2>
      </div>
      
      <div className="space-y-6">
        {/* Start Date & Time */}
        <div>
          <h3 className="text-lg font-medium text-graphite-grey mb-4">Event Start</h3>
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    Start Date *
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onSelect={(date) => date && field.onChange(date)}
                      className="w-full h-11 border-2 border-mist-grey focus:border-ocean-teal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    Start Time *
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
          </div>
        </div>

        {/* End Date Toggle */}
        <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-md">
          <Checkbox
            id="show-end-date"
            checked={showEndDate}
            onCheckedChange={handleEndDateToggle}
          />
          <label
            htmlFor="show-end-date"
            className="text-sm font-medium text-graphite-grey cursor-pointer"
          >
            Event ends on a different date
          </label>
        </div>

        {/* End Date & Time */}
        <div>
          <h3 className="text-lg font-medium text-graphite-grey mb-4">Event End</h3>
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : showEndDate ? "grid-cols-2" : "grid-cols-1"
          )}>
            {/* End Date - Only show if checkbox is checked */}
            {showEndDate && (
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-graphite-grey">
                      End Date
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onSelect={(date) => date && field.onChange(date)}
                        className="w-full h-11 border-2 border-mist-grey focus:border-ocean-teal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* End Time - Always shown */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    End Time *
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
          </div>
        </div>
      </div>
    </div>
  );
};
