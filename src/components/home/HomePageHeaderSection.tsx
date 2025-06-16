
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

/**
 * Home page hero section with proper styling and gradients
 */
const HomePageHeaderSection = () => (
  <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 m-0 p-0 pb-16 pt-16 md:pb-24 md:pt-20">
    <div className="w-full text-center text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
        Find events that fit your <span className="text-yellow-300 font-handwritten">vibe</span>
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
        Discover what's happening nearby — from beach parties to chill yoga sessions.&nbsp;
        Join when you want, connect if you want.
      </p>
    </div>
  </div>
);

export default HomePageHeaderSection;
