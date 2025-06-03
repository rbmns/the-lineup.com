
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Users } from 'lucide-react';
import { PrivacySettings } from './PrivacySettings';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">About</h1>
            <p className="text-gray-600">
              Explorer and local enthusiast. Love discovering new places and meeting new people.
            </p>
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
