
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
          </div>
          
          <div className="flex justify-center mx-1">
            <NavItems className="gap-3 md:gap-6" showIconsOnly={isMobile} />
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-6">
            {isAuthenticated && user ? (
              <UserMenu user={user} profile={profile} handleSignOut={signOut} />
            ) : (
              <div className="flex items-center">
                {isMobile ? (
                  <Button 
                    onClick={handleSignInClick}
                    variant="default" 
                    size="sm" 
                    className="font-inter bg-black text-white hover:bg-black/90"
                  >
                    Sign in
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={handleSignInClick}
                      variant="outline" 
                      size="sm" 
                      className="font-inter"
                    >
                      Sign in
                    </Button>
                    <Button 
                      onClick={handleRegisterClick} 
                      className="bg-black hover:bg-black/90 text-white font-inter" 
                      size="sm"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
