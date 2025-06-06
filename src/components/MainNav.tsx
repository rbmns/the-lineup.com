
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/ui/brand-logo';
import UserMenu from '@/components/nav/UserMenu';
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
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    } border-b border-gray-200`}>
      <div className={cn(
        "w-full h-16 flex items-center justify-between",
        isMobile ? "px-4" : "px-6 lg:px-8"
      )}>
        {/* Left side - Logo aligned to left */}
        <div className="flex items-center flex-shrink-0">
          <BrandLogo showText={true} />
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
                className="text-sm font-medium"
              >
                Sign in
              </Button>
              <Button
                size={isMobile ? "sm" : "sm"}
                onClick={handleRegisterClick}
                className="text-sm font-medium"
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
