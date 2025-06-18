
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { NavbarSearch } from './nav/NavbarSearch';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { MobileSearch } from './nav/MobileSearch';
import { NavActions } from './nav/NavActions';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleAuthRequired = () => {
    setShowAuthOverlay(true);
  };

  const mobileHeaderHeight = isMobile ? (showMobileSearch ? 'h-[112px]' : 'h-16') : 'h-16';

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/90 backdrop-blur-sm",
        mobileHeaderHeight
      )}>
        <div className="w-full flex flex-col">
          <div className={cn(
            "w-full flex items-center justify-between",
            isMobile ? "h-16 px-3 gap-2" : "h-16 px-6 lg:px-8 gap-4"
          )}>
            {/* Left side - Logo */}
            <div className={cn(
              "flex items-center h-full flex-shrink-0",
              isMobile ? "min-w-0 max-w-[140px]" : "min-w-0"
            )}>
              {!isMobile && (
                <Link to="/" className="flex items-center justify-center mr-2 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                    alt="thelineup Symbol" 
                    className="w-7 h-7" 
                    style={{ display: 'block' }} 
                  />
                </Link>
              )}
              <BrandLogo 
                showText={true} 
                className={cn(
                  "ml-0 min-w-0",
                  isMobile && "max-w-[100px] overflow-hidden"
                )} 
              />
            </div>

            {/* Center-Right - Search Bar for desktop */}
            {!isMobile && (
              <div className="flex-1 flex justify-end max-w-md mr-4">
                <NavbarSearch />
              </div>
            )}

            {/* Right side - Actions */}
            <NavActions 
              toggleMobileSearch={toggleMobileSearch}
              onAuthRequired={handleAuthRequired}
            />
          </div>
          
          {/* Mobile search bar */}
          <MobileSearch showMobileSearch={showMobileSearch} />
        </div>
      </header>

      {/* Auth Overlay */}
      {showAuthOverlay && (
        <AuthOverlay
          title="Join to Create Events"
          description="Sign up or log in to create and organize your own events!"
          browseEventsButton={true}
          onClose={handleCloseAuthOverlay}
          onBrowseEvents={handleCloseAuthOverlay}
        >
          <></>
        </AuthOverlay>
      )}
    </>
  );
};

export default MainNav;
