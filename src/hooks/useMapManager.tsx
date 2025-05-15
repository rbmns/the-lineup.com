
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '@/types/location';
import { createRoot } from 'react-dom/client';
import ExploreMapMarker from '@/components/map/ExploreMapMarker';
import { createPopup } from '@/components/map/ExploreMapPopup';
import { useNavigate } from 'react-router-dom';

export const useMapManager = (locations: Location[] = []) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();

  const handleLocationClick = (location: Location) => {
    if (location.type === 'friend') {
      navigate(`/users/${location.id}`);
    } else if (location.type === 'event') {
      navigate(`/events/${location.id}`);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9zaWVibW5zIiwiYSI6ImNtOWw4d2o3cjAyOWoyaHFxeWJjMGw3OXUifQ.5_q0IkDp88v9f3yxI4943A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [4.9041, 52.3676], // Amsterdam
      zoom: 12
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapInitialized(true);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter valid locations - ensure coordinates are valid numbers
    const validLocations = locations.filter(location => {
      return location.coordinates && 
             Array.isArray(location.coordinates) && 
             location.coordinates.length === 2 &&
             !isNaN(location.coordinates[0]) && 
             !isNaN(location.coordinates[1]);
    });

    console.log(`Adding ${validLocations.length} valid locations to map (filtered from ${locations.length} total)`);

    if (!validLocations.length) return;

    // Add new markers for valid locations
    const newMarkers = validLocations.map(location => {
      const [lng, lat] = location.coordinates;
      
      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(
        <ExploreMapMarker 
          location={location} 
          onClick={handleLocationClick} 
        />
      );

      const popup = createPopup(location);

      const marker = new mapboxgl.Marker(container)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      return marker;
    });

    markersRef.current = newMarkers;

    // Fit map to markers if we have valid locations
    if (validLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      validLocations.forEach(location => {
        // Double-check coordinates again just to be safe
        if (location.coordinates && 
            !isNaN(location.coordinates[0]) && 
            !isNaN(location.coordinates[1])) {
          bounds.extend(location.coordinates as [number, number]);
        }
      });
      
      // Only fit bounds if the bounds are valid
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15
        });
      }
    }
  }, [locations, mapInitialized, navigate]);

  return { mapContainer };
};
