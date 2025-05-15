
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ExploreMap from '@/components/map/ExploreMap';
import { Location } from '@/types/location';
import { Card } from '@/components/ui/card';
import { Event } from '@/types';

interface EventWithCoordinates extends Event {
  coordinates?: [number, number]; // This is now part of the Event interface
}

// Define the profile interface with the missing properties to match the DB schema
interface Profile {
  id: string;
  username?: string;
  avatar_url?: string[] | null;
  location?: string | null;
  location_category?: string | null;
  status?: string | null;
  onboarded?: boolean;
  onboarding_data?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

const processEventData = (event: any): Event => {
  // Safely check if venues exists and has a valid object structure
  const hasValidVenues = event.venues && 
    typeof event.venues === 'object' && 
    event.venues !== null && 
    !('error' in event.venues);
  
  return {
    id: event.id,
    title: event.title,
    description: event.description || '',
    // Only include location if it exists
    ...(event.location && { location: event.location }),
    start_time: event.start_time,
    end_time: event.end_time,
    created_at: event.created_at,
    updated_at: event.updated_at,
    event_type: event.event_type,
    image_urls: event.image_urls || [],
    venues: hasValidVenues ? event.venues : null,
    google_maps: hasValidVenues && event.venues.google_maps ? event.venues.google_maps : null,
    rsvp_status: undefined,
    area: null,
    coordinates: event.coordinates || null,
  } as Event;
};

const Explore = () => {
  const { user } = useAuth();
  const [mapLocations, setMapLocations] = useState<Location[]>([]);
  
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['explore-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, venues:venue_id(*)');

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      
      if (!data) {
        return [];
      }

      return data.map(processEventData);
    },
  });

  const { data: friendProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['explore-profiles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: friendships, error: friendshipError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted');

      if (friendshipError) {
        console.error('Error fetching friendships:', friendshipError);
        return [];
      }

      if (!friendships.length) return [];

      const friendIds = friendships.map(f => f.friend_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
      }

      return profiles || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    const allLocations: Location[] = [];

    if (events) {
      events.forEach(event => {
        // Safely handle coordinates which is now part of the Event interface
        const eventCoordinates = event.coordinates || null;
        
        if (eventCoordinates && 
            Array.isArray(eventCoordinates) && 
            eventCoordinates.length === 2 &&
            !isNaN(eventCoordinates[0]) && 
            !isNaN(eventCoordinates[1])) {
          
          allLocations.push({
            id: event.id,
            name: event.title,
            type: 'event',
            coordinates: eventCoordinates as [number, number],
            category: event.event_type,
            date: event.start_time,
            eventTitle: event.title,
            location_category: 'Event'
          });
        } else if (event.venues?.name || event.location) {
          // Use venues.name or location if coordinates are not available
          console.log(`Event ${event.id} missing proper coordinates`);
        }
      });
    }

    if (friendProfiles) {
      friendProfiles.forEach((profile: Profile) => {
        if (profile.location) {
          const locationParts = profile.location.split(',');
          
          if (locationParts.length === 2) {
            const lat = parseFloat(locationParts[0]);
            const lng = parseFloat(locationParts[1]);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              allLocations.push({
                id: profile.id,
                name: profile.username || 'Friend',
                type: 'friend',
                coordinates: [lng, lat],
                username: profile.username,
                status: profile.status || undefined,
                avatar_url: Array.isArray(profile.avatar_url) ? profile.avatar_url[0] : null,
                location_category: profile.location_category || undefined
              });
            } else {
              console.log(`Profile ${profile.id} has invalid coordinates in location string`);
            }
          }
        }
      });
    }
    
    console.log('Map locations prepared:', allLocations);
    setMapLocations(allLocations);
  }, [events, friendProfiles]);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <Card className="p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Find People & Events</h2>
        <p className="text-gray-600 mb-2">Discover friends and events on the map</p>
      </Card>
      
      {(eventsLoading || profilesLoading) ? (
        <div className="h-[70vh] w-full bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <ExploreMap locations={mapLocations} />
      )}
    </div>
  );
};

export default Explore;
