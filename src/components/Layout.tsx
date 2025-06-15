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
        {/* Left sidebar - Desktop only */}
        {!isMobile && (
          <div className="fixed left-0 top-0 bottom-0 w-16 bg-white z-30 border-r border-gray-200">
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
        >
          <main className="bg-white w-full min-h-full">
            <Outlet />
          </main>
          {/* Footer - Desktop only */}
          {!isMobile && <Footer />}
        </div>

        {/* Right Social Sidebar - Desktop only, wider */}
        {!isMobile && (
          <div className="fixed right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-200 z-30">
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
