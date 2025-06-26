
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect } from "react";
import { useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const TOP_NAV_HEIGHT = 64;
const LEFT_SIDEBAR_WIDTH = 80;
const MOBILE_BOTTOM_NAV_HEIGHT = 80;

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  useScrollToTop();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-warm-neutral">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only */}
        {!isMobile && (
          <div
            className="fixed left-0 bg-warm-neutral"
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
          className="flex-1 w-full min-h-screen bg-warm-neutral flex flex-col"
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
          {/* Main content with editorial spacing */}
          <main className="w-full flex-1 flex flex-col">
            <div className={`flex-1 flex flex-col ${!isHomePage ? 'py-8 px-6' : ''}`}>
              <Outlet />
            </div>
          </main>
          {!isMobile && <Footer />}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div 
          className="fixed bottom-0 left-0 right-0 bg-warm-neutral z-50 border-t border-clay"
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
