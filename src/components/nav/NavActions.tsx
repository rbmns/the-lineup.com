
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import { CreateEventButton } from './CreateEventButton';

export const NavActions: React.FC = () => {
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
      isMobile ? "gap-1.5" : "gap-2 lg:gap-3"
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
            isMobile ? "text-sm px-2 py-1.5" : "text-sm px-3"
          )}
        >
          Sign in
        </button>
      )}
    </div>
  );
};
