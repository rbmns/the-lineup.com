
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfilePageLayout } from '@/components/profile/ProfilePageLayout';
import { useProfileData } from '@/hooks/useProfileData';
import { UserCreatedEvents } from '@/components/profile/UserCreatedEvents';
import { UserRsvpedEvents } from '@/components/profile/UserRsvpedEvents';
import { cn } from '@/lib/utils';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'created'>('rsvps');

  const {
    profile,
    loading,
    error,
    isNotFound
  } = useProfileData(user?.id);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect in the effect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isNotFound || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const isCreator = profile?.status === 'Event Host';

  const tabStyle = "pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out";
  const activeTabStyle = "border-primary text-primary";
  const inactiveTabStyle = "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300";

  return (
    <>
      <ProfilePageLayout
        profile={profile}
        isOwnProfile={true}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('rsvps')}
                    className={cn(tabStyle, activeTab === 'rsvps' ? activeTabStyle : inactiveTabStyle)}
                >
                    My RSVPs
                </button>
                {isCreator && (
                    <button
                        onClick={() => setActiveTab('created')}
                        className={cn(tabStyle, activeTab === 'created' ? activeTabStyle : inactiveTabStyle)}
                    >
                        My Created Events
                    </button>
                )}
            </nav>
        </div>
        <div className="mt-8">
            {activeTab === 'rsvps' && <UserRsvpedEvents userId={user.id} isCurrentUser />}
            {activeTab === 'created' && isCreator && <UserCreatedEvents />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
