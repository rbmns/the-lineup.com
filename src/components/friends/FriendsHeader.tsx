
import React from 'react';

export const FriendsHeader = () => {
  return (
    <div className="relative h-[200px] md:h-[250px] overflow-hidden">
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Friends
        </h1>
        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
          Find your crew. Join the People, Not Just the Plans.
        </p>
      </div>
    </div>
  );
};
