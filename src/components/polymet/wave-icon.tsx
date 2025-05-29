
import React from 'react';

export const WaveIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M2 12C2 12 4.5 8 8 12C11.5 16 14.5 8 18 12C21.5 16 22 12 22 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
