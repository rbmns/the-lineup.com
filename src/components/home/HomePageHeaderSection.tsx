import React from "react";
import { typography } from "@/components/polymet/brand-typography";

/**
 * Home page hero section now matches other hero headers (e.g. Events page).
 */
const HomePageHeaderSection = () => <div className="w-full gradient-sky m-0 p-0 pb-24 pt-10">
    <div className="w-full text-center text-white p-0 m-0">
      <h1 className="text-cyan-600 font-semibold ">
        Find events that fit your <span className="font-handwritten text-sunset-yellow">vibe</span>
      </h1>
      <p className="text-zinc-800">
        Discover what's happening nearby — from beach parties to chill yoga sessions.&nbsp;
        Join when you want, connect if you want.
      </p>
    </div>
  </div>;
export default HomePageHeaderSection;