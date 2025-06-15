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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 md:space-y-4">
      <TabsList className={`
        w-full shadow-turquoise border border-[#AEF0E7]
        bg-gradient-to-r from-[#E0F7F7] via-[#FFF] to-[#FFFBEB]
        ${isMobile 
          ? 'grid grid-cols-3 h-10 gap-0.5 rounded-xl'
          : 'grid grid-cols-5 h-9 rounded-xl'
        }
        p-0.5
      `}>
        <TabsTrigger 
          value="all-friends" 
          className={`
            ${isMobile 
              ? 'flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[11px] rounded-lg min-h-0'
              : 'flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg min-h-0'
            }
            whitespace-nowrap font-semibold transition-all data-[state=active]:bg-brand-turquoise data-[state=active]:text-white data-[state=active]:shadow-turquoise hover:bg-yellow-50 hover:text-ocean-deep
          `}
        >
          <Users className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Friends' : 'All Friends'}
          </span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="suggestions" 
          className={`
            ${isMobile 
              ? 'flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[11px] relative rounded-lg min-h-0'
              : 'relative flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg min-h-0'
            }
            whitespace-nowrap font-semibold transition-all data-[state=active]:bg-brand-turquoise data-[state=active]:text-white data-[state=active]:shadow-turquoise hover:bg-yellow-50 hover:text-ocean-deep
          `}
        >
          <UserPlus className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Discover' : 'Suggestions'}
          </span>
          {suggestedFriendsCount > 0 && (
            <Badge 
              variant="secondary" 
              className={`
                absolute ${isMobile ? '-top-1 -right-1' : '-top-1 -right-1'} 
                h-3.5 w-3.5 p-0 flex items-center justify-center 
                text-[9px] bg-brand-seafoam text-brand-turquoise border border-brand-turquoise shadow-turquoise
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
              ? 'flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[11px] relative rounded-lg min-h-0'
              : 'relative flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg min-h-0'
            }
            whitespace-nowrap font-semibold transition-all data-[state=active]:bg-[#FB7185] data-[state=active]:text-white data-[state=active]:shadow-turquoise hover:bg-yellow-50 hover:text-ocean-deep
          `}
        >
          <Bell className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span className={isMobile ? 'leading-none' : ''}>
            {isMobile ? 'Requests' : 'Requests'}
          </span>
          {pendingRequestsCount > 0 && (
            <Badge 
              variant="destructive" 
              className={`
                absolute ${isMobile ? '-top-1 -right-1' : '-top-1 -right-1'}
                h-3.5 w-3.5 p-0 flex items-center justify-center 
                text-[9px] bg-pastel-coral text-[#FF5C57] border border-[#FF5C57] shadow-turquoise
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
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg whitespace-nowrap font-semibold text-sm min-h-0 transition-all data-[state=active]:bg-brand-turquoise data-[state=active]:text-white data-[state=active]:shadow-turquoise hover:bg-yellow-50 hover:text-ocean-deep"
            >
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="casual-plans" 
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg whitespace-nowrap font-semibold text-sm min-h-0 transition-all data-[state=active]:bg-brand-turquoise data-[state=active]:text-white data-[state=active]:shadow-turquoise hover:bg-yellow-50 hover:text-ocean-deep"
            >
              <MapPin className="h-4 w-4" />
              Casual Plans
            </TabsTrigger>
          </>
        )}
      </TabsList>

      {/* Mobile secondary tabs for Events and Casual Plans */}
      {isMobile && (activeTab === 'events' || activeTab === 'casual-plans') && (
        <div className="flex gap-1 px-0.5 mt-1">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'events' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Calendar className="h-3 w-3" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('casual-plans')}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'casual-plans' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <MapPin className="h-3 w-3" />
            Plans
          </button>
        </div>
      )}

      {/* Show Events/Plans access buttons on mobile for main tabs */}
      {isMobile && ['all-friends', 'suggestions', 'requests'].includes(activeTab) && (
        <div className="flex gap-1 px-0.5 mt-1">
          <button
            onClick={() => setActiveTab('events')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Calendar className="h-3 w-3" />
            View Events
          </button>
          <button
            onClick={() => setActiveTab('casual-plans')}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <MapPin className="h-3 w-3" />
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
