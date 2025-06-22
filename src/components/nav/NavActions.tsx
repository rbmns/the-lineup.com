
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
      <CreateEventButton onAuthRequired={onAuthRequired} />

      {isAuthenticated && user ? (
        <>
          {isAdmin && !isMobile && (
            <Button 
              asChild 
              variant="ghost" 
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 transition-colors duration-200"
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignInClick} 
          className={cn(
            "flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10 transition-all duration-200 font-medium",
            isMobile ? "text-sm px-3 py-2" : "text-sm px-4"
          )}
        >
          Sign in
        </Button>
      )}
    </div>
  );
};
