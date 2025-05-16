
import React from 'react';
import { UserProfile } from '@/types';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventAttendeesListProps {
  going: UserProfile[];
  interested: UserProfile[];
}

export const EventAttendeesList: React.FC<EventAttendeesListProps> = ({ 
  going, 
  interested 
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [goingOpen, setGoingOpen] = React.useState(false);
  const [interestedOpen, setInterestedOpen] = React.useState(false);
  
  // Filter out current user from both lists
  const filteredGoing = going.filter(profile => profile.id !== user?.id);
  const filteredInterested = interested.filter(profile => profile.id !== user?.id);
  
  // If not authenticated, hide the component completely
  if (!isAuthenticated) {
    return null;
  }
  
  // If there are no attendees after filtering, don't show anything
  if (filteredGoing.length === 0 && filteredInterested.length === 0) {
    return null;
  }

  // Navigation function using React Router
  const handleProfileClick = (e: React.MouseEvent | React.KeyboardEvent, profileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("EventAttendeesList: Navigating to profile", profileId);
    
    try {
      navigate(`/users/${profileId}`);
    } catch (err) {
      console.error("Navigation error:", err);
      // Fallback to direct URL change if navigate fails
      window.location.href = `/users/${profileId}`;
    }
  };

  if (isMobile) {
    // Mobile view with collapsible sections
    return (
      <div className="mt-4 space-y-3">
        {filteredGoing.length > 0 && (
          <Collapsible 
            open={goingOpen} 
            onOpenChange={setGoingOpen}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium">Going ({filteredGoing.length})</h4>
              <ChevronDown className={`h-4 w-4 transition-transform ${goingOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-white p-2">
              <div className="grid grid-cols-1 gap-2">
                {filteredGoing.map((profile) => (
                  <div 
                    key={profile.id}
                    className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={(e) => handleProfileClick(e, profile.id)}
                  >
                    <ProfileAvatar profile={profile} size="sm" className="mr-2" />
                    <span className="text-sm">{profile.username || 'User'}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        
        {filteredInterested.length > 0 && (
          <Collapsible 
            open={interestedOpen} 
            onOpenChange={setInterestedOpen}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium">Interested ({filteredInterested.length})</h4>
              <ChevronDown className={`h-4 w-4 transition-transform ${interestedOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-white p-2">
              <div className="grid grid-cols-1 gap-2">
                {filteredInterested.map((profile) => (
                  <div 
                    key={profile.id}
                    className="flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={(e) => handleProfileClick(e, profile.id)}
                  >
                    <ProfileAvatar profile={profile} size="sm" className="mr-2" />
                    <span className="text-sm">{profile.username || 'User'}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    );
  }

  // Desktop view with pill layout
  return (
    <div className="mt-4">
      {filteredGoing.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2 pb-1 font-inter">Going:</h4>
          <div className="flex flex-wrap md:grid md:grid-cols-2 gap-2">
            {filteredGoing.map((profile: UserProfile) => (
              <div 
                key={profile.id}
                className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-1 transition-colors cursor-pointer active:bg-gray-200 border border-gray-200"
                onClick={(e) => handleProfileClick(e, profile.id)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProfileClick(e, profile.id);
                  }
                }}
                aria-label={`View ${profile.username}'s profile`}
              >
                <ProfileAvatar profile={profile} size="sm" className="mr-2" />
                <span className="text-sm font-inter hover:underline">{profile.username || 'User'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {filteredInterested.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 pb-1 font-inter">Interested:</h4>
          <div className="flex flex-wrap md:grid md:grid-cols-2 gap-2">
            {filteredInterested.map((profile: UserProfile) => (
              <div 
                key={profile.id}
                className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-full px-3 py-1 transition-colors cursor-pointer active:bg-gray-200 border border-gray-200"
                onClick={(e) => handleProfileClick(e, profile.id)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleProfileClick(e, profile.id);
                  }
                }}
                aria-label={`View ${profile.username}'s profile`}
              >
                <ProfileAvatar profile={profile} size="sm" className="mr-2" />
                <span className="text-sm font-inter hover:underline">{profile.username || 'User'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
