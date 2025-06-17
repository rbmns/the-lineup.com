
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
import { Search } from 'lucide-react';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
  const {
    canCreateEvents
  } = useCreatorStatus();
  const {
    isAdmin
  } = useAdminData();
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

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Calculate total header height for mobile
  const mobileHeaderHeight = isMobile ? (showMobileSearch ? 'h-[112px]' : 'h-16') : 'h-16';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/90 backdrop-blur-sm",
      mobileHeaderHeight
    )}>
      <div className="w-full flex flex-col">
        <div className={cn(
          "w-full flex items-center justify-between gap-2 sm:gap-4",
          isMobile ? "h-16 px-4" : "h-16 px-6 lg:px-8"
        )}>
          {/* Left side - Logo */}
          <div className="flex items-center h-full flex-shrink-0 min-w-0">
            <Link to="/" className="flex items-center justify-center mr-3 flex-shrink-0">
              <img 
                src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                alt="thelineup Symbol" 
                className={isMobile ? "w-6 h-6" : "w-7 h-7"} 
                style={{ display: 'block' }} 
              />
            </Link>
            <BrandLogo showText={!isMobile} className="ml-0 min-w-0" />
          </div>

          {/* Center-Right - Search Bar for desktop */}
          {!isMobile && (
            <div className="flex-1 flex justify-end max-w-md mr-4">
              <NavbarSearch />
            </div>
          )}

          {/* Right side - Search icon + User menu or auth buttons */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            {/* Mobile Search Icon */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileSearch}
                className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {isAuthenticated && user ? (
              <>
                {isAdmin && (
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="sm" 
                    className="hidden md:inline-flex text-gray-700 hover:text-gray-900"
                  >
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <div className={isMobile ? "w-10 h-10" : ""}>
                  <UserMenu 
                    user={user} 
                    profile={profile} 
                    handleSignOut={signOut} 
                    canCreateEvents={canCreateEvents} 
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={handleSignInClick} 
                  className={cn(
                    "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                    isMobile ? "text-sm px-3 py-2" : "text-sm px-4"
                  )}
                >
                  Sign in
                </Button>
                <Button 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={handleRegisterClick} 
                  className={cn(
                    "bg-gray-900 hover:bg-gray-800 text-white rounded-full",
                    isMobile ? "text-sm px-4 py-2" : "text-sm px-6"
                  )}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile search bar with proper spacing */}
        {isMobile && showMobileSearch && (
          <div className="h-14 px-4 py-2 bg-white flex items-center border-t border-gray-200">
            <NavbarSearch />
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNav;
