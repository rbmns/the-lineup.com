
interface Window {
  rsvpInProgress?: boolean;
  _rsvpBlockUrlChangeListener?: (e: Event) => void;
  _filterStateBeforeRsvp?: {
    urlParams: string;
    scrollPosition: number;
    timestamp: number;
    eventTypes?: string[];
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
}
