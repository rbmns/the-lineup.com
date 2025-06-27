
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect } from "react";
import { useLocation, Routes, Route } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import Home from '@/pages/Home';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEdit from '@/pages/ProfileEdit';
import Events from '@/pages/Events';
import EventDetailPage from '@/pages/events/EventDetailPage';
import CreateEvent from '@/pages/events/create';
import OrganisePage from '@/pages/OrganisePage';
import CreateVenuePage from '@/pages/CreateVenuePage';
import CasualPlans from '@/pages/CasualPlans';
import CreateCasualPlanPage from '@/components/casual-plans/CreateCasualPlanPage';
import CreateEventSimple from '@/pages/CreateEventSimple';

const TOP_NAV_HEIGHT = 48;
const LEFT_SIDEBAR_WIDTH = 64;
const MOBILE_BOTTOM_NAV_HEIGHT = 64;

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  useScrollToTop();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-sand">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only */}
        {!isMobile && (
          <div
            className="fixed left-0 bg-sand"
            style={{
              top: TOP_NAV_HEIGHT,
              bottom: 0,
              width: LEFT_SIDEBAR_WIDTH,
              zIndex: 30,
              height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            }}
          >
            <LeftSidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-1 w-full min-h-screen bg-sand flex flex-col"
          style={
            !isMobile
              ? {
                  paddingTop: TOP_NAV_HEIGHT,
                  paddingLeft: LEFT_SIDEBAR_WIDTH,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
                }
              : {
                  paddingTop: TOP_NAV_HEIGHT,
                  paddingBottom: MOBILE_BOTTOM_NAV_HEIGHT,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT + MOBILE_BOTTOM_NAV_HEIGHT}px)`,
                }
          }
        >
          {/* Main content with coastal spacing */}
          <main className="w-full flex-1 flex flex-col">
            <div className={`flex-1 flex flex-col ${!isHomePage ? 'py-6 px-4' : ''}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:eventId" element={<EventDetailPage />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/organise" element={<OrganisePage />} />
                <Route path="/venues/create" element={<CreateVenuePage />} />
                <Route path="/casual-plans" element={<CasualPlans />} />
                <Route path="/casual-plans/create" element={<CreateCasualPlanPage />} />
                <Route path="/events/create-simple" element={<CreateEventSimple />} />
              </Routes>
            </div>
          </main>
          {!isMobile && <Footer />}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-sand z-50 border-t border-overcast"
          style={{ 
            height: MOBILE_BOTTOM_NAV_HEIGHT,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <LeftSidebar />
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
