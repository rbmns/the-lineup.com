
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Star, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatorStatus } from '@/hooks/useCreatorStatus';

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { canCreateEvents } = useCreatorStatus();

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

  if (isMobile) {
    // Mobile horizontal layout at bottom with centered create button
    return (
      <div className="flex items-center justify-center h-full px-2 bg-white border-t border-gray-200 safe-area-bottom">
        {/* First two nav items */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-3 min-w-0 flex-1 transition-colors rounded-lg",
                isActive
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Centered Create Button */}
        {isAuthenticated && canCreateEvents && (
          <Link
            to="/events/create"
            className="flex flex-col items-center justify-center p-2 transition-colors rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg mx-4"
          >
            <Plus className="h-7 w-7" />
            <span className="text-xs font-medium mt-1">Create</span>
          </Link>
        )}

        {/* Last two nav items */}
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-3 min-w-0 flex-1 transition-colors rounded-lg",
                isActive
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
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
