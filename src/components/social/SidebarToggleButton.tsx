
import React from 'react';

interface SidebarToggleButtonProps {
  visible: boolean;
  onClick: () => void;
}

export const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({
  visible,
  onClick
}) => {
  const SIDEBAR_WIDTH_PX = 224;

  if (visible) {
    return (
      <div
        className="absolute"
        style={{
          left: '-48px',
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
          onClick={onClick}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50"
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
        onClick={onClick}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};
