
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

  // Closed state: render a fixed mini-tab with the arrow flush to the right edge
  if (!visible) {
    return (
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
        <div className="flex items-center h-20">
          <button
            className="bg-white border border-gray-200 shadow-lg rounded-l-lg rounded-r-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
            style={{
              height: '48px',
              minWidth: '32px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            aria-label="Expand social sidebar"
            onClick={onToggleVisibility}
          >
            {/* ChevronRight means "open" */}
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Open state: show sidebar, with toggle flush on its left border (inside)
  return (
    <div className="fixed top-0 right-0 h-full z-50 flex">
      <div className="relative h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
        {/* Toggle button attached to the left border, vertically centered */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-white border border-gray-200 shadow-lg rounded-r-lg rounded-l-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
          style={{
            height: '48px',
            minWidth: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
          aria-label="Collapse social sidebar"
          onClick={onToggleVisibility}
        >
          {/* ChevronLeft means "close" */}
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="p-4 space-y-4">
          <SocialHeader />
          {!user && <SignUpPrompt />}
          <CommunitySection />
        </div>
      </div>
    </div>
  );
};
