
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserEvents } from '@/hooks/useUserEvents';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { PrivacySettings } from '@/components/profile/PrivacySettings';
import { DataManagement } from '@/components/profile/DataManagement';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Edit3, User, Shield, Database, Calendar } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { UserRsvpedEvents } from '@/components/profile/UserRsvpedEvents';

export const ProfileMainContent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  
  const { profile, loading } = useProfileData(user?.id);
  const { pastEvents, upcomingEvents, isLoading: eventsLoading } = useUserEvents(user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const stats = [
    { label: 'Events Attended', value: pastEvents.length.toString() },
    { label: 'Interested In', value: upcomingEvents.length.toString() },
    { label: 'Friends', value: '—' }
  ];

  // Updated tabs - now includes 'events' tab for RSVPs
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, shortLabel: 'Personal' },
    { id: 'events', label: 'My Events', icon: Calendar, shortLabel: 'Events' },
    { id: 'privacy', label: 'Preferences', icon: Shield, shortLabel: 'Privacy' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Personal Information</h2>
              <p className="text-neutral-50 mb-6 text-sm md:text-base">Manage your profile details and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Email</label>
                <p className="text-neutral bg-secondary-25 rounded-lg px-4 py-3 border border-secondary text-sm md:text-base">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Location</label>
                <div className="flex items-center bg-secondary-25 rounded-lg px-4 py-3 border border-secondary">
                  <MapPin className="h-4 w-4 mr-3 text-vibrant-seafoam" />
                  <span className="text-neutral text-sm md:text-base">{profile?.location || 'Not set'}</span>
                </div>
              </div>

              {profile?.tagline && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-primary">About</label>
                  <p className="text-neutral bg-secondary-25 rounded-lg px-4 py-3 border border-secondary italic text-sm md:text-base">
                    "{profile.tagline}"
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Member Since</label>
                <p className="text-neutral bg-secondary-25 rounded-lg px-4 py-3 border border-secondary text-sm md:text-base">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'Unknown'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleEditProfile} 
              className="bg-primary hover:bg-primary-75 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">My Events</h2>
              <p className="text-neutral-50 mb-6 text-sm md:text-base">Events you've RSVPed to</p>
            </div>
            <UserRsvpedEvents userId={user?.id} />
          </div>
        );
        
      case 'privacy':
        return <PrivacySettings userId={user?.id} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header with Ocean Gradient */}
      <div className="bg-gradient-to-br from-primary to-nature-seafoam text-white">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <ProfileAvatar 
                profile={profile} 
                size="xl" 
                className="w-24 h-24 md:w-40 md:h-40 border-4 border-white/20 shadow-lg" 
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">{displayName}</h1>
              {profile?.tagline && (
                <p className="text-base md:text-lg text-white/90 italic mb-4 font-light">"{profile.tagline}"</p>
              )}
              <div className="flex items-center justify-center md:justify-start mb-6 text-white/80">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                <span className="text-sm md:text-lg">{profile?.location || 'Location not set'}</span>
              </div>
              <Button 
                onClick={handleEditProfile}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors backdrop-blur-sm w-full md:w-auto"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats Section */}
      <div className="bg-white border-b border-secondary">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <h2 className="text-xl font-semibold mb-4 text-left">Activity</h2>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">{stat.value}</div>
                <div className="text-xs md:text-base text-neutral-50 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-secondary sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 md:px-6 py-3 md:py-4 border-b-3 transition-all whitespace-nowrap text-xs md:text-base min-w-0 font-medium ${
                    isActive 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-transparent text-neutral-50 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:block">{tab.label}</span>
                  <span className="block sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <div className="bg-white rounded-lg shadow-sm border border-secondary p-4 md:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
