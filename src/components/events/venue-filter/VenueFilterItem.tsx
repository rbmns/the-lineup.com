
import React from 'react';
import { Check } from 'lucide-react';
import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface VenueFilterItemProps {
  value: string;
  label: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

export const VenueFilterItem: React.FC<VenueFilterItemProps> = ({
  value,
  label,
  isSelected,
  onSelect,
}) => {
  return (
    <CommandItem
      key={value}
      value={value}
      onSelect={() => onSelect(value)}
      className={cn(
        "flex items-center px-2 py-1.5 text-sm cursor-pointer",
        isSelected && "bg-gray-100"
      )}
    >
      <div className="flex items-center w-full">
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        <span>{label}</span>
      </div>
    </CommandItem>
  );
};
