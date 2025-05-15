
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export const useDateFilter = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const resetDateFilters = () => {
    setDateRange(undefined);
    setSelectedDateFilter('');
  };

  return {
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    showDateFilter,
    setShowDateFilter,
    resetDateFilters
  };
};
