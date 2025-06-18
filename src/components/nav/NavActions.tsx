
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/useAdminData';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import UserMenu from './UserMenu';
import { CreateEventButton } from './CreateEventButton';

interface NavActionsProps {
  toggleMobileSearch: () => void;
  onAuthRequired: () => void;
}

export const NavActions: React.FC<NavActionsProps> = ({
  toggleMobileSearch,
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
      {/* Mobile Search Icon */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSearch}
          className="w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      {/* Create Event Button */}
      <CreateEventButton onAuthRequired={onAuthRequired} />

      {isAuthenticated && user ? (
        <>
          {isAdmin && !isMobile && (
            <Button 
              asChild 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex text-gray-700 hover:text-gray-900"
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
              "text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0",
              isMobile ? "text-sm px-2 py-2" : "text-sm px-4"
            )}
          >
            Sign in
          </Button>
          {!isMobile && (
            <Button 
              size="sm" 
              onClick={() => navigate('/login', { state: { initialMode: 'register' } })} 
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-6 flex-shrink-0"
            >
              Sign Up
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
