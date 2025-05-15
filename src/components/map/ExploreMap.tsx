
import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types/location';
import { useMapManager } from '@/hooks/useMapManager';

interface ExploreMapProps {
  locations?: Location[];
}

const ExploreMap: React.FC<ExploreMapProps> = ({ locations = [] }) => {
  const { mapContainer } = useMapManager(locations);

  return (
    <div className="relative w-full h-[70vh] rounded-lg overflow-hidden shadow-inner">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
    </div>
  );
};

export default ExploreMap;
