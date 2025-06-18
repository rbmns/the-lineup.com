
import React from "react";
import AppPageHeader from "@/components/ui/AppPageHeader";

const HomeHeaderSection = () => {
  return (
    <section className="w-full px-4 pb-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <AppPageHeader className="text-primary mt-0 mb-2">
          What's Happening?
        </AppPageHeader>
        <p className="text-xl text-muted-foreground leading-relaxed mt-0">
          Discover the best events around you – from festivals to chill yoga, markets, and more.
        </p>
      </div>
    </section>
  );
};

export default HomeHeaderSection;
