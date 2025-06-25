
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { useProfileData } from '@/hooks/useProfileData';
import UserMenu from './UserMenu';

interface NavActionsProps {
  onAuthRequired?: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({ onAuthRequired }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { canCreateEvents, isAdmin } = useCreatorStatus();
  const { profile } = useProfileData(user?.id);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateEvent = () => {
    if (!user) {
      onAuthRequired?.();
      return;
    }
    
    if (!canCreateEvents) {
      navigate('/organise');
      return;
    }
    
    navigate('/events/create');
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Create Event Button */}
      <Button
        onClick={handleCreateEvent}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-white px-3 py-2 text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2"
      >
        <Plus className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Create Event</span>
        <span className="sm:hidden">Create</span>
      </Button>

      {/* User Actions */}
      {user ? (
        <UserMenu 
          user={user} 
          profile={profile} 
          handleSignOut={handleSignOut}
          canCreateEvents={canCreateEvents}
          isAdmin={isAdmin}
        />
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-xs md:text-sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="text-xs md:text-sm">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
