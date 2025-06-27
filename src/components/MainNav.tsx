
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { AuthOverlay } from '@/components/auth/AuthOverlay';
import { NavActions } from './nav/NavActions';

const MainNav = () => {
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const isMobile = useIsMobile();

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleAuthRequired = () => {
    setShowAuthOverlay(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-coconut border-b border-overcast">
        <div className="w-full flex flex-col">
          <div className={cn(
            "w-full flex items-center justify-between",
            isMobile ? "px-3 py-2" : "px-4 py-2.5"
          )}>
            {/* Left side - Logo */}
            <div className="flex items-center h-full flex-shrink-0">
              {!isMobile && (
                <Link to="/" className="flex items-center justify-center mr-3 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                    alt="thelineup Symbol" 
                    className="w-6 h-6 transition-opacity hover:opacity-80" 
                  />
                </Link>
              )}
              <BrandLogo 
                showText={true} 
                className="font-display text-lg text-midnight hover:text-overcast transition-colors" 
              />
            </div>

            {/* Right side - Actions */}
            <NavActions />
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
