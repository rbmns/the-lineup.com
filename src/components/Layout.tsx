
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const TOP_NAV_HEIGHT_MOBILE = 64; // Single nav height
const TOP_NAV_HEIGHT_DESKTOP = 64; // Desktop nav height
const LEFT_SIDEBAR_WIDTH = 64; // Reduced from 80 to 64px
const MOBILE_BOTTOM_NAV_HEIGHT = 68; // Reduced from 88 to 68px

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  // Scroll to top on route changes (except for RSVP actions)
  useScrollToTop();

  // Add viewport meta tag optimization
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=0');
    }
  }, []);

  const topNavHeight = isMobile ? TOP_NAV_HEIGHT_MOBILE : TOP_NAV_HEIGHT_DESKTOP;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only, start below navbar - more compact */}
        {!isMobile && (
          <div
            className="fixed left-0 bg-gray-50"
            style={{
              top: topNavHeight,
              bottom: 0,
              width: LEFT_SIDEBAR_WIDTH,
              zIndex: 30,
              height: `calc(100vh - ${topNavHeight}px)`,
            }}
          >
            <LeftSidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className="flex-1 w-full min-h-screen bg-white flex flex-col"
          style={
            !isMobile
              ? {
                  paddingTop: topNavHeight,
                  paddingLeft: LEFT_SIDEBAR_WIDTH,
                  minHeight: `calc(100vh - ${topNavHeight}px)`,
                  boxSizing: 'border-box',
                }
              : {
                  paddingTop: topNavHeight,
                  paddingBottom: MOBILE_BOTTOM_NAV_HEIGHT,
                  minHeight: `calc(100vh - ${topNavHeight + MOBILE_BOTTOM_NAV_HEIGHT}px)`,
                }
          }
        >
          {/* Main content with proper mobile spacing */}
          <main className="w-full flex-1 flex flex-col">
            <div className={`flex-1 flex flex-col justify-start ${!isHomePage ? (isMobile ? 'pt-2 px-3' : 'pt-4 px-4 sm:pt-6 sm:px-6') : ''}`}>
              <Outlet />
            </div>
          </main>
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>
      </div>

      {/* Mobile Navigation - Fixed to bottom with reduced height */}
      {isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-white z-50 border-t border-gray-100"
          style={{ 
            height: MOBILE_BOTTOM_NAV_HEIGHT,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            minHeight: MOBILE_BOTTOM_NAV_HEIGHT
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
