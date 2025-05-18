
import React from 'react';
import { Check, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CategoryPill } from '@/components/ui/category-pill';

interface EventTypeOption {
  value: string;
  label: string;
}

interface EventTypesFilterProps {
  eventTypes: EventTypeOption[];
  selectedEventTypes: string[];
  onEventTypeChange: (types: string[]) => void;
  onReset: () => void;
}

export const EventTypesFilter: React.FC<EventTypesFilterProps> = ({
  eventTypes = [],
  selectedEventTypes = [],
  onEventTypeChange,
  onReset
}) => {
  const safeEventTypes = Array.isArray(eventTypes) ? eventTypes : [];
  const safeSelectedEventTypes = Array.isArray(selectedEventTypes) ? selectedEventTypes : [];

  const toggleEventType = (eventType: string) => {
    if (safeSelectedEventTypes.includes(eventType)) {
      onEventTypeChange(safeSelectedEventTypes.filter(type => type !== eventType));
    } else {
      onEventTypeChange([...safeSelectedEventTypes, eventType]);
    }
  };

  return (
    <div className="space-y-2">
      <Command className="rounded-md border shadow-none bg-white">
        <CommandList>
          <CommandEmpty>No event type found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {safeEventTypes.map((eventType) => (
              <CommandItem
                key={eventType.value}
                value={eventType.value}
                onSelect={() => toggleEventType(eventType.value)}
                className={cn(
                  "flex items-center px-2 py-1.5 text-sm cursor-pointer",
                  safeSelectedEventTypes.includes(eventType.value) && "bg-gray-100"
                )}
              >
                <div className="flex items-center w-full">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelectedEventTypes.includes(eventType.value) 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  <span>{eventType.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      
      {safeSelectedEventTypes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {safeSelectedEventTypes.map(eventType => {
            const eventTypeLabel = safeEventTypes.find(e => e.value === eventType)?.label || eventType;
            return (
              <CategoryPill 
                key={eventType} 
                category={eventTypeLabel}
                active={true}
                showIcon={false}
                size="xs"
                className="pr-1.5"
              >
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEventType(eventType);
                  }} 
                />
              </CategoryPill>
            );
          })}
        </div>
      )}
    </div>
  );
};
