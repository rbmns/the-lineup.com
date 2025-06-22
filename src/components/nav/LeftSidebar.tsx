
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Star, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

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
    // Mobile horizontal layout at bottom
    return (
      <div className="flex items-center justify-around h-full px-4 bg-white/95 backdrop-blur-md border-t border-primary/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-4 min-w-0 transition-all duration-200 rounded-lg",
                isActive
                  ? "text-primary bg-primary/5 scale-105"
                  : "text-neutral hover:text-primary hover:bg-primary/5 hover:scale-105"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1 transition-colors",
                isActive ? "text-primary" : "text-neutral"
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-neutral"
              )}>
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
    <div className="h-full flex flex-col items-center w-20 bg-white/95 backdrop-blur-md border-r border-primary/10">
      <div className="flex flex-col flex-1 items-center justify-start py-6 space-y-2 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full py-4 rounded-xl transition-all duration-200 group mx-2",
                isActive
                  ? "bg-primary/10 text-primary scale-105 shadow-sm"
                  : "text-neutral hover:text-primary hover:bg-primary/5 hover:scale-105"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mb-2 transition-colors",
                isActive ? "text-primary" : "text-neutral group-hover:text-primary"
              )} />
              <span className={cn(
                "text-[10px] font-medium text-center leading-tight transition-colors",
                isActive ? "text-primary" : "text-neutral group-hover:text-primary"
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
