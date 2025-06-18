
import React from "react";
import { Calendar, Users, Search } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-10 w-10 text-gray-700" />,
    label: "Discover Events",
    desc: "Browse events happening near you, from yoga sessions to beach parties and everything in between.",
    bg: "bg-gray-100",
  },
  {
    icon: <Calendar className="h-10 w-10 text-gray-700" />,
    label: "RSVP & Plan",
    desc: "Show interest or commit to going. Keep track of your plans and never miss out on what matters to you.",
    bg: "bg-gray-100",
  },
  {
    icon: <Users className="h-10 w-10 text-gray-700" />,
    label: "Connect & Enjoy",
    desc: "Meet like-minded people at events and build meaningful connections in your community.",
    bg: "bg-gray-100",
  },
];

const HomeHowItWorksSection = () => (
  <section className="py-16 w-full bg-white">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">
            How The Lineup Works
          </h2>
          <p className="text-base leading-7 text-gray-700">
            Discover, connect, and experience amazing events in your area with just a few taps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div className="text-center group" key={step.label}>
              <div className={`w-20 h-20 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">{step.label}</h3>
              <p className="text-gray-700">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HomeHowItWorksSection;
