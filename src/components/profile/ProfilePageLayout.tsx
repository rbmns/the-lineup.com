
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Users, MapPin, Edit } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { ProfileAvatar } from './ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import { useRsvpActions } from '@/hooks/useRsvpActions';
import EventCard from '@/components/EventCard';

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
  const { handleRsvp } = useRsvpActions();

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  // Mock events data with proper Event type structure
  const mockEvents = [
    {
      id: '1',
      title: 'Beach Volleyball Tournament',
      description: 'Join us for an exciting beach volleyball tournament with prizes and refreshments.',
      start_date: '2024-06-16',
      start_time: '14:00',
      end_time: '18:00',
      location: 'Zandvoort Beach, North Section',
      event_category: 'Sports',
      image_urls: ['/api/placeholder/300/200'],
      rsvp_status: 'Going' as const,
      attendees: 12,
      creator: user?.id || '',
      venue_id: null,
      vibe: 'Active',
      tags: 'volleyball,beach,sports',
      created_at: '2024-06-01T10:00:00Z',
      updated_at: '2024-06-01T10:00:00Z'
    },
    {
      id: '2', 
      title: 'Sunset Yoga Session',
      description: 'Relax and unwind with a peaceful yoga session as the sun sets over the beach.',
      start_date: '2024-06-19',
      start_time: '19:30',
      end_time: '20:30',
      location: 'Zandvoort Beach, South Section',
      event_category: 'Wellness',
      image_urls: ['/api/placeholder/300/200'],
      rsvp_status: 'Interested' as const,
      attendees: 8,
      creator: user?.id || '',
      venue_id: null,
      vibe: 'Peaceful',
      tags: 'yoga,wellness,sunset',
      created_at: '2024-06-02T10:00:00Z',
      updated_at: '2024-06-02T10:00:00Z'
    }
  ];

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Info */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
                <div className="text-center mb-6">
                  <ProfileAvatar 
                    profile={profile} 
                    size="xl" 
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {displayName}
                  </h1>
                  
                  {profile?.location && (
                    <p className="text-gray-600 flex items-center justify-center gap-1 mb-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </p>
                  )}

                  {profile?.tagline && (
                    <p className="text-gray-600 italic mb-4">
                      "{profile.tagline}"
                    </p>
                  )}

                  {isOwnProfile && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEditProfile}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => navigate('/events')}
                  >
                    <Calendar className="h-4 w-4" />
                    Browse Events
                  </Button>
                  
                  {isOwnProfile && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={onToggleSettings}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Settings Panel */}
              {showSettings && isOwnProfile && user && (
                <SettingsPanel userId={user.id} />
              )}

              {/* About Section */}
              {!showSettings && (
                <>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-600">
                      {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
                    </p>
                  </div>

                  {/* Events Section */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">My Events</h2>
                    
                    {/* Events List */}
                    <div className="space-y-4">
                      {mockEvents.map(event => (
                        <EventCard
                          key={event.id}
                          event={event}
                          showRsvpButtons={isOwnProfile}
                          onRsvp={handleRsvp}
                          className="border border-gray-200 hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="text-center mb-6">
              <ProfileAvatar 
                profile={profile} 
                size="xl" 
                className="w-24 h-24 mx-auto mb-4"
              />
              <h1 className="text-2xl font-semibold mb-2">{displayName}</h1>
              
              {profile?.location && (
                <p className="text-gray-600 flex items-center justify-center gap-1 mb-2">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </p>
              )}

              {profile?.tagline && (
                <p className="text-gray-600 italic mb-4">
                  "{profile.tagline}"
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1 flex items-center gap-2"
                onClick={() => navigate('/events')}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Button>
              
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center gap-2"
                  onClick={onToggleSettings}
                >
                  <Settings className="h-4 w-4" />
                  Settings
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
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-600">
                  {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">My Events</h2>
                
                <div className="space-y-4">
                  {mockEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showRsvpButtons={isOwnProfile}
                      onRsvp={handleRsvp}
                      className="border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
