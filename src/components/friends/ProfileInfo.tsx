
import React from 'react';
import { MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface ProfileInfoProps {
  username: string;
  location?: string;
  status?: string;
  showStatus: boolean;
  canNavigateToProfile: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  username,
  location,
  status,
  showStatus,
  canNavigateToProfile
}) => {
  return (
    <div className="flex-1 min-w-0 truncate">
      <div className="text-black transition-colors">
        <h3 className={`font-medium truncate ${canNavigateToProfile ? 'text-gray-800 font-inter hover:underline' : 'text-gray-800 font-inter'}`}>
          {username || 'Anonymous User'}
        </h3>
      </div>

      {location && (
        <div className="flex items-center text-xs text-gray-600 truncate font-inter">
          <MapPin className="h-3 w-3 mr-1 text-purple flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      )}

      {showStatus && status && (
        <div className="flex items-center mt-2">
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  );
};
