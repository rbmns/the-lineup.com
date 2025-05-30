
import React from 'react';
import { Search } from 'lucide-react';

export const FriendsHeader = () => {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Image */}
      <img
        src="/lovable-uploads/7f287109-ef9d-4780-ae28-713458ecf85c.png"
        alt="Friends Header"
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Friends
        </h1>
        <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
          Find your crew. Join the People, Not Just the Plans.
        </p>
        
        {/* Search Bar */}
        <div className="mt-8 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends by name..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
