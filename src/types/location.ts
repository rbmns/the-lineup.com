
export interface Location {
  id: string;
  name: string;
  type: 'friend' | 'event';
  coordinates: [number, number];
  username?: string;
  status?: string;
  avatar_url?: string;
  category?: string;
  date?: string;
  eventTitle?: string;
  location_category?: string;
}
