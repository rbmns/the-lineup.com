
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { NavActions } from './nav/NavActions';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleAuthRequired = () => {
    setShowAuthOverlay(true);
  };

  const mobileHeaderHeight = 'h-16';

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-b border-white/10",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-ocean border-primary/10" 
          : "bg-white/90 backdrop-blur-sm border-white/20",
        mobileHeaderHeight
      )}>
        <div className="w-full flex flex-col">
          <div className={cn(
            "w-full flex items-center justify-between",
            isMobile ? "h-16 px-4 gap-3" : "h-16 px-6 lg:px-8 gap-4"
          )}>
            {/* Left side - Logo */}
            <div className={cn(
              "flex items-center h-full flex-shrink-0",
              isMobile ? "min-w-0 max-w-[140px]" : "min-w-0"
            )}>
              {!isMobile && (
                <Link to="/" className="flex items-center justify-center mr-3 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                    alt="thelineup Symbol" 
                    className="w-8 h-8 transition-transform hover:scale-105" 
                    style={{ display: 'block' }} 
                  />
                </Link>
              )}
              <BrandLogo 
                showText={true} 
                className={cn(
                  "ml-0 min-w-0 transition-opacity hover:opacity-80",
                  isMobile && "max-w-[100px] overflow-hidden"
                )} 
              />
            </div>

            {/* Right side - Actions */}
            <NavActions 
              onAuthRequired={handleAuthRequired}
            />
          </div>
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
