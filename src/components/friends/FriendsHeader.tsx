
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const FriendsHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative w-full bg-white">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold tracking-tight text-black mb-4 leading-tight`}>
            Connect with fellow travelers
          </h1>
          <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-black max-w-2xl mx-auto leading-relaxed font-medium`}>
            Build your network and discover new adventures together.
          </p>
        </div>
      </div>
    </div>
  );
};
