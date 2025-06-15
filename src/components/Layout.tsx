import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/MainNav";
import LeftSidebar from "@/components/nav/LeftSidebar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/CookieConsent";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";
import { SocialSidebar } from "@/components/social/SocialSidebar";

const TOP_NAV_HEIGHT = 56; // px, matches h-14
const LEFT_SIDEBAR_WIDTH = 80; // px, matches w-20
const RIGHT_SIDEBAR_WIDTH = 224; // px, matches w-56

const Layout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only, start below navbar */}
        {!isMobile && (
          <div
            className="fixed left-0 sidebar-zoning"
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
          className={`flex-1 w-full min-h-screen main-feed-gradient ${
            isMobile
              ? 'pb-24 px-2'
              : rightSidebarVisible
                ? 'pl-24 pr-64 px-2'
                : 'pl-24 px-2'
          } flex flex-col`}
          style={
            !isMobile
              ? {
                  // Always only the height of the nav so content isn't behind it, nothing extra
                  paddingTop: TOP_NAV_HEIGHT,
                  paddingLeft: LEFT_SIDEBAR_WIDTH + 16,
                  paddingRight: rightSidebarVisible ? (RIGHT_SIDEBAR_WIDTH + 16) : 16,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
                  boxSizing: 'border-box',
                }
              : { }
          }
        >
          <main className="main-feed-gradient w-full min-h-full max-w-3xl mx-auto flex-1 flex flex-col">
            {/* Give vertical space on top/bottom, so the card isn't against edge */}
            <div className="flex-1 flex flex-col justify-center py-4">
              <Outlet />
            </div>
          </main>
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>

        {/* Right Social Sidebar - Desktop only */}
        {!isMobile && (
          <div
            className={`fixed right-0 sidebar-zoning`}
            style={{
              top: TOP_NAV_HEIGHT,
              bottom: 0,
              width: RIGHT_SIDEBAR_WIDTH,
              zIndex: 30,
              height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
              display: rightSidebarVisible ? "block" : "none",
            }}
          >
            <SocialSidebar
              visible={rightSidebarVisible}
              onToggleVisibility={toggleRightSidebar}
            />
          </div>
        )}
      </div>

      {/* Mobile Navigation - Fixed to bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card z-50 safe-area-pb border-t border-border">
          <LeftSidebar />
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
