
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
  onToggleVisibility 
}) => {
  const { user } = useAuth();

  if (!visible) {
    return <SidebarToggle visible={false} onToggle={onToggleVisibility} />;
  }

  return (
    <div className="h-full w-full bg-white border-l border-sand shadow-lg overflow-y-auto">
      <SidebarToggle visible={true} onToggle={onToggleVisibility} />

      <div className="p-4 space-y-4">
        <SocialHeader />

        {!user && <SignUpPrompt />}

        <CommunitySection />
      </div>
    </div>
  );
};
