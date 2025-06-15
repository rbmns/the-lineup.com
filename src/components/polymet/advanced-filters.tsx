import React from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronsUpDown, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  initialFilters?: {
    eventTypes?: string[];
    venues?: string[];
    eventVibes?: string[];
    date?: Date | undefined;
    dateFilter?: string;
  };
  eventCategories: string[];
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
  eventCategories,
  className
}) => {
  const [selectedEventTypes, setSelectedEventTypes] = React.useState<string[]>(initialFilters.eventTypes || []);
  const [selectedVenues, setSelectedVenues] = React.useState<string[]>(initialFilters.venues || []);
  const [selectedVibes, setSelectedVibes] = React.useState<string[]>(initialFilters.eventVibes || []);
  const [date, setDate] = React.useState<Date | undefined>(initialFilters.date);
  const [dateFilter, setDateFilter] = React.useState<string>(initialFilters.dateFilter || 'Any Date');
  const [open, setOpen] = React.useState(false);

  const handleEventTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventType = event.target.value;
    setSelectedEventTypes((prev) =>
      event.target.checked
        ? [...prev, eventType]
        : prev.filter((type) => type !== eventType)
    );
  };

  const handleVenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const venue = event.target.value;
    setSelectedVenues((prev) =>
      event.target.checked ? [...prev, venue] : prev.filter((v) => v !== venue)
    );
  };

  const handleVibeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const vibe = event.target.value;
    setSelectedVibes((prev) =>
      event.target.checked ? [...prev, vibe] : prev.filter((v) => v !== vibe)
    );
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setDateFilter(newDate ? 'Custom Date' : 'Any Date');
  };

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    setDate(undefined);
  };

  React.useEffect(() => {
    const filters = {
      eventTypes: selectedEventTypes,
      venues: selectedVenues,
      eventVibes: selectedVibes,
      date: date,
      dateFilter: dateFilter,
    };
    onFilterChange(filters);
  }, [selectedEventTypes, selectedVenues, selectedVibes, date, dateFilter, onFilterChange]);

  const dateFilters = [
    "Any Date",
    "Today",
    "Tomorrow",
    "This Week",
    "Next Week",
    "This Month",
    "Next Month",
  ];

  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      <AccordionItem value="filters">
        <AccordionTrigger>
          <span className="flex-1 text-left font-semibold">
            Advanced Filters
          </span>
        </AccordionTrigger>
        <AccordionContent className="py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-types">Event Types</Label>
              <div className="flex flex-wrap gap-2">
                {eventCategories.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      value={type}
                      checked={selectedEventTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        setSelectedEventTypes((prev) => {
                          return checked
                            ? [...prev, type]
                            : prev.filter((t) => t !== type);
                        });
                      }}
                    />
                    <Label htmlFor={type} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="venues">Venues</Label>
              <div className="flex flex-wrap gap-2">
                {['Beach', 'Park', 'Club', 'Restaurant'].map((venue) => (
                  <div key={venue} className="flex items-center space-x-2">
                    <Checkbox
                      id={venue}
                      value={venue}
                      checked={selectedVenues.includes(venue)}
                      onCheckedChange={(checked) => {
                        setSelectedVenues((prev) =>
                          checked
                            ? [...prev, venue]
                            : prev.filter((v) => v !== venue)
                        );
                      }}
                    />
                    <Label htmlFor={venue} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {venue}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vibes">Vibes</Label>
              <div className="flex flex-wrap gap-2">
                {['Chill', 'Party', 'Active', 'Relaxed'].map((vibe) => (
                  <div key={vibe} className="flex items-center space-x-2">
                    <Checkbox
                      id={vibe}
                      value={vibe}
                      checked={selectedVibes.includes(vibe)}
                      onCheckedChange={(checked) => {
                        setSelectedVibes((prev) =>
                          checked
                            ? [...prev, vibe]
                            : prev.filter((v) => v !== vibe)
                        );
                      }}
                    />
                    <Label htmlFor={vibe} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {vibe}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <div className="flex items-center space-x-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter}
                      <ChevronsUpDown className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search date..." />
                      <CommandEmpty>No date found.</CommandEmpty>
                      <CommandGroup>
                        {dateFilters.map((date) => (
                          <CommandItem
                            key={date}
                            onSelect={() => {
                              handleDateFilterChange(date);
                              setOpen(false)
                            }}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{date}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {dateFilter === 'Any Date' && (
                  <DateRangePicker selected={date} onSelect={handleDateChange} />
                )}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedFilters;
