
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
import { MapPin, Edit3, User, Shield, CalendarDays, Database } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import EventCardList from '@/components/events/EventCardList';

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
    { label: 'Upcoming Events', value: upcomingEvents.length.toString() },
    { label: 'Friends', value: '—' }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, shortLabel: 'Personal' },
    { id: 'events', label: 'My Events', icon: CalendarDays, shortLabel: 'Events' },
    { id: 'privacy', label: 'Privacy', icon: Shield, shortLabel: 'Privacy' },
    { id: 'data', label: 'Data Management', icon: Database, shortLabel: 'Data' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Personal Information</h2>
              <p className="text-neutral-50 mb-6">Manage your profile details and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Email</label>
                <p className="text-neutral bg-secondary-25 rounded-lg px-4 py-3 border border-secondary">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Location</label>
                <div className="flex items-center bg-secondary-25 rounded-lg px-4 py-3 border border-secondary">
                  <MapPin className="h-4 w-4 mr-3 text-vibrant-seafoam" />
                  <span className="text-neutral">{profile?.location || 'Not set'}</span>
                </div>
              </div>

              {profile?.tagline && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-primary">About</label>
                  <p className="text-neutral bg-secondary-25 rounded-lg px-4 py-3 border border-secondary italic">
                    "{profile.tagline}"
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleEditProfile} 
              className="bg-primary hover:bg-primary-75 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        );
        
      case 'events':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">My Events</h2>
              <p className="text-neutral-50 mb-6">Events you've RSVP'd to and your activity history</p>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary-25 rounded-lg p-1">
                <TabsTrigger 
                  value="upcoming" 
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
                >
                  Upcoming Events ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md"
                >
                  Past Events ({pastEvents.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-0">
                <div className="space-y-6">
                  {eventsLoading ? (
                    <div className="space-y-4">
                      <div className="h-24 bg-secondary-25 rounded-lg animate-pulse"></div>
                      <div className="h-24 bg-secondary-25 rounded-lg animate-pulse"></div>
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-lg border border-secondary p-4 hover:shadow-md transition-shadow">
                          <EventCardList
                            event={event}
                            showRsvpStatus={true}
                            showRsvpButtons={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-secondary-25 rounded-lg border border-secondary">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 text-neutral-25" />
                      <h3 className="text-lg font-semibold text-primary mb-2">No upcoming events</h3>
                      <p className="text-neutral-50 mb-4">You haven't RSVP'd to any upcoming events yet</p>
                      <Button 
                        onClick={() => navigate('/events')}
                        className="bg-primary hover:bg-primary-75 text-white px-6 py-2 rounded-lg"
                      >
                        Discover Events
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past" className="space-y-0">
                <div className="space-y-6">
                  {eventsLoading ? (
                    <div className="space-y-4">
                      <div className="h-24 bg-secondary-25 rounded-lg animate-pulse"></div>
                      <div className="h-24 bg-secondary-25 rounded-lg animate-pulse"></div>
                    </div>
                  ) : pastEvents.length > 0 ? (
                    <div className="space-y-4">
                      {pastEvents.map(event => (
                        <div key={event.id} className="bg-white rounded-lg border border-secondary p-4 opacity-75">
                          <EventCardList
                            event={event}
                            showRsvpStatus={true}
                            showRsvpButtons={false}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-secondary-25 rounded-lg border border-secondary">
                      <CalendarDays className="h-12 w-12 mx-auto mb-4 text-neutral-25" />
                      <h3 className="text-lg font-semibold text-primary mb-2">No past events</h3>
                      <p className="text-neutral-50">Your event history will appear here</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
        
      case 'privacy':
        return <PrivacySettings userId={user?.id} />;
        
      case 'data':
        return <DataManagement />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header with Ocean Gradient */}
      <div className="bg-gradient-to-br from-primary to-nature-seafoam text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <ProfileAvatar 
                profile={profile} 
                size="xl" 
                className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/20 shadow-lg" 
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{displayName}</h1>
              {profile?.tagline && (
                <p className="text-lg text-white/90 italic mb-4 font-light">"{profile.tagline}"</p>
              )}
              <div className="flex items-center justify-center md:justify-start mb-6 text-white/80">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{profile?.location || 'Location not set'}</span>
              </div>
              <Button 
                onClick={handleEditProfile}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-secondary">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-neutral-50 font-medium">{stat.label}</div>
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
                  className={`flex items-center space-x-2 px-4 md:px-6 py-4 border-b-3 transition-all whitespace-nowrap text-sm md:text-base min-w-0 font-medium ${
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
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-lg shadow-sm border border-secondary p-6 md:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
