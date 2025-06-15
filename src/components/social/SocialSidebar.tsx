
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';
import { SidebarToggle } from './SidebarToggle';

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  visible = true,
  onToggleVisibility,
}) => {
  const { user } = useAuth();

  // Closed state: show right arrow fixed on the far right
  if (!visible) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <SidebarToggle visible={false} onToggle={onToggleVisibility} />
      </div>
    );
  }

  // Open state: show sidebar AND the close (left) arrow, fixed just to the left of sidebar
  return (
    <>
      {/* Close arrow -- fixed to the left of the sidebar (outside the sidebar, so not affected by overflow) */}
      <div className="fixed right-[224px] top-1/2 transform -translate-y-1/2 z-50">
        <SidebarToggle visible={true} onToggle={onToggleVisibility} />
      </div>
      {/* Sidebar content */}
      <div className="h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
        <div className="p-4 space-y-4">
          <SocialHeader />
          {!user && <SignUpPrompt />}
          <CommunitySection />
        </div>
      </div>
    </>
  );
};
