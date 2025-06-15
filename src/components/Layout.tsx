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
const LEFT_SIDEBAR_WIDTH = 64; // px, matches w-16
const RIGHT_SIDEBAR_WIDTH = 288; // px, matches w-72

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
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <MainNav />
      <div className="flex w-full min-h-screen">
        {/* Left sidebar - Desktop only, start below navbar */}
        {!isMobile && (
          <div
            className="fixed left-0 border-r border-gray-200"
            style={{
              top: TOP_NAV_HEIGHT,
              bottom: 0,
              width: LEFT_SIDEBAR_WIDTH,
              zIndex: 30,
              background: "#fff",
              height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
            }}
          >
            <LeftSidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 w-full min-h-screen ${
            isMobile
              ? 'pt-14 pb-20'
              : rightSidebarVisible
                ? 'pt-14 pl-16 pr-72'
                : 'pt-14 pl-16'
          }`}
          style={
            !isMobile
              ? {
                  paddingTop: TOP_NAV_HEIGHT,
                  paddingLeft: LEFT_SIDEBAR_WIDTH,
                  paddingRight: rightSidebarVisible ? RIGHT_SIDEBAR_WIDTH : 0,
                  minHeight: `calc(100vh - ${TOP_NAV_HEIGHT}px)`,
                }
              : undefined
          }
        >
          <main className="bg-white w-full min-h-full">
            <Outlet />
          </main>
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>

        {/* Right Social Sidebar - Desktop only */}
        {!isMobile && (
          <div
            className={`fixed right-0 border-l border-gray-200`}
            style={{
              top: TOP_NAV_HEIGHT,
              bottom: 0,
              width: RIGHT_SIDEBAR_WIDTH,
              zIndex: 30,
              background: "#fff",
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
        <div className="fixed bottom-0 left-0 right-0 bg-white z-50 safe-area-pb">
          <LeftSidebar />
        </div>
      )}

      <Toaster />
      <CookieConsent />
    </div>
  );
};

export default Layout;
