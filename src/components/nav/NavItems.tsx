
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, Heart } from 'lucide-react';
import { useFriendRequests } from '@/hooks/useFriendRequests';

export const NavItems = ({ className }: { className?: string }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { requests: friendRequestsData = [], refreshRequests } = useFriendRequests(user?.id);
  const [friendRequests, setFriendRequests] = useState(0);
  
  // Force refetch when entering the Friends page to ensure badge is updated
  useEffect(() => {
    if (location.pathname === '/friends' && refreshRequests) {
      refreshRequests();
    }
  }, [location.pathname, refreshRequests]);
  
  // Update the friend request count when requests change
  useEffect(() => {
    // Only count incoming friend requests (pending status)
    const incomingRequests = Array.isArray(friendRequestsData) ? friendRequestsData.length : 0;
    
    setFriendRequests(incomingRequests);
    console.log("Friend requests updated:", incomingRequests);
    
    // Add debug info
    if (incomingRequests > 0) {
      console.log("Incoming friend requests:", friendRequestsData);
    }
  }, [friendRequestsData]);

  const navItems = [
    {
      name: 'Events',
      path: '/events',
      icon: <CalendarDays size={20} />,
      isActive: (pathname: string) => pathname === '/events' || pathname.startsWith('/events/') || pathname === '/' || pathname.startsWith('/venues/'),
    },
    {
      name: 'Friends',
      path: '/friends',
      icon: <Heart size={20} />,
      isActive: (pathname: string) => pathname === '/friends' || pathname.startsWith('/users'),
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-6", className)}>
      {navItems.map((item) => {
        const isActive = item.isActive(location.pathname);
        // Only show badge if there are incoming requests (greater than 0) and this is the Friends nav item
        const showBadge = item.name === 'Friends' && friendRequests > 0;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              'flex items-center gap-2 py-1 font-medium text-sm transition-colors relative',
              isActive 
                ? 'text-black' 
                : 'text-gray-600 hover:text-black'
            )}
          >
            <span className={cn(
              'inline-flex',
              isActive ? 'text-black' : 'text-gray-500'
            )}>
              {item.icon}
            </span>
            <span className="relative hidden md:inline">
              {item.name}
              {showBadge && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                  {friendRequests}
                </span>
              )}
            </span>
            {/* Mobile badge */}
            {showBadge && (
              <span className="absolute -top-1 -right-1 md:hidden flex h-3 w-3 items-center justify-center rounded-full bg-black">
                <span className="sr-only">{friendRequests} friend requests</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
