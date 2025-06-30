
import React from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DateTimeFieldsProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ register, watch, setValue, errors }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      {/* Start Date & Time */}
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-sm font-medium text-graphite-grey">
            Start Date *
          </Label>
          <DatePicker
            selected={watch("start_date")}
            onSelect={(date) => date && setValue("start_date", date)}
            className="w-full h-10"
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time" className="text-sm font-medium text-graphite-grey">
            Start Time *
          </Label>
          <Input
            id="start_time"
            type="time"
            {...register("start_time")}
            aria-invalid={errors.start_time ? "true" : "false"}
            className="h-10"
          />
          {errors.start_time && (
            <p className="text-red-500 text-sm">{errors.start_time.message}</p>
          )}
        </div>
      </div>

      {/* End Date & Time */}
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-sm font-medium text-graphite-grey">
            End Date
          </Label>
          <DatePicker
            selected={watch("end_date")}
            onSelect={(date) => date && setValue("end_date", date)}
            className="w-full h-10"
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm">{errors.end_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time" className="text-sm font-medium text-graphite-grey">
            End Time
          </Label>
          <Input
            id="end_time"
            type="time"
            {...register("end_time")}
            aria-invalid={errors.end_time ? "true" : "false"}
            className="h-10"
          />
          {errors.end_time && (
            <p className="text-red-500 text-sm">{errors.end_time.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
