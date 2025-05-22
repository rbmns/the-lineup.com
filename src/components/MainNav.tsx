
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NavItems } from '@/components/nav/NavItems';
import { BrandLogo } from '@/components/ui/brand-logo';
import UserMenu from '@/components/nav/UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search } from 'lucide-react';

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
          
          <div className="flex items-center mx-auto max-w-md w-full px-3 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search events, friends..." 
                className="w-full rounded-full bg-gray-100 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isAuthenticated && user ? (
              <UserMenu user={user} profile={profile} handleSignOut={signOut} />
            ) : (
              <div className="flex items-center">
                {isMobile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-inter"
                    onClick={handleRegisterClick}
                  >
                    <span className="hidden sm:inline">Create Event</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-inter"
                    onClick={handleRegisterClick}
                  >
                    + Create Event
                  </Button>
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
