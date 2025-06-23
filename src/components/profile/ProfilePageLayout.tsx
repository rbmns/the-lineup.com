
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { ProfileAvatar } from './ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import { useUserEvents } from '@/hooks/useUserEvents';
import { ProfileEventsContainer } from './ProfileEventsContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ProfilePageLayoutProps {
  profile: UserProfile | null;
  isOwnProfile: boolean;
  showSettings?: boolean;
  onToggleSettings?: () => void;
}

export const ProfilePageLayout: React.FC<ProfilePageLayoutProps> = ({
  profile,
  isOwnProfile,
  showSettings = false,
  onToggleSettings
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  // Fetch user's events using the real hook
  const { pastEvents, upcomingEvents, isLoading: eventsLoading } = useUserEvents(user?.id);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={cn(
        "mx-auto py-6",
        isMobile ? "px-4" : "container px-4"
      )}>
        {/* Mobile Layout */}
        {isMobile && (
          <div className="max-w-2xl">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-primary to-nature-seafoam rounded-lg p-6 mb-6 shadow-sm text-white">
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <ProfileAvatar 
                    profile={profile} 
                    size="lg" 
                    className="w-20 h-20 border-4 border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-semibold mb-1 truncate text-white">{displayName}</h1>
                    
                    {profile?.location && (
                      <p className="text-white/80 flex items-center gap-1 mb-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </p>
                    )}

                    {profile?.tagline && (
                      <p className="text-white/90 italic text-sm line-clamp-2">
                        "{profile.tagline}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                {isOwnProfile && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleEditProfile}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && isOwnProfile && user && (
              <SettingsPanel userId={user.id} />
            )}

            {/* About and Events - Mobile */}
            {!showSettings && (
              <>
                <div className="bg-white rounded-lg p-4 mb-6 shadow-sm text-left border border-secondary">
                  <h2 className="text-lg font-semibold mb-2 text-primary">About</h2>
                  <p className="text-neutral text-sm">
                    {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
                  </p>
                </div>

                <ProfileEventsContainer
                  profileId={user?.id}
                  profile={profile}
                  isLoading={eventsLoading}
                  isOwnProfile={isOwnProfile}
                />
              </>
            )}
          </div>
        )}

        {/* Desktop Layout */}
        {!isMobile && (
          <div className="max-w-6xl">
            <div className="grid grid-cols-3 gap-8">
              {/* Left Sidebar - Profile Info */}
              <div className="col-span-1">
                <div className="bg-gradient-to-br from-primary to-nature-seafoam rounded-lg p-6 shadow-sm sticky top-6 text-left text-white">
                  <div className="mb-6">
                    <ProfileAvatar 
                      profile={profile} 
                      size="xl" 
                      className="w-32 h-32 mx-auto mb-4 border-4 border-white/20"
                    />
                    <h1 className="text-2xl font-bold text-white mb-2 text-center">
                      {displayName}
                    </h1>
                    
                    {profile?.location && (
                      <p className="text-white/80 flex items-center justify-center gap-1 mb-2">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </p>
                    )}

                    {profile?.tagline && (
                      <p className="text-white/90 italic mb-4 text-center">
                        "{profile.tagline}"
                      </p>
                    )}

                    {isOwnProfile && (
                      <div className="text-center">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleEditProfile}
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-span-2 space-y-6 text-left">
                {/* Settings Panel */}
                {showSettings && isOwnProfile && user && (
                  <SettingsPanel userId={user.id} />
                )}

                {/* About Section */}
                {!showSettings && (
                  <>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary">
                      <h2 className="text-xl font-semibold mb-4 text-primary">About</h2>
                      <p className="text-neutral">
                        {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
                      </p>
                    </div>

                    {/* Events Section */}
                    <ProfileEventsContainer
                      profileId={user?.id}
                      profile={profile}
                      isLoading={eventsLoading}
                      isOwnProfile={isOwnProfile}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
