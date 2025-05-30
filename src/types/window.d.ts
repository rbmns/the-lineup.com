
interface Window {
  rsvpInProgress?: boolean;
  _rsvpBlockUrlChangeListener?: (e: Event) => void;
  _filterStateBeforeRsvp?: {
    urlParams: string;
    scrollPosition: number;
    timestamp: number;
    eventTypes?: string[];
    vibes?: string[];
    pathname?: string;
  };
  _lastRestoredFilterState?: {
    urlParams: string;
    eventTypes: string[];
    timestamp: number;
  };
  _rsvpStateBackup?: {
    filterState: any;
    urlParams: string;
    scrollPosition: number;
    timestamp: number;
    eventId?: string;
    status?: string;
  };
  
  // For global filter state management
  _globalFilterState?: {
    eventTypes: string[];
    venues: string[];
    vibes?: string[];
    dateRange?: {
      from?: string;
      to?: string;
    };
    dateFilter: string;
    timestamp: number;
    source: string;
  };
}
