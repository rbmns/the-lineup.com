
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/ui/brand-logo';
import UserMenu from '@/components/nav/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { NavbarSearch } from './nav/NavbarSearch';
import { useAdminData } from '@/hooks/useAdminData';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
  const { canCreateEvents } = useCreatorStatus();
  const { isAdmin } = useAdminData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    console.log('Register button clicked, navigating to /login with register mode');
    navigate('/login', {
      state: {
        initialMode: 'register'
      }
    });
  };

  const handleSignInClick = () => {
    console.log('Sign in button clicked, navigating to /login');
    navigate('/login');
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white border-b border-gray-200",
    )}>
      <div className="w-full flex flex-col">
        <div className={cn(
          "w-full h-14 flex items-center justify-between gap-2 sm:gap-4",
          isMobile ? "px-3" : "px-4 sm:px-6"
        )}>
          {/* Left side - Icon flush left + wordmark */}
          <div className="flex items-center h-14 flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center justify-center mr-2 flex-shrink-0">
              <img
                src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png"
                alt="thelineup Symbol"
                className="w-6 h-6 sm:w-7 sm:h-7"
                style={{ display: 'block' }}
              />
            </Link>
            <BrandLogo showText={!isMobile} className="ml-0 min-w-0" />
          </div>

          {/* Center-Right - Search Bar for desktop */}
          {!isMobile && (
            <div className="flex-1 flex justify-end max-w-md mr-2">
              <NavbarSearch />
            </div>
          )}

          {/* Right side - User menu or auth buttons */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <UserMenu user={user} profile={profile} handleSignOut={signOut} canCreateEvents={canCreateEvents} />
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="default"
                  size={isMobile ? "sm" : "sm"}
                  onClick={handleSignInClick}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size={isMobile ? "sm" : "sm"}
                  onClick={handleRegisterClick}
                  className="text-xs sm:text-sm px-2 sm:px-3"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile search bar */}
        {isMobile && (
          <div className="px-3 pb-3 bg-white border-t border-gray-100">
            <NavbarSearch />
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNav;
