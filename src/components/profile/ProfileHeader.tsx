
import React from 'react';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Profile } from '@/types';
import AppPageHeader from '@/components/ui/AppPageHeader';

interface ProfileHeaderProps {
  profile: Profile | null;
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
    <div className="space-y-4 px-3 sm:px-4">
      {showAvatar && (
        <div className="flex justify-center">
          <ProfileAvatar profile={profile} size="xl" className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-accent/30" />
        </div>
      )}
      
      <div className="space-y-3 text-center">
        <h1 className="text-h3 sm:text-h2 text-foreground font-bold break-words">
          {profile?.username || 'Anonymous User'}
        </h1>
        
        {profile?.location && (
          <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm sm:text-base">
            <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="break-words">{profile.location}</span>
          </p>
        )}

        {profile?.status && (
          <p className="text-xs sm:text-sm text-foreground font-medium px-3 py-1 bg-accent/20 border border-accent/30 rounded-full inline-block max-w-full">
            <span className="break-words">{profile.status}</span>
          </p>
        )}

        {profile?.tagline && (
          <p className="text-muted-foreground italic text-sm sm:text-base break-words">
            "{profile.tagline}"
          </p>
        )}
        
        <div className="pt-2">
          {viewingOwnProfile ? (
            <Button variant="secondary" size="sm" onClick={handleEditClick} className="w-full sm:w-auto">
              Edit Profile
            </Button>
          ) : (
            friendStatus === 'accepted' ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRemoveFriend}
                className="w-full sm:w-auto"
              >
                Unfriend
              </Button>
            ) : friendStatus === 'pending' ? (
              <Button variant="secondary" size="sm" disabled className="w-full sm:w-auto">
                Pending...
              </Button>
            ) : (
              <Button size="sm" onClick={onAddFriend} className="w-full sm:w-auto">
                Add Friend
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
