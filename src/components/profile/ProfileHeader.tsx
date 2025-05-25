
import React from 'react';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string;
    avatar_url: string[] | string | null;
    tagline: string | null;
    location: string | null;
    status: string | null;
  } | null;
  viewingOwnProfile?: boolean;
  friendStatus?: 'none' | 'pending' | 'accepted';
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
  showAvatar?: boolean;
  onEditProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  viewingOwnProfile,
  friendStatus,
  onAddFriend,
  onRemoveFriend,
  showAvatar = true,
  onEditProfile,
}) => {
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate('/profile/edit');
    }
  };
  
  return (
    <div className="space-y-4">
      {showAvatar && (
        <div className="flex justify-center">
          <ProfileAvatar profile={profile} size="xl" className="w-48 h-48" />
        </div>
      )}
      
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">
          {profile?.username || 'Anonymous User'}
        </h2>
        
        {profile?.location && (
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </p>
        )}

        {profile?.status && (
          <p className="text-sm text-purple-600 font-medium px-3 py-1 bg-purple-50 rounded-full inline-block">
            {profile.status}
          </p>
        )}

        {profile?.tagline && (
          <p className="text-sm text-gray-600 italic">
            "{profile.tagline}"
          </p>
        )}
        
        {viewingOwnProfile ? (
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            Edit Profile
          </Button>
        ) : (
          friendStatus === 'accepted' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRemoveFriend}
              className="border-red-500 text-black hover:bg-red-50 bg-white"
            >
              Unfriend
            </Button>
          ) : friendStatus === 'pending' ? (
            <Button variant="secondary" size="sm" disabled>
              Pending...
            </Button>
          ) : (
            <Button size="sm" onClick={onAddFriend}>
              Add Friend
            </Button>
          )
        )}
      </div>
    </div>
  );
};
