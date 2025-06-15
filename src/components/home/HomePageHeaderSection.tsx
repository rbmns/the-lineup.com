
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

/**
 * Home page hero section now matches other hero headers (e.g. Events page).
 */
const HomePageHeaderSection = () => (
  <div className="w-full gradient-sky m-0 p-0 pb-12">
    <div className="w-full text-center text-white p-0 m-0">
      <h1 className={`${typography.display} mb-4 text-white mt-0 px-4 md:px-8`}>
        Find events that fit your <span className="font-handwritten text-sunset-yellow">vibe</span>
      </h1>
      <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl mx-auto mt-0 px-4 md:px-8`}>
        Discover what's happening nearby — from beach parties to chill yoga sessions. Join when you want, connect if you want.
      </p>
    </div>
  </div>
);

export default HomePageHeaderSection;
