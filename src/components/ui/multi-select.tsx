
import * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string; // Added id prop to support form accessibility
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
  id
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure options and value are always arrays, even if undefined is passed
  const safeOptions = Array.isArray(options) ? options : [];
  const safeValue = Array.isArray(value) ? value : [];

  const toggleOption = (optionValue: string) => {
    if (safeValue.includes(optionValue)) {
      onChange(safeValue.filter((v) => v !== optionValue));
    } else {
      onChange([...safeValue, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(safeValue.filter((v) => v !== optionValue));
  };

  // Safely map values to labels
  const selectedLabels = safeValue
    .map((v) => safeOptions.find((opt) => opt.value === v)?.label)
    .filter(Boolean);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              safeValue.length > 0 ? "h-auto" : "h-10"
            )}
          >
            <div className="flex flex-wrap gap-1">
              {safeValue.length > 0 ? (
                selectedLabels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      const optionValue = safeOptions.find(
                        (opt) => opt.label === label
                      )?.value;
                      if (optionValue) removeOption(optionValue);
                    }}
                  >
                    {label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {safeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeValue.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
