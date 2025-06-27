
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptionalFieldsSectionProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}

export const OptionalFieldsSection: React.FC<OptionalFieldsSectionProps> = ({ 
  register, 
  errors, 
  control,
  watch,
  setValue 
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
      
      <CollapsibleContent className="space-y-6 mt-4 pt-4 border-t border-gray-200">
        {/* Booking Link */}
        <div>
          <Label htmlFor="booking_link">Booking Link</Label>
          <Input
            id="booking_link"
            type="url"
            placeholder="https://booking-website.com"
            {...register("booking_link")}
            aria-invalid={errors.booking_link ? "true" : "false"}
          />
          {errors.booking_link && (
            <p className="text-red-500 text-sm mt-1">{errors.booking_link.message}</p>
          )}
        </div>

        {/* Fee */}
        <div>
          <Label htmlFor="fee">Fee (€)</Label>
          <Input
            id="fee"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            {...register("fee")}
            aria-invalid={errors.fee ? "true" : "false"}
          />
          {errors.fee && (
            <p className="text-red-500 text-sm mt-1">{errors.fee.message}</p>
          )}
        </div>

        {/* Extra Info */}
        <div>
          <Label htmlFor="extra_info">Extra Info</Label>
          <Textarea
            id="extra_info"
            placeholder="Extra information"
            {...register("extra_info")}
            aria-invalid={errors.extra_info ? "true" : "false"}
          />
          {errors.extra_info && (
            <p className="text-red-500 text-sm mt-1">{errors.extra_info.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            type="text"
            placeholder="tag1, tag2, tag3"
            {...register("tags")}
            aria-invalid={errors.tags ? "true" : "false"}
          />
          <p className="text-sm text-gray-600 mt-1">
            Add relevant tags to increase your chances of being found in event searches
          </p>
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
