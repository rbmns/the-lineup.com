
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { PrivacySettings } from '@/components/profile/PrivacySettings';
import { Button } from '@/components/ui/button';
import { MapPin, Edit3, User, Shield, CalendarDays } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  
  // If no user, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [user, navigate]);

  const { profile, loading } = useProfileData(user?.id);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const stats = [
    { label: 'Events Attended', value: '28' },
    { label: 'Interested In', value: '42' },
    { label: 'Friends', value: '17' }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'privacy', label: 'Preferences', icon: Shield },
    { id: 'events', label: 'My Events', icon: CalendarDays }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {profile?.location || 'Not set'}
                </p>
              </div>
            </div>
            
            <Button onClick={handleEditProfile} className="bg-black text-white hover:bg-gray-800">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        );
        
      case 'privacy':
        return <PrivacySettings userId={user?.id} />;
        
      case 'events':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Events</h2>
              <p className="text-gray-600 mb-6">Events you've created and are attending</p>
            </div>
            
            <div className="text-center py-12 text-gray-500">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No events to display</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Purple gradient header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left">
              <ProfileAvatar profile={profile} size="lg" className="border-4 border-white/20 w-20 h-20 md:w-24 md:h-24" />
              <div className="text-white">
                <h1 className="text-xl md:text-2xl font-bold">{displayName}</h1>
                {profile?.tagline && (
                  <p className="text-sm md:text-base text-purple-100 italic mt-1">"{profile.tagline}"</p>
                )}
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-purple-100">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile?.location || 'Location not set'}</span>
                </div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleEditProfile}
              className="bg-white text-purple-700 hover:bg-purple-50 w-full md:w-auto"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activity</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-3 md:py-4 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${
                    isActive 
                      ? 'border-purple-600 text-purple-600 bg-gray-50' 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
