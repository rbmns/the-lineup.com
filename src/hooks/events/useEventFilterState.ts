
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useEventFilterState = () => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters =
    selectedEventTypes.length > 0 ||
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const hasAdvancedFilters =
    selectedVenues.length > 0 ||
    dateRange !== undefined ||
    selectedDateFilter !== '';

  const resetFilters = () => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const handleRemoveEventType = (type: string) => {
    setSelectedEventTypes((prev) => prev.filter((t) => t !== type));
  };

  const handleRemoveVenue = (venue: string) => {
    setSelectedVenues((prev) => prev.filter((v) => v !== venue));
  };

  const handleClearDateFilter = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
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
    showAdvancedFilters,
    setShowAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
  };
};
