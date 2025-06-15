
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

/**
 * A wide, modern home page hero section, matching events page style.
 */
const HomePageHeaderSection = () => (
  <section className="w-full gradient-sky relative m-0 pb-16 pt-[61px] px-[20px] overflow-visible">
    {/* Subtle overlay for depth */}
    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    <div className="relative w-full flex flex-col items-center text-center text-white min-h-[290px]">
      <h1 className={`${typography.display} mb-5 text-white mt-0`}>
        Discover events to{" "}
        <span className="font-handwritten text-sunset-yellow">match your vibe</span>
      </h1>
      <p className={`${typography.lead} text-white/90 leading-relaxed max-w-2xl mx-auto mt-0`}>
        Your local lineup — festivals, chill yoga, good food, and new friends. Jump in anytime!
      </p>
    </div>
  </section>
);

export default HomePageHeaderSection;

