
import React from "react";
import AppPageHeader from "@/components/ui/AppPageHeader";
import { typography } from "@/components/polymet/brand-typography";

const HomeHeaderSection = () => {
  return (
    <section className="w-full px-4 pb-10 bg-white m-0 p-0">
      <div className="max-w-4xl mx-auto text-center p-0 m-0">
        <AppPageHeader className="text-primary mt-0 mb-2">
          What's Happening?
        </AppPageHeader>
        <p className={`${typography.lead} mt-0`}>
          Discover the best events around you – from festivals to chill yoga, markets, and more.
        </p>
      </div>
    </section>
  );
};

export default HomeHeaderSection;
