
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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
          <div className="space-y-2">
            <Label htmlFor="fee" className="text-sm font-medium text-graphite-grey">
              Fee (€)
            </Label>
            <Input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              {...register("fee")}
              aria-invalid={errors.fee ? "true" : "false"}
              className="h-10"
            />
            {errors.fee && (
              <p className="text-red-500 text-sm">{errors.fee.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_link" className="text-sm font-medium text-graphite-grey">
              Booking Link
            </Label>
            <Input
              id="booking_link"
              type="url"
              placeholder="https://booking-website.com"
              {...register("booking_link")}
              aria-invalid={errors.booking_link ? "true" : "false"}
              className="h-10"
            />
            {errors.booking_link && (
              <p className="text-red-500 text-sm">{errors.booking_link.message}</p>
            )}
          </div>
        </div>

        {/* Extra Info */}
        <div className="space-y-2">
          <Label htmlFor="extra_info" className="text-sm font-medium text-graphite-grey">
            Extra Info
          </Label>
          <Textarea
            id="extra_info"
            placeholder="Extra information about your event..."
            {...register("extra_info")}
            aria-invalid={errors.extra_info ? "true" : "false"}
            className="min-h-[100px] resize-none"
            rows={4}
          />
          {errors.extra_info && (
            <p className="text-red-500 text-sm">{errors.extra_info.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium text-graphite-grey">
            Tags
          </Label>
          <Input
            id="tags"
            type="text"
            placeholder="tag1, tag2, tag3"
            {...register("tags")}
            aria-invalid={errors.tags ? "true" : "false"}
            className="h-10"
          />
          <p className="text-xs text-gray-600">
            Add relevant tags to help people find your event
          </p>
          {errors.tags && (
            <p className="text-red-500 text-sm">{errors.tags.message}</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
