
import React from 'react';
import { MapPin, Users, Calendar } from 'lucide-react';

export const WhoIsItForSection: React.FC = () => {
  const personas = [
    {
      title: "Explorers",
      description: "New in town? Join something real, no pressure.",
      icon: MapPin,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Locals", 
      description: "Stay in the loop. Discover or share what's happening.",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Organizers",
      description: "Hosting an event? Share it with people who'll show up.",
      icon: Calendar,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who's it for?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're exploring, connecting, or organizing — there's a place for you here.
          </p>
        </div>

        {/* Three Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, index) => {
            const IconComponent = persona.icon;
            return (
              <div 
                key={persona.title}
                className="relative group"
              >
                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 group-hover:shadow-xl group-hover:border-gray-300 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${persona.gradient} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {persona.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-lg text-gray-600 leading-relaxed flex-grow">
                    {persona.description}
                  </p>
                </div>

                {/* Subtle hover effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${persona.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
