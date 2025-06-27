
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
const MOBILE_BOTTOM_NAV_HEIGHT = 80;

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
        {/* Main Content Area */}
        <div
          className="flex-1 w-full min-h-screen bg-sand flex flex-col"
          style={
            !isMobile
              ? {
                  paddingTop: TOP_NAV_HEIGHT,
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
