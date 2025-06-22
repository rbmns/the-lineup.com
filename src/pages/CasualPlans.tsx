
import React from 'react';
import { CasualPlansContent } from '@/components/casual-plans/CasualPlansContent';

const CasualPlans: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-secondary-25 to-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Spontaneous plans? We've got those too.
          </h1>
          <p className="text-xl text-neutral max-w-3xl mx-auto leading-relaxed mb-8">
            See or post casual meetups from others nearby — beach walks, coffee dates, surf sessions.
          </p>
          <div className="flex justify-center items-center gap-6 text-2xl opacity-60">
            <span>☕</span>
            <span>🏄</span>
            <span>🌅</span>
            <span>🎯</span>
            <span>🚲</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white">
        <CasualPlansContent />
      </div>
    </div>
  );
};

export default CasualPlans;
