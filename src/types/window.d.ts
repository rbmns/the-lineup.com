
interface Window {
  rsvpInProgress?: boolean;
  _rsvpBlockUrlChangeListener?: (e: Event) => void;
  _filterStateBeforeRsvp?: {
    urlParams: string;
    scrollPosition: number;
    timestamp: number;
  };
  _lastRestoredFilterState?: {
    urlParams: string;
    eventTypes: string[];
    timestamp: number;
  };
}
