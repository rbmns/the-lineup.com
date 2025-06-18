
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';
import { AuthOverlay } from '@/components/auth/AuthOverlay';

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const {
    canCreateEvents,
    creatorRequestStatus,
    isLoading: isCreatorStatusLoading
  } = useCreatorStatus();
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/events',
      icon: Calendar,
      label: 'Events',
    },
    {
      path: '/casual-plans',
      icon: Star,
      label: 'Plans',
    },
    {
      path: '/friends',
      icon: Users,
      label: 'Friends',
    },
  ];

  // Add Organise option for mobile
  if (isMobile) {
    navItems.push({
      path: '/organise',
      icon: Plus,
      label: 'Organise',
    });
  }

  const handleOrganiseClick = () => {
    if (!isAuthenticated) {
      setShowAuthOverlay(true);
      return;
    }
    
    if (isCreatorStatusLoading) return;
    
    const hasPermission = canCreateEvents || creatorRequestStatus === 'approved';
    
    if (hasPermission) {
      navigate('/events/create');
    } else {
      navigate('/events');
    }
  };

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
  };

  if (isMobile) {
    // Mobile horizontal layout at bottom
    return (
      <>
        <div className="flex items-center justify-around h-full px-4 bg-white border-t border-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isOrganise = item.path === '/organise';

            if (isOrganise) {
              return (
                <button
                  key={item.path}
                  onClick={handleOrganiseClick}
                  disabled={isCreatorStatusLoading}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 min-w-0 transition-colors",
                    "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 min-w-0 transition-colors",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Auth Overlay for mobile organise */}
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
  }

  // Desktop vertical layout
  return (
    <div className="h-full flex flex-col items-center w-20 bg-card">
      <div className="flex flex-col flex-1 items-center justify-start py-4 space-y-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 rounded-lg transition-colors group",
                isActive
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-1",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
