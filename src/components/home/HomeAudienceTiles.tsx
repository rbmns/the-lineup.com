
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar } from 'lucide-react';

export const HomeAudienceTiles: React.FC = () => {
  const navigate = useNavigate();

  const audienceTypes = [
    {
      title: "Explorer",
      description: "New in town? Find something real and spontaneous to join.",
      icon: MapPin,
      color: "bg-vibrant-seafoam/10 border-vibrant-seafoam/20",
      iconColor: "text-vibrant-seafoam",
      buttonText: "New in town or visiting?",
      hasButton: true,
      route: "/events"
    },
    {
      title: "Locals", 
      description: "Stay in the loop with events and casual plans around you.",
      icon: Users,
      color: "bg-primary/10 border-primary/20",
      iconColor: "text-primary",
      buttonText: "Explore Local Events",
      hasButton: true,
      route: "/events"
    },
    {
      title: "Event Organizer",
      description: "Hosting something? Post it and connect with the right crowd.",
      icon: Calendar,
      color: "bg-vibrant-sunset/10 border-vibrant-sunset/20",
      iconColor: "text-vibrant-sunset",
      buttonText: "Create an Event",
      hasButton: true,
      route: "/events/create"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audienceTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <div 
                key={type.title}
                className={`p-8 rounded-2xl border-2 ${type.color} transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <IconComponent className={`h-8 w-8 ${type.iconColor}`} />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {type.title}
                </h3>
                
                {/* Description */}
                <p className="text-neutral leading-relaxed mb-6">
                  {type.description}
                </p>

                {/* Button */}
                {type.hasButton && (
                  <Button
                    onClick={() => navigate(type.route)}
                    variant="outline"
                    className={`w-full ${
                      type.title === "Event Organizer" 
                        ? "border-vibrant-sunset/30 text-vibrant-sunset hover:bg-vibrant-sunset/5"
                        : type.title === "Explorer"
                        ? "border-vibrant-seafoam/30 text-vibrant-seafoam hover:bg-vibrant-seafoam/5"
                        : "border-primary/30 text-primary hover:bg-primary/5"
                    }`}
                  >
                    {type.buttonText}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
