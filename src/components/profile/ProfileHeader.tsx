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
  onEditProfile
}) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate('/profile/edit');
    }
  };
  return <div className="space-y-4 px-4 sm:px-6 lg:px-8">
      {showAvatar && <div className="flex justify-center">
          <ProfileAvatar profile={profile} size="xl" className="w-32 h-32 border-4 border-white/20" />
        </div>}
      
      <div className="space-y-2 text-center bg-transparent">
        <AppPageHeader className="text-white">
          {profile?.username || 'Anonymous User'}
        </AppPageHeader>
        
        {profile?.location && <p className="text-purple-100 flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </p>}

        {profile?.status && <p className="text-sm text-white font-medium px-3 py-1 bg-white/20 rounded-full inline-block">
            {profile.status}
          </p>}

        {profile?.tagline && <p className="text-purple-100 italic">
            "{profile.tagline}"
          </p>}
        
        {viewingOwnProfile ? <Button variant="secondary" size="sm" onClick={handleEditClick} className="bg-white text-purple-700 hover:bg-purple-50">
            Edit Profile
          </Button> : friendStatus === 'accepted' ? <Button variant="outline" size="sm" onClick={onRemoveFriend} className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              Unfriend
            </Button> : friendStatus === 'pending' ? <Button variant="secondary" size="sm" disabled className="bg-white/20 text-white">
              Pending...
            </Button> : <Button size="sm" onClick={onAddFriend} className="bg-white text-purple-700 hover:bg-purple-50">
              Add Friend
            </Button>}
      </div>
    </div>;
};