
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedDatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  error?: boolean;
}

export function EnhancedDatePicker({
  selected,
  onSelect,
  disabled,
  className,
  placeholder = "Select date",
  error = false,
}: EnhancedDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (selected) {
      setInputValue(format(selected, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [selected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Try to parse the date from input
    if (value.length === 10) { // DD/MM/YYYY format
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
            onSelect?.(date);
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setOpen(true);
    }
  };

  if (isMobile) {
    return (
      <div className="relative">
        <Input
          type="date"
          value={selected ? format(selected, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            const date = e.target.value ? new Date(e.target.value + 'T00:00:00') : undefined;
            onSelect?.(date);
          }}
          disabled={disabled}
          className={cn(
            "w-full h-11 text-base",
            error && "border-red-300",
            className
          )}
        />
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full pr-10",
              error && "border-red-300",
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-gray-50"
            onClick={() => setOpen(!open)}
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white shadow-lg border" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onSelect?.(date);
            setOpen(false);
          }}
          initialFocus
          className="pointer-events-auto"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-3",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 rounded-md transition-colors"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-9 font-normal text-xs text-center",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md transition-colors",
            day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center",
            day_selected: "bg-ocean-teal text-white hover:bg-ocean-teal/90",
            day_today: "bg-gray-100 text-gray-900 font-semibold",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
