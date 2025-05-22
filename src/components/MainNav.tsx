
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NavItems } from '@/components/nav/NavItems';
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
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center">
            <BrandLogo showText={!isMobile} />
            
            {/* Add NavItems to the right of the logo */}
            <div className="ml-4 hidden md:block">
              <NavItems />
            </div>
          </div>
          
          {/* Mobile NavItems */}
          <div className="md:hidden">
            <NavItems showIconsOnly={true} />
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <UserMenu user={user} profile={profile} handleSignOut={signOut} />
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignInClick}
                  className="hidden sm:flex"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={handleRegisterClick}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
