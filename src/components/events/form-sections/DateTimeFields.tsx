
import React from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DateTimeFieldsProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ register, watch, setValue, errors }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !watch("start_date") && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch("start_date") ? format(watch("start_date"), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={watch("start_date")}
              onSelect={(date) => date && setValue("start_date", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.start_date && (
          <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="start_time">Start Time</Label>
        <Input
          id="start_time"
          type="time"
          {...register("start_time")}
          aria-invalid={errors.start_time ? "true" : "false"}
        />
        {errors.start_time && (
          <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !watch("end_date") && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch("end_date") ? format(watch("end_date"), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={watch("end_date")}
              onSelect={(date) => date && setValue("end_date", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.end_date && (
          <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="end_time">End Time</Label>
        <Input
          id="end_time"
          type="time"
          {...register("end_time")}
          aria-invalid={errors.end_time ? "true" : "false"}
        />
        {errors.end_time && (
          <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
        )}
      </div>
    </div>
  </>
);
