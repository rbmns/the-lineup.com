
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
        w-full bg-muted p-1
        ${isMobile 
          ? 'grid grid-cols-3 h-auto gap-1' 
          : 'grid grid-cols-5 h-10'
        }
      `}>
        <TabsTrigger 
          value="all-friends" 
          className={`
            ${isMobile 
              ? 'flex flex-col items-center gap-1 px-1 py-2 text-xs' 
              : 'flex items-center gap-2 px-3 py-1.5 text-sm'
            }
            whitespace-nowrap rounded-sm font-medium transition-all
          `}
        >
          <Users className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Friends' : 'All Friends'}
          </span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="suggestions" 
          className={`
            ${isMobile 
              ? 'flex flex-col items-center gap-1 px-1 py-2 text-xs relative' 
              : 'relative flex items-center gap-2 px-3 py-1.5 text-sm'
            }
            whitespace-nowrap rounded-sm font-medium transition-all
          `}
        >
          <UserPlus className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Discover' : 'Suggestions'}
          </span>
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className={`
                absolute ${isMobile ? '-top-0.5 -right-0.5' : '-top-1 -right-1'} 
                h-4 w-4 p-0 flex items-center justify-center 
                text-[10px] bg-blue-500 text-white
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
              ? 'flex flex-col items-center gap-1 px-1 py-2 text-xs relative' 
              : 'relative flex items-center gap-2 px-3 py-1.5 text-sm'
            }
            whitespace-nowrap rounded-sm font-medium transition-all
          `}
        >
          <Bell className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Requests' : 'Requests'}
          </span>
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className={`
                absolute ${isMobile ? '-top-0.5 -right-0.5' : '-top-1 -right-1'}
                h-4 w-4 p-0 flex items-center justify-center 
                text-[10px]
              `}
            >
              {pendingRequestsCount}
            </Badge>
          )}
        </TabsTrigger>
        
        {!isMobile && (
          <>
            <TabsTrigger 
              value="events" 
              className="flex items-center gap-2 px-3 py-1.5 whitespace-nowrap rounded-sm text-sm font-medium transition-all"
            >
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>

            <TabsTrigger 
              value="casual-plans" 
              className="flex items-center gap-2 px-3 py-1.5 whitespace-nowrap rounded-sm text-sm font-medium transition-all"
            >
              <MapPin className="h-4 w-4" />
              Casual Plans
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {/* Mobile secondary tabs for Events and Casual Plans */}
      {isMobile && (activeTab === 'events' || activeTab === 'casual-plans') && (
        <div className="flex gap-2 px-1">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'events' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('casual-plans')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'casual-plans' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Plans
          </button>
        </div>
      )}

      {/* Show Events/Plans access buttons on mobile for main tabs */}
      {isMobile && ['all-friends', 'suggestions', 'requests'].includes(activeTab) && (
        <div className="flex gap-2 px-1">
          <button
            onClick={() => setActiveTab('events')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            View Events
          </button>
          <button
            onClick={() => setActiveTab('casual-plans')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            View Plans
          </button>
        </div>
      )}

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
