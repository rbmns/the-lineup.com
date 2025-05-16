
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from '@/hooks/use-toast';

export const useEventFilterState = () => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const hasActiveFilters =
    selectedEventTypes.length > 0 ||
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
    toast({ title: "All filters reset" });
  };

  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes((prev) => prev.filter((t) => t !== type));
    toast({ title: `Removed filter: ${type}` });
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues((prev) => prev.filter((v) => v !== venue));
    toast({ title: "Removed venue filter" });
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
    toast({ title: "Date filter cleared" });
  };

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    setIsFilterLoading,
    hasActiveFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
  };
};
