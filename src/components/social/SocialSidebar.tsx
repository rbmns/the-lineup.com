
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

  // If sidebar is not visible, render the toggle to bring it back (outside of the sidebar container)
  if (!visible) {
    // Make sure the toggle is fixed to the right edge of the viewport and always visible
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <SidebarToggle visible={false} onToggle={onToggleVisibility} />
      </div>
    );
  }

  return (
    <div className="h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto relative">
      {/* Render the toggle to collapse the sidebar */}
      <SidebarToggle visible={true} onToggle={onToggleVisibility} />

      <div className="p-4 space-y-4">
        <SocialHeader />

        {!user && <SignUpPrompt />}

        <CommunitySection />
      </div>
    </div>
  );
};
