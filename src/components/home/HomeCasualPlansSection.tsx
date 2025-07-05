
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coffee, Waves, Sun, Users } from 'lucide-react';

export const HomeCasualPlansSection: React.FC = () => {
  const navigate = useNavigate();

  const mockPlans = [{
    id: '1',
    title: 'Beach Walk & Coffee',
    time: 'Today 6pm',
    location: 'Zandvoort Beach',
    attendees: 3,
    icon: Coffee,
    vibe: '☕'
  }, {
    id: '2',
    title: 'Sunset Surf Session',
    time: 'Tomorrow 7pm',
    location: 'South Beach',
    attendees: 5,
    icon: Waves,
    vibe: '🏄'
  }, {
    id: '3',
    title: 'Morning Yoga',
    time: 'Sat 8am',
    location: 'Beach Pavilion',
    attendees: 2,
    icon: Sun,
    vibe: '🧘'
  }];

  return (
    <section className="py-16 bg-coastal-haze">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🌊</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-graphite-grey">
              Spontaneous plans? We've got those too.
            </h2>
          </div>
          <p className="font-body text-lg text-graphite-grey/80 max-w-2xl mx-auto">
            See or post casual meetups from others nearby.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mockPlans.map(plan => {
            const IconComponent = plan.icon;
            return (
              <div 
                key={plan.id} 
                className="bg-pure-white rounded-lg p-6 border border-mist-grey hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Icon and Vibe */}
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-6 w-6 text-horizon-blue" />
                  <span className="text-xl">{plan.vibe}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-graphite-grey text-lg mb-2">
                  {plan.title}
                </h3>

                {/* Time */}
                <p className="text-graphite-grey/70 text-sm mb-2">
                  {plan.time}
                </p>

                {/* Location */}
                <p className="text-graphite-grey/70 text-sm mb-4">
                  📍 {plan.location}
                </p>

                {/* Attendees */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-graphite-grey/70" />
                    <span className="text-sm text-graphite-grey/70">
                      {plan.attendees} going
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-ocean-teal hover:bg-coastal-haze" 
                    onClick={() => navigate('/casual-plans')}
                  >
                    Join
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/casual-plans')} 
            size="lg" 
            className="bg-ocean-teal hover:bg-horizon-blue text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Post a Casual Plan
          </Button>
        </div>
      </div>
    </section>
  );
};
