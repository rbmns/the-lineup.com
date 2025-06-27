
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import { CreateEventButton } from './CreateEventButton';

interface NavActionsProps {
  onAuthRequired: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({
  onAuthRequired
}) => {
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
  const { isAdmin } = useAdminData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <div className={cn(
      "flex items-center flex-shrink-0",
      isMobile ? "gap-2" : "gap-3 lg:gap-4"
    )}>
      {/* Create Event Button */}
      <CreateEventButton />

      {isAuthenticated && user ? (
        <>
          {isAdmin && !isMobile && (
            <Link 
              to="/admin"
              className="text-midnight hover:text-overcast transition-colors duration-200 font-body text-sm"
            >
              Admin
            </Link>
          )}
          <div className="flex-shrink-0">
            <UserMenu 
              user={user} 
              profile={profile} 
              handleSignOut={signOut} 
              canCreateEvents={false}
            />
          </div>
        </>
      ) : (
        <button 
          onClick={handleSignInClick} 
          className={cn(
            "flex-shrink-0 text-midnight hover:text-overcast transition-colors duration-200 font-body",
            isMobile ? "text-sm px-3 py-2" : "text-sm px-4"
          )}
        >
          Sign in
        </button>
      )}
    </div>
  );
};
