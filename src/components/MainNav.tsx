
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/ui/brand-logo';
import UserMenu from '@/components/nav/UserMenu';
import SearchBar from '@/components/nav/SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, profile, signOut } = useAuth();
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
    navigate('/login', { state: { initialMode: 'register' } });
  };

  const handleSignInClick = () => {
    console.log('Sign in button clicked, navigating to /login');
    navigate('/login');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
    } border-b border-gray-200`}>
      {/* Mobile: Two row layout */}
      {isMobile ? (
        <div className="w-full px-2">
          {/* First row: Logo and Auth buttons */}
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <BrandLogo showText={true} />
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <UserMenu user={user} profile={profile} handleSignOut={signOut} />
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignInClick}
                    className="text-xs px-2"
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRegisterClick}
                    className="text-xs px-2"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Second row: Search */}
          <div className="pb-4">
            <SearchBar />
          </div>
        </div>
      ) : (
        /* Desktop: Single row layout - full width */
        <div className="w-full px-6">
          <div className="flex h-16 items-center justify-between gap-8">
            <div className="flex items-center flex-shrink-0">
              <BrandLogo showText={true} />
            </div>
            
            {/* Center search bar - only show on non-search pages */}
            {location.pathname !== '/search' && (
              <div className="flex-1 max-w-md">
                <SearchBar />
              </div>
            )}

            <div className="flex items-center gap-3 flex-shrink-0">
              {isAuthenticated && user ? (
                <UserMenu user={user} profile={profile} handleSignOut={signOut} />
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignInClick}
                    className="text-base font-medium"
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRegisterClick}
                    className="text-base font-medium"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNav;
