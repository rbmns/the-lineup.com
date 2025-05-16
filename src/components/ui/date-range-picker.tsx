
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Select date range",
  disabled = false,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Update internal state when external value changes
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  // Format date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    if (range.to) {
      return `${format(range.from, "LLL dd, yyyy")} - ${format(range.to, "LLL dd, yyyy")}`;
    }
    return format(range.from, "LLL dd, yyyy");
  };

  // Handle internal changes - store temporarily without triggering onChange
  const handleSelect = (newDate: DateRange | undefined) => {
    // Always replace the existing range with the new selection
    setDate(newDate);
    
    // Auto-apply single date selections
    if (newDate?.from && !newDate.to) {
      onChange(newDate);
    }
  };

  // Handle confirmation - now we trigger the actual onChange
  const handleConfirm = () => {
    if (date) {
      onChange(date);
      setOpen(false); // Close the popover/dialog after confirming
    }
  };

  // When on mobile, use a dialog instead of a popover
  if (isMobile) {
    return (
      <div className={cn("grid gap-2", className)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange(date)}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[425px] p-0">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Select date range</DialogTitle>
            </DialogHeader>
            
            <div className="p-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={1}
                className="pointer-events-auto"
                disabled={disabled}
              />
              
              <DialogFooter className="flex justify-end px-4 pb-4 pt-2">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleConfirm}
                  disabled={!date?.from}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB]"
                >
                  {date?.to ? "Apply Range" : "Confirm Date"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop experience with popover
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={(isOpen) => {
        // When closing the popover by clicking outside, also confirm the date
        if (!isOpen && open && date?.from) {
          handleConfirm();
        }
        setOpen(isOpen);
      }}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              className="pointer-events-auto"
              disabled={disabled}
            />
            <div className="flex justify-end border-t pt-3">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleConfirm}
                disabled={!date?.from}
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                {date?.to ? "Apply Range" : "Confirm Date"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
