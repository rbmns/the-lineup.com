
import React from "react";
import { Calendar, Users, Search } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-12 w-12 text-white" />,
    label: "Discover Events",
    desc: "Browse events happening near you, from yoga sessions to beach parties and everything in between.",
    bgGradient: "bg-gradient-to-br from-vibrant-seafoam to-primary",
    shadowColor: "shadow-vibrant-seafoam/30",
  },
  {
    icon: <Calendar className="h-12 w-12 text-white" />,
    label: "RSVP & Plan",
    desc: "Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.",
    bgGradient: "bg-gradient-to-br from-vibrant-sunset to-vibrant-coral",
    shadowColor: "shadow-vibrant-sunset/30",
  },
  {
    icon: <Users className="h-12 w-12 text-white" />,
    label: "Connect & Enjoy",
    desc: "Meet like-minded people at events and build meaningful connections in your community.",
    bgGradient: "bg-gradient-to-br from-primary to-extended-oceanDeep-600",
    shadowColor: "shadow-primary/30",
  },
];

const HomeHowItWorksSection = () => (
  <section className="py-20 w-full bg-gradient-to-br from-white via-secondary-25 to-secondary-10 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-10 right-20 w-40 h-40 bg-vibrant-coral/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-vibrant-seafoam/30 rounded-full blur-3xl"></div>
    </div>

    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            How The Lineup Works
          </h2>
          <p className="text-lg text-neutral max-w-2xl mx-auto leading-relaxed">
            Discover, connect, and experience amazing events in your area with just a few taps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div className="text-center group" key={step.label}>
              <div className={`w-24 h-24 ${step.bgGradient} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 ${step.shadowColor} shadow-2xl`}>
                {step.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary mb-4">{step.label}</h3>
                <p className="text-neutral leading-relaxed text-base">{step.desc}</p>
              </div>
              
              {/* Step connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-24 h-0.5 bg-gradient-to-r from-neutral-25 to-transparent transform translate-x-12"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
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
