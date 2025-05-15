
import React, { useEffect, useRef } from 'react';
import { Location } from '@/types/location';
import { User, Music, Waves, Activity, Users, Wrench, Calendar } from 'lucide-react';
import { createRoot } from 'react-dom/client';

interface ExploreMapMarkerProps {
  location: Location;
  onClick: (location: Location) => void;
}

const ExploreMapMarker: React.FC<ExploreMapMarkerProps> = ({ location, onClick }) => {
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!markerRef.current) return;

    const el = markerRef.current;
    el.className = 'marker';
    el.style.width = '36px';
    el.style.height = '36px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.backgroundColor = 'white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    if (location.type === 'friend') {
      el.style.backgroundColor = '#f472b6';

      if (location.avatar_url) {
        el.style.backgroundImage = `url(${location.avatar_url})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      } else {
        const userIconContainer = document.createElement('div');
        const iconRoot = createRoot(userIconContainer);
        iconRoot.render(<User color="white" size={20} />);
        el.appendChild(userIconContainer);
      }
    } else {
      // Event icons by type
      const eventColors: Record<string, string> = {
        'Surf': '#818cf8', // blue
        'Yoga': '#10b981', // green
        'Music': '#8b5cf6', // purple
        'Meetup': '#f97316', // orange
        'Workshop': '#14b8a6', // teal
        'Other': '#6b7280'  // gray
      };
      el.style.backgroundColor = eventColors[location.category || 'Other'] || '#818cf8';

      const iconContainer = document.createElement('div');
      const iconRoot = createRoot(iconContainer);

      switch (location.category) {
        case 'Surf':
          iconRoot.render(<Waves color="white" size={20} />);
          break;
        case 'Yoga':
          iconRoot.render(<Activity color="white" size={20} />); // Using Activity for Yoga
          break;
        case 'Music':
          iconRoot.render(<Music color="white" size={20} />);
          break;
        case 'Meetup':
          iconRoot.render(<Users color="white" size={20} />);
          break;
        case 'Workshop':
          iconRoot.render(<Wrench color="white" size={20} />);
          break;
        default:
          iconRoot.render(<Calendar color="white" size={20} />);
      }

      el.appendChild(iconContainer);
    }

    el.addEventListener('click', () => onClick(location));

  }, [location, onClick]);

  return <div ref={markerRef} />;
};

export default ExploreMapMarker;
