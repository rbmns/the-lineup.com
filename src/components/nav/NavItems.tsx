
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemsProps {
  className?: string;
  showIconsOnly?: boolean;
}

export const NavItems: React.FC<NavItemsProps> = ({ 
  className = "",
  showIconsOnly = false 
}) => {
  const location = useLocation();

  const navItems = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/casual-plans', label: 'Casual Plans', icon: Sparkle },
    { href: '/friends', label: 'Friends', icon: Users },
  ];

  return (
    <nav className={cn("flex items-center", className)}>
      <div className="flex space-x-1 md:space-x-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={href}
              to={href}
              state={{ from: location.pathname }}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                showIconsOnly && "px-2"
              )}
            >
              <Icon className={cn("h-4 w-4", !showIconsOnly && "mr-2")} />
              {!showIconsOnly && <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
