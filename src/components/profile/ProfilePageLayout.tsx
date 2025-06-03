
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Users, MapPin, Edit } from 'lucide-react';
import { PrivacySettings } from './PrivacySettings';
import { ProfileAvatar } from './ProfileAvatar';
import { useNavigate } from 'react-router-dom';

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

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

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
                      onClick={() => navigate('/profile/edit')}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Events
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
              {/* About Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600">
                  {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
                </p>
              </div>

              {/* Events Section */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">My Events</h2>
                
                {/* Event Tabs */}
                <div className="flex gap-4 mb-6">
                  <Button variant="ghost" className="flex items-center gap-2 bg-gray-100">
                    <Calendar className="h-4 w-4" />
                    Upcoming
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Past
                  </Button>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                  <EventCard
                    title="Beach Volleyball Tournament"
                    date="Sat, 16 June"
                    time="14:00-18:00"
                    location="Zandvoort Beach, North Section"
                    attendees={12}
                    image="/api/placeholder/60/60"
                  />
                  
                  <EventCard
                    title="Sunset Yoga Session"
                    date="Wed, 19 June"
                    time="19:30-20:30"
                    location="Zandvoort Beach, South Section"
                    attendees={8}
                    image="/api/placeholder/60/60"
                  />
                  
                  <EventCard
                    title="Local Food Festival"
                    date="Sat, 22 June"
                    time="12:00-20:00"
                    location="Central Market Square"
                    attendees={45}
                    image="/api/placeholder/60/60"
                  />
                </div>
              </div>

              {/* Settings Panel */}
              {showSettings && isOwnProfile && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <PrivacySettings userId={user?.id} />
                </div>
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
              <Button variant="outline" className="flex-1 flex items-center gap-2">
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

            {/* About Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-600">
                {profile?.tagline || "Explorer and local enthusiast. Love discovering new places and meeting new people."}
              </p>
            </div>

            {/* Events Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">My Events</h2>
              
              {/* Event Tabs */}
              <div className="flex gap-4 mb-4">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming
                </Button>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Past
                </Button>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                <EventCard
                  title="Beach Volleyball Tournament"
                  date="Sat, 16 June"
                  time="14:00-18:00"
                  location="Zandvoort Beach, North Section"
                  attendees={12}
                  image="/api/placeholder/60/60"
                />
                
                <EventCard
                  title="Sunset Yoga Session"
                  date="Wed, 19 June"
                  time="19:30-20:30"
                  location="Zandvoort Beach, South Section"
                  attendees={8}
                  image="/api/placeholder/60/60"
                />
                
                <EventCard
                  title="Local Food Festival"
                  date="Sat, 22 June"
                  time="12:00-20:00"
                  location="Central Market Square"
                  attendees={45}
                  image="/api/placeholder/60/60"
                />
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && isOwnProfile && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <PrivacySettings userId={user?.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  location,
  attendees,
  image
}) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <img 
        src={image} 
        alt={title}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">{date} {time}</p>
        <p className="text-sm text-gray-600 mb-1">{location}</p>
        <p className="text-sm text-gray-500">{attendees} attendees</p>
      </div>
      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
        View
      </Button>
    </div>
  );
};
