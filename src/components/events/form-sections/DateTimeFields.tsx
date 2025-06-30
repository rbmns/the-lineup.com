
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
    if (startTime && !showEndDate) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const endHours = (hours + 2) % 24;
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setValue('end_time', endTime);
    }
  }, [startTime, setValue, showEndDate]);

  const handleEndDateToggle = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setShowEndDate(isChecked);
  };
  
  return (
    <div className="space-y-6">
      {/* Start Date & Time */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-graphite-grey">Event Start</h3>
        <div className={cn(
          "grid gap-3",
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
                    className="w-full h-10"
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
                    className="h-10"
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-end-date"
          checked={showEndDate}
          onCheckedChange={handleEndDateToggle}
        />
        <label
          htmlFor="show-end-date"
          className="text-sm font-medium text-graphite-grey cursor-pointer"
        >
          Set different end date/time
        </label>
      </div>

      {/* End Date & Time - Only show if checkbox is checked */}
      {showEndDate && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-graphite-grey">Event End</h3>
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}>
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
                      className="w-full h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    End Time
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
