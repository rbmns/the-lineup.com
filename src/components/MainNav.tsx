
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

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
  const { canCreateEvents } = useCreatorStatus();
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
          "w-full h-14 flex items-center justify-between gap-4",
          isMobile ? "px-3" : "px-6"
        )}>
          {/* Left side - Icon flush left + wordmark */}
          <div className="flex items-center h-14 flex-shrink-0">
            <Link to="/" className="flex items-center justify-center mr-2">
              <img
                src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png"
                alt="thelineup Symbol"
                className="w-7 h-7"
                style={{ display: 'block' }}
              />
            </Link>
            <BrandLogo showText={!isMobile} className="ml-0" />
          </div>

          {/* Center - Search Bar */}
          {!isMobile && (
            <div className="flex-1 flex justify-center max-w-2xl">
              <NavbarSearch />
            </div>
          )}

          {/* Right side - User menu or auth buttons */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <UserMenu user={user} profile={profile} handleSignOut={signOut} canCreateEvents={canCreateEvents} />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSignInClick}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRegisterClick}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
        {isMobile && (
          <div className="px-3 pb-3">
            <NavbarSearch />
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNav;
