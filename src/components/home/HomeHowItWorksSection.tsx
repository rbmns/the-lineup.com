
import React from "react";
import { Search, Users, Calendar } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-6 w-6 text-horizon-blue" />,
    emoji: "🌀",
    title: "Discover events around you",
    description: "For locals, travelers, and nomads looking for something real — from yoga classes to workshops and meetups."
  },
  {
    icon: <Users className="h-6 w-6 text-seafoam-drift" />,
    emoji: "👥",
    title: "RSVP & see who's going",
    description: "Join with one click and check who else is attending — your friends, locals, or kindred spirits."
  },
  {
    icon: <Calendar className="h-6 w-6 text-horizon-blue" />,
    emoji: "✨",
    title: "Create your own vibe",
    description: "Hosting something? Post an event or casual plan and connect with people who share your energy."
  }
];

const HomeHowItWorksSection = () => (
  <section className="py-16 w-full bg-coastal-haze">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">🌀</span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-graphite-grey">
            How It Works
          </h2>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <div key={index} className="text-center space-y-4">
            {/* Step Number & Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-pure-white rounded-full flex items-center justify-center shadow-sm border border-mist-grey">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-graphite-grey rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-pure-white">{index + 1}</span>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
              <h3 className="font-display text-xl font-semibold text-graphite-grey">
                {step.title}
              </h3>
              <p className="font-body text-graphite-grey/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HomeHowItWorksSection;
