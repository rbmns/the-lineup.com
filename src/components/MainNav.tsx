
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
        isMobile ? "px-4" : "px-6 lg:px-8"
      )}>
        {/* Left side - Logo symbol vertically aligned with LeftSidebar icons */}
        <div className="flex items-center gap-2 flex-shrink-0 h-16">
          {/* Icon column: mimic the same w-16 as LeftSidebar icon column */}
          <Link to="/" className="flex items-center justify-center w-16 h-16">
            <img 
              src="/lovable-uploads/272de8da-6e0c-40fd-a1b7-9f82414ed290.png" 
              alt="TheLineup Icon" 
              className="w-8 h-8" // Match the LeftSidebar icons (h-6/w-6 or h-8/w-8 for more presence)
            />
          </Link>
          {/* Brand wordmark stays as before */}
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

