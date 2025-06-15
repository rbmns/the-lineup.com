
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

  // Always render the SidebarToggle
  if (!visible) {
    // Render the toggle absolutely fixed to the right edge, visible when the sidebar is hidden
    return (
      <div>
        <SidebarToggle visible={false} onToggle={onToggleVisibility} />
      </div>
    );
  }

  return (
    <div className="h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      <SidebarToggle visible={true} onToggle={onToggleVisibility} />

      <div className="p-4 space-y-4">
        <SocialHeader />

        {!user && <SignUpPrompt />}

        <CommunitySection />
      </div>
    </div>
  );
};
