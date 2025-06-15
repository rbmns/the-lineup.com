
import React from "react";
import AppPageHeader from "@/components/ui/AppPageHeader";
import { typography } from "@/components/polymet/brand-typography";

const HomeHeaderSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pb-10 bg-white"> {/* pt-4 removed */}
      <div className="max-w-4xl mx-auto text-center">
        <AppPageHeader className="text-primary">
          What's Happening?
        </AppPageHeader>
        <p className={`${typography.lead}`}>
          Discover the best events around you – from festivals to chill yoga, markets, and more.
        </p>
      </div>
    </section>
  );
};

export default HomeHeaderSection;
