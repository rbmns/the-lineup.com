
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
      isMobile ? "gap-1" : "gap-2 lg:gap-3"
    )}>
      {/* Create Event Button */}
      <CreateEventButton onAuthRequired={onAuthRequired} />

      {isAuthenticated && user ? (
        <>
          {isAdmin && !isMobile && (
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
            >
              <Link to="/admin">Admin</Link>
            </Button>
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
        <div className={cn(
          "flex items-center",
          isMobile ? "gap-1" : "gap-2"
        )}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignInClick} 
            className={cn(
              "flex-shrink-0",
              isMobile ? "text-sm px-2 py-2" : "text-sm px-4"
            )}
          >
            Sign in
          </Button>
          {!isMobile && (
            <Button 
              size="sm" 
              onClick={() => navigate('/login', { state: { initialMode: 'register' } })} 
              className="flex-shrink-0"
            >
              Sign Up
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
