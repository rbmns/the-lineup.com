
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/ui/brand-logo';
import UserMenu from '@/components/nav/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
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
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-driftwood-grey/30' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className={cn(
        "w-full h-16 flex items-center justify-between",
        isMobile ? "px-4" : "pl-0 pr-6 lg:pr-8" // remove left padding, keep right padding
      )}>
        {/* Left side - Icon flush left + wordmark (no gap before icon) */}
        <div className="flex items-center h-16 flex-shrink-0">
          {/* Symbol icon should perfectly align with sidebar icon column, flush left */}
          <Link to="/" className="flex items-center justify-center w-16 h-16 mr-0 pl-0">
            <img 
              src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
              alt="thelineup Symbol"
              className="w-8 h-8"
              style={{ display: 'block' }}
            />
          </Link>
          {/* Brand wordmark directly after - no extra gap */}
          <BrandLogo showText={true} className="ml-0" />
        </div>
        {/* Right side - User menu or auth buttons */}
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {isAuthenticated && user ? (
            <UserMenu user={user} profile={profile} handleSignOut={signOut} />
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size={isMobile ? "sm" : "sm"} 
                onClick={handleSignInClick} 
                className="text-sm font-medium text-ocean-deep hover:text-seafoam-green hover:bg-sand/50"
              >
                Sign in
              </Button>
              <Button 
                size={isMobile ? "sm" : "sm"} 
                onClick={handleRegisterClick} 
                className="btn-ocean text-white text-sm font-medium"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNav;
