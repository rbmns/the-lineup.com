
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
import { Search, Plus } from 'lucide-react';
import { AuthOverlay } from '@/components/auth/AuthOverlay';

const MainNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const {
    isAuthenticated,
    user,
    profile,
    signOut
  } = useAuth();
  const {
    canCreateEvents,
    creatorRequestStatus,
    isLoading: isCreatorStatusLoading
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

  const handleSignInClick = () => {
    console.log('Sign in button clicked, navigating to /login');
    navigate('/login');
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleCreateEventClick = () => {
    if (!isAuthenticated) {
      setShowAuthOverlay(true);
      return;
    }
    
    if (isCreatorStatusLoading) return;
    
    const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';
    
    if (hasPermission) {
      navigate('/events/create');
    } else {
      // Navigate to events page with info about becoming an organizer
      navigate('/events');
    }
  };

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  const handleBrowseEvents = () => {
    setShowAuthOverlay(false);
    navigate('/events');
  };

  // Calculate total header height for mobile
  const mobileHeaderHeight = isMobile ? (showMobileSearch ? 'h-[112px]' : 'h-16') : 'h-16';

  // Show create event button only if user is authenticated and has permissions OR if not authenticated (to show auth overlay)
  const shouldShowCreateButton = !isAuthenticated || (isAuthenticated && canCreateEvents);

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
              <Link to="/" className="flex items-center justify-center mr-2 flex-shrink-0">
                <img 
                  src="/lovable-uploads/dc8b26e5-f005-4563-937d-21b702cc0295.png" 
                  alt="thelineup Symbol" 
                  className={isMobile ? "w-6 h-6" : "w-7 h-7"} 
                  style={{ display: 'block' }} 
                />
              </Link>
              <BrandLogo 
                showText={!isMobile} 
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

            {/* Right side - Search icon, Create Event button + User menu or auth buttons */}
            <div className={cn(
              "flex items-center flex-shrink-0",
              isMobile ? "gap-1" : "gap-2 lg:gap-3"
            )}>
              {/* Mobile Search Icon */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileSearch}
                  className="w-9 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}

              {/* Create Event Button - only shown to event creators or non-authenticated users */}
              {shouldShowCreateButton && (
                <Button
                  onClick={handleCreateEventClick}
                  disabled={isCreatorStatusLoading}
                  className={cn(
                    "bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center gap-2 flex-shrink-0",
                    isMobile ? "text-sm px-3 py-2" : "text-sm px-4 py-2"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {!isMobile && "Create Event"}
                </Button>
              )}

              {isAuthenticated && user ? (
                <>
                  {isAdmin && !isMobile && (
                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm" 
                      className="hidden md:inline-flex text-gray-700 hover:text-gray-900"
                    >
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <div className="flex-shrink-0">
                    <UserMenu 
                      user={user} 
                      profile={profile} 
                      handleSignOut={signOut} 
                      canCreateEvents={canCreateEvents} 
                    />
                  </div>
                </>
              ) : (
                <div className={cn(
                  "flex items-center",
                  isMobile ? "gap-1" : "gap-2"
                )}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignInClick} 
                    className={cn(
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0",
                      isMobile ? "text-sm px-2 py-2" : "text-sm px-4"
                    )}
                  >
                    Sign in
                  </Button>
                  {/* Remove sign up button on mobile */}
                  {!isMobile && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/login', { state: { initialMode: 'register' } })} 
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm px-6 flex-shrink-0"
                    >
                      Sign Up
                    </Button>
                  )}
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

      {/* Auth Overlay for non-authenticated users clicking Create Event */}
      {showAuthOverlay && !isAuthenticated && (
        <AuthOverlay
          title="Join to Create Events"
          description="Sign up or log in to create and organize your own events!"
          browseEventsButton={true}
          onClose={handleCloseAuthOverlay}
          onBrowseEvents={handleBrowseEvents}
        >
          <></>
        </AuthOverlay>
      )}
    </>
  );
};

export default MainNav;
