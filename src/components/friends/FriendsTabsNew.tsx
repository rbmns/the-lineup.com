
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Bell, Calendar, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FriendsTabsNewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount: number;
  suggestedFriendsCount: number;
  allFriendsContent: React.ReactNode;
  suggestionsContent: React.ReactNode;
  requestsContent: React.ReactNode;
  eventsContent: React.ReactNode;
  casualPlansContent: React.ReactNode;
}

export const FriendsTabsNew = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
  suggestedFriendsCount,
  allFriendsContent,
  suggestionsContent,
  requestsContent,
  eventsContent,
  casualPlansContent
}: FriendsTabsNewProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
      <TabsList className={`
        ${isMobile 
          ? 'flex flex-wrap h-auto p-1 gap-1' 
          : 'grid grid-cols-5 h-10 p-1'
        } 
        w-full bg-muted
      `}>
        <TabsTrigger 
          value="all-friends" 
          className={`
            ${isMobile 
              ? 'flex-1 min-w-[calc(50%-2px)] text-xs px-2 py-2' 
              : 'flex items-center gap-2 px-3 py-1.5'
            }
            whitespace-nowrap rounded-sm text-sm font-medium transition-all
          `}
        >
          <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'hidden xs:inline' : ''}>All Friends</span>
          <span className={isMobile ? 'xs:hidden' : 'hidden'}>Friends</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="suggestions" 
          className={`
            ${isMobile 
              ? 'flex-1 min-w-[calc(50%-2px)] text-xs px-2 py-2 relative' 
              : 'relative flex items-center gap-2 px-3 py-1.5'
            }
            whitespace-nowrap rounded-sm text-sm font-medium transition-all
          `}
        >
          <UserPlus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'hidden xs:inline' : ''}>Suggestions</span>
          <span className={isMobile ? 'xs:hidden' : 'hidden'}>Suggest</span>
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className={`
                absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center 
                ${isMobile ? 'text-[10px]' : 'text-xs'} 
                bg-blue-500 text-white
              `}
            >
              {suggestedFriendsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="requests" 
          className={`
            ${isMobile 
              ? 'flex-1 min-w-[calc(50%-2px)] text-xs px-2 py-2 relative' 
              : 'relative flex items-center gap-2 px-3 py-1.5'
            }
            whitespace-nowrap rounded-sm text-sm font-medium transition-all
          `}
        >
          <Bell className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'hidden xs:inline' : ''}>Requests</span>
          <span className={isMobile ? 'xs:hidden' : 'hidden'}>Req</span>
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className={`
                absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center 
                ${isMobile ? 'text-[10px]' : 'text-xs'}
              `}
            >
              {pendingRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="events" 
          className={`
            ${isMobile 
              ? 'flex-1 min-w-[calc(50%-2px)] text-xs px-2 py-2' 
              : 'flex items-center gap-2 px-3 py-1.5'
            }
            whitespace-nowrap rounded-sm text-sm font-medium transition-all
          `}
        >
          <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'hidden xs:inline' : ''}>Events</span>
          <span className={isMobile ? 'xs:hidden' : 'hidden'}>Events</span>
        </TabsTrigger>

        <TabsTrigger 
          value="casual-plans" 
          className={`
            ${isMobile 
              ? 'flex-1 w-full text-xs px-2 py-2' 
              : 'flex items-center gap-2 px-3 py-1.5'
            }
            whitespace-nowrap rounded-sm text-sm font-medium transition-all
          `}
        >
          <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'hidden xs:inline' : ''}>Casual Plans</span>
          <span className={isMobile ? 'xs:hidden' : 'hidden'}>Plans</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-friends" className="space-y-4">
        {allFriendsContent}
      </TabsContent>

      <TabsContent value="suggestions" className="space-y-4">
        {suggestionsContent}
      </TabsContent>

      <TabsContent value="requests" className="space-y-4">
        {requestsContent}
      </TabsContent>

      <TabsContent value="events" className="space-y-4">
        {eventsContent}
      </TabsContent>

      <TabsContent value="casual-plans" className="space-y-4">
        {casualPlansContent}
      </TabsContent>
    </Tabs>
  );
};
