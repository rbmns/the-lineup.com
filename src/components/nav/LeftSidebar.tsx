
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Coffee, Home } from 'lucide-react';
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
      icon: Coffee,
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
      <div className="flex items-center justify-around py-2 px-1 bg-white">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center p-2 min-w-0 flex-1 transition-colors",
                isActive 
                  ? "text-blue-600" 
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mb-1",
                isActive ? "text-blue-600" : "text-gray-600"
              )} />
              <span className={cn(
                "text-xs font-medium truncate",
                isActive ? "text-blue-600" : "text-gray-600"
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
    <div className="h-full flex flex-col items-center py-4 space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors group w-12",
              isActive 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 mb-1",
              isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
            )} />
            <span className={cn(
              "text-[10px] font-medium text-center leading-tight",
              isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
