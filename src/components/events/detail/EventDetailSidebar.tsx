import React from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, ExternalLink, Info, Ticket, Globe, CalendarClock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
interface EventDetailSidebarProps {
  event: Event;
  attendees: {
    going: any[];
    interested: any[];
  };
  isAuthenticated: boolean;
}
export const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  event,
  attendees,
  isAuthenticated
}) => {
  const hasFee = typeof event.fee === 'number' && event.fee > 0;
  const hasBookingLink = !!event.booking_link;
  const hasOrganizerLink = !!event.organizer_link;
  const hasExtraInfo = !!event.extra_info;

  // Check if we have any booking info to display
  const showBookingInfo = hasFee || hasBookingLink || hasOrganizerLink || hasExtraInfo;
  return;
};