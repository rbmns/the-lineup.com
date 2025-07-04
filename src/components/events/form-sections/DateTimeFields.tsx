import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
import { EventFormData } from '@/components/events/form/EventFormSchema';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { TimezoneField } from './TimezoneField';
interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormData>;
}
export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  form
}) => {
  const isMobile = useIsMobile();
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  return <div className={cn("bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20", isMobile ? "p-3" : "p-6")}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
        <h2 className={cn("font-semibold text-ocean-teal", isMobile ? "text-base" : "text-xl")}>Date & Time</h2>
      </div>
      
      <div className="space-y-4">
        {/* Start Date and Time */}
        <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <FormField control={form.control} name="startDate" render={({
          field,
          fieldState
        }) => <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Date *
                </FormLabel>
                <FormControl>
                  <EnhancedDatePicker selected={field.value} onSelect={field.onChange} placeholder="Select start date" error={!!fieldState.error} className={cn("bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal", isMobile ? "h-11 text-base" : "h-10")} />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="startTime" render={({
          field
        }) => <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Time *
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} className={cn("bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal", isMobile ? "h-11 text-base" : "h-10")} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>

        {/* End Date and Time */}
        <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <FormField control={form.control} name="endDate" render={({
          field,
          fieldState
        }) => <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Date (Optional)
                </FormLabel>
                <FormControl>
                  <EnhancedDatePicker selected={field.value} onSelect={field.onChange} placeholder="Select end date" error={!!fieldState.error} className={cn("bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal", isMobile ? "h-11 text-base" : "h-10")} />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="endTime" render={({
          field
        }) => <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Time (Optional)
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} className={cn("bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal", isMobile ? "h-11 text-base" : "h-10")} />
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </div>

        {/* Timezone Field */}
        <TimezoneField autoDetectedTimezone={form.watch('timezone')} venueName={form.watch('city')} />

        {/* Date Validation Message */}
        {startDate && endDate && endDate < startDate && <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            End date cannot be before start date. Please adjust your dates.
          </div>}

        {/* Recurring Event Toggle */}
        <FormField control={form.control} name="isRecurring" render={({
        field
      }) => {}} />

        {/* Recurring Event Fields - Only show when recurring is enabled */}
        {form.watch('isRecurring') && <div className="space-y-4 p-4 bg-ocean-teal/5 rounded-lg border border-ocean-teal/20">
            {/* Weekday Selector */}
            <FormField control={form.control} name="recurringDays" render={({
          field
        }) => <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    Select Days *
                  </FormLabel>
                  <FormControl>
                    <div className={cn("grid gap-2", isMobile ? "grid-cols-4" : "grid-cols-7")}>
                      {[{
                key: 'mon',
                label: 'Mon'
              }, {
                key: 'tue',
                label: 'Tue'
              }, {
                key: 'wed',
                label: 'Wed'
              }, {
                key: 'thu',
                label: 'Thu'
              }, {
                key: 'fri',
                label: 'Fri'
              }, {
                key: 'sat',
                label: 'Sat'
              }, {
                key: 'sun',
                label: 'Sun'
              }].map(day => {
                const isSelected = field.value?.includes(day.key) || false;
                return <Button key={day.key} type="button" variant={isSelected ? "default" : "outline"} size="sm" className={cn("h-10", isSelected ? "bg-ocean-teal text-white hover:bg-ocean-teal/90" : "border-ocean-teal/20 hover:border-ocean-teal")} onClick={() => {
                  const currentDays = field.value || [];
                  if (isSelected) {
                    field.onChange(currentDays.filter((d: string) => d !== day.key));
                  } else {
                    field.onChange([...currentDays, day.key]);
                  }
                }}>
                            {day.label}
                          </Button>;
              })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* End Date for Recurring */}
            <FormField control={form.control} name="recurringEndDate" render={({
          field,
          fieldState
        }) => <FormItem>
                  <FormLabel className="text-sm font-medium text-graphite-grey">
                    End Date for Recurring Events *
                  </FormLabel>
                  <FormControl>
                    <EnhancedDatePicker selected={field.value} onSelect={field.onChange} placeholder="Select end date" error={!!fieldState.error} className={cn("bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal", isMobile ? "h-11 text-base" : "h-10")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Preview */}
            {form.watch('recurringDays')?.length > 0 && form.watch('recurringEndDate') && <div className="p-3 bg-ocean-teal/10 rounded-lg border border-ocean-teal/30">
                <div className="text-sm font-medium text-ocean-teal mb-1">Preview</div>
                <div className="text-sm text-graphite-grey">
                  This will create multiple events for the selected days between {' '}
                  {startDate && format(startDate, "MMM d")} and {' '}
                  {form.watch('recurringEndDate') && format(form.watch('recurringEndDate'), "MMM d, yyyy")}
                  {form.watch('startTime') && ` at ${form.watch('startTime')}`}
                </div>
              </div>}
          </div>}
      </div>
    </div>;
};