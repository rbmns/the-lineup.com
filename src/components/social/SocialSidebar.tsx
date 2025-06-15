
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SocialHeader } from './SocialHeader';
import { SignUpPrompt } from './SignUpPrompt';
import { CommunitySection } from './CommunitySection';

interface SocialSidebarProps {
  visible?: boolean;
  onToggleVisibility?: () => void;
}

const SIDEBAR_WIDTH_PX = 224; // 56 x 4px

export const SocialSidebar: React.FC<SocialSidebarProps> = ({
  visible = true,
  onToggleVisibility,
}) => {
  const { user } = useAuth();

  // If sidebar is hidden: show the toggle arrow just to the left of where the sidebar would appear
  if (!visible) {
    return (
      <div
        className="fixed z-50"
        // Position at the left edge of where the sidebar would be (left-aligned with sidebar)
        style={{
          top: '50%',
          right: `${SIDEBAR_WIDTH_PX}px`,
          transform: 'translateY(-50%)',
        }}
      >
        <button
          className="bg-white border border-gray-200 shadow-lg rounded-r-lg rounded-l-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
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
    );
  }

  // If sidebar is visible: show the sidebar + toggle, always attached to left of it
  return (
    <div className="fixed top-0 right-0 h-full z-50 flex">
      <div className="relative h-full w-56 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
        {/* Toggle button attached to the left border, vertically centered (outside the sidebar, not inside) */}
        <div
          className="absolute"
          style={{
            left: '-48px', // puts the button outside, flush left to sidebar border (button is 48px tall)
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          <button
            className="bg-white border border-gray-200 shadow-lg rounded-r-lg rounded-l-none px-2 py-2 flex items-center justify-center hover:bg-sand transition-colors"
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
        </div>
        <div className="p-4 space-y-4">
          <SocialHeader />
          {!user && <SignUpPrompt />}
          <CommunitySection />
        </div>
      </div>
    </div>
  );
};
