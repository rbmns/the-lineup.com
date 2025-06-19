
import React from "react";
import { Calendar, Users, Search, Heart, Eye } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-8 w-8 text-white" />,
    label: "Pick your vibe",
    desc: "Filter events by what you're into — surf, live music, yoga, food, or just something low-key.",
    bgGradient: "bg-gradient-to-br from-vibrant-seafoam to-primary",
    shadowColor: "shadow-vibrant-seafoam/30",
  },
  {
    icon: <Calendar className="h-8 w-8 text-white" />,
    label: "See what's on",
    desc: "Browse upcoming events and casual plans posted by locals and other travelers.",
    bgGradient: "bg-gradient-to-br from-vibrant-sunset to-vibrant-coral",
    shadowColor: "shadow-vibrant-sunset/30",
  },
  {
    icon: <Eye className="h-8 w-8 text-white" />,
    label: "Check who's going",
    desc: "See who's already in — locals, nomads, familiar faces. No guessing the crowd.",
    bgGradient: "bg-gradient-to-br from-vibrant-coral to-primary",
    shadowColor: "shadow-vibrant-coral/30",
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    label: "Join in",
    desc: "RSVP with one tap. Or jump into casual plans, no commitment needed.",
    bgGradient: "bg-gradient-to-br from-primary to-vibrant-seafoam",
    shadowColor: "shadow-primary/30",
  },
  {
    icon: <Heart className="h-8 w-8 text-white" />,
    label: "Stay connected",
    desc: "Follow people you meet, get updates on new plans, and build your local scene.",
    bgGradient: "bg-gradient-to-br from-extended-oceanDeep-600 to-vibrant-sunset",
    shadowColor: "shadow-extended-oceanDeep-600/30",
  },
];

const HomeHowItWorksSection = () => (
  <section className="py-12 w-full bg-gradient-to-br from-white via-secondary-25 to-secondary-10 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-10 right-20 w-40 h-40 bg-vibrant-coral/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-vibrant-seafoam/30 rounded-full blur-3xl"></div>
    </div>

    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How The Lineup Works
          </h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto leading-relaxed">
            Discover, connect, and experience amazing events in your area with just a few taps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div className="text-center group" key={step.label}>
              <div className={`w-16 h-16 ${step.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 ${step.shadowColor} shadow-lg`}>
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary mb-3">{step.label}</h3>
                <p className="text-neutral leading-relaxed text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-primary font-medium shadow-lg">
            <span>Ready to get started?</span>
            <div className="w-2 h-2 bg-vibrant-coral rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeHowItWorksSection;
