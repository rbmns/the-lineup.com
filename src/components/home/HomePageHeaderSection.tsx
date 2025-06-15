
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

/**
 * A wide, modern home page hero section, matching events page style, fully flush with top and no clipping.
 */
const HomePageHeaderSection = () => (
  <section className="w-full gradient-sky relative m-0 p-0 overflow-visible">
    {/* Subtle overlay for depth */}
    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    <div className="relative w-full flex flex-col items-center text-center text-white min-h-[290px] pt-14 md:pt-24 pb-10 px-2 md:px-0">
      <h1 className={`${typography.display} mb-5 text-white mt-0 px-4 md:px-8`}>
        Discover events to <span className="font-handwritten text-sunset-yellow">match your vibe</span>
      </h1>
      <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl mx-auto mt-0 px-4 md:px-8`}>
        Your local lineup — festivals, chill yoga, good food, and new friends. Jump in anytime!
      </p>
    </div>
  </section>
);

export default HomePageHeaderSection;

