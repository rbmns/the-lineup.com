
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Heart, Loader2 } from 'lucide-react';

export type RsvpStatus = 'Going' | 'Interested' | null;
export type RsvpHandler = (status: 'Going' | 'Interested') => Promise<boolean>;

interface DefaultRsvpButtonsProps {
  currentStatus: RsvpStatus;
  onRsvp: RsvpHandler;
  isLoading?: boolean;
  className?: string;
  activeButton?: 'Going' | 'Interested' | null;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'subtle' | 'outline';
}

export const DefaultRsvpButtons: React.FC<DefaultRsvpButtonsProps> = ({
  currentStatus,
  onRsvp,
  isLoading = false,
  className,
  activeButton,
  size = 'default',
  variant = 'default'
}) => {
  const [localStatus, setLocalStatus] = useState<RsvpStatus>(currentStatus);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  const goingLoading = isLoading && activeButton === 'Going';
  const interestedLoading = isLoading && activeButton === 'Interested';

  const handleRsvp = async (status: 'Going' | 'Interested', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const result = await onRsvp(status);
    
    // The parent component will handle the state update through currentStatus prop
    // so we don't need to update localStatus here
  };

  // Size-specific classes
  const sizeClasses = {
    sm: "text-xs py-1 px-2 gap-1",
    default: "text-sm py-1.5 px-3 gap-1.5",
    lg: "text-base py-2 px-4 gap-2",
  };

  // Variant-specific classes
  const getVariantClasses = (buttonType: 'Going' | 'Interested') => {
    const isActive = localStatus === buttonType;

    if (variant === 'default') {
      if (buttonType === 'Going') {
        return isActive
          ? "bg-[#005F73] text-white hover:bg-[#005F73]/90"
          : "bg-[#F9F3E9] hover:bg-[#F9F3E9]/80 text-[#005F73]";
      } else {
        return isActive
          ? "bg-[#EDC46A] text-white hover:bg-[#EDC46A]/90"
          : "bg-[#F9F3E9] hover:bg-[#F9F3E9]/80 text-[#005F73]";
      }
    } else if (variant === 'subtle') {
      if (buttonType === 'Going') {
        return isActive
          ? "bg-[#005F73]/15 text-[#005F73] hover:bg-[#005F73]/20"
          : "bg-[#F4E7D3] hover:bg-[#F9F3E9] text-[#005F73]";
      } else {
        return isActive
          ? "bg-[#EDC46A]/15 text-[#EDC46A] hover:bg-[#EDC46A]/20"
          : "bg-[#F4E7D3] hover:bg-[#F9F3E9] text-[#005F73]";
      }
    } else {
      // outline variant
      if (buttonType === 'Going') {
        return isActive
          ? "border-[#005F73] bg-[#005F73]/10 text-[#005F73] hover:bg-[#005F73]/15"
          : "border-gray-300 hover:border-[#005F73] text-[#005F73]";
      } else {
        return isActive
          ? "border-[#EDC46A] bg-[#EDC46A]/10 text-[#EDC46A] hover:bg-[#EDC46A]/15"
          : "border-gray-300 hover:border-[#EDC46A] text-[#005F73]";
      }
    }
  };

  return (
    <div className={cn("flex w-full gap-2", className)} data-no-navigation="true">
      {/* Going Button */}
      <button
        type="button"
        onClick={(e) => handleRsvp('Going', e)}
        disabled={isLoading}
        className={cn(
          "flex flex-1 items-center justify-center rounded-md font-medium transition-all",
          sizeClasses[size],
          variant === "outline" ? "border" : "",
          getVariantClasses('Going'),
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
        data-no-navigation="true"
      >
        {goingLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check 
            size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
            className={cn(
              "transition-transform",
              localStatus === "Going" ? "scale-110" : "scale-100"
            )}
          />
        )}
        Going
      </button>

      {/* Interested Button */}
      <button
        type="button"
        onClick={(e) => handleRsvp('Interested', e)}
        disabled={isLoading}
        className={cn(
          "flex flex-1 items-center justify-center rounded-md font-medium transition-all",
          sizeClasses[size],
          variant === "outline" ? "border" : "",
          getVariantClasses('Interested')
        )}
        data-no-navigation="true"
      >
        {interestedLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart 
            size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
            className={cn(
              "transition-transform",
              localStatus === "Interested" ? "scale-110" : "scale-100"
            )}
          />
        )}
        Interested
      </button>
    </div>
  );
};
