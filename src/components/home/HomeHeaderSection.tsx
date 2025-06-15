
import React from "react";
import { typography } from "@/components/polymet/brand-typography";

const HomeHeaderSection = () => (
  <section className="w-full border-b py-10 px-4 sm:px-8 bg-cyan-50">
    <div className="max-w-4xl mx-auto text-left">
      <h1 className={\`\${typography.h1} text-primary mb-2\`}>
        Find events that fit your <span className="font-handwritten text-primary">vibe</span>
      </h1>
      <p className={\`\${typography.lead} max-w-2xl\`}>
        Discover what's happening nearby — from beach parties to yoga, music, and more. Join when you want, connect if you want.
      </p>
    </div>
  </section>
);

export default HomeHeaderSection;
