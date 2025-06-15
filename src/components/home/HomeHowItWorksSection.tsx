
import React from "react";
import { Calendar, Users, Search } from "lucide-react";
import { typography } from "@/components/polymet/brand-typography";

const steps = [
  {
    icon: <Search className="h-10 w-10 text-white" />,
    label: "Discover Events",
    desc: "Browse events happening near you, from yoga sessions to beach parties and everything in between.",
    bg: "gradient-sky",
  },
  {
    icon: <Calendar className="h-10 w-10 text-white" />,
    label: "RSVP & Plan",
    desc: "Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.",
    bg: "gradient-sunset",
  },
  {
    icon: <Users className="h-10 w-10 text-white" />,
    label: "Connect & Enjoy",
    desc: "Meet like-minded people at events and build meaningful connections in your community.",
    bg: "gradient-ocean",
  },
];

const HomeHowItWorksSection = () => (
  <section className="py-16 w-full bg-cyan-800">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`${typography.h2} text-white mb-4`}>
            How <span className="font-handwritten text-primary">The Lineup</span> Works
          </h2>
          <p className={`${typography.body} text-cyan-100`}>
            Discover, connect, and experience amazing events in your area with just a few taps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div className="text-center group" key={step.label}>
              <div className={`w-20 h-20 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{step.label}</h3>
              <p className="text-cyan-100">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HomeHowItWorksSection;
