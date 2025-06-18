
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CasualPlanPreviewCard } from './CasualPlanPreviewCard';

interface CasualPlansMockDataProps {
  isAuthenticated: boolean;
}

export const CasualPlansMockData: React.FC<CasualPlansMockDataProps> = ({
  isAuthenticated
}) => {
  const navigate = useNavigate();

  const mockPlans = [
    {
      id: 'mock-1',
      title: 'Beach Walk & Coffee',
      vibe: 'beach',
      date: 'Today 6pm',
      time: '18:00',
      location: 'Zandvoort Beach',
      description: 'Anyone up for a sunset walk on the beach followed by coffee?',
      attendee_count: 3
    },
    {
      id: 'mock-2',
      title: 'Local Food Tour',
      vibe: 'food',
      date: 'Tomorrow 7pm',
      time: '19:00',
      location: 'City Center',
      description: "Let's explore the best local spots for dinner!",
      attendee_count: 5
    },
    {
      id: 'mock-3',
      title: 'Morning Surf Check',
      vibe: 'surf',
      date: 'Sat 7am',
      time: '07:00',
      location: 'South Beach',
      description: 'Early morning surf session if conditions are good',
      attendee_count: 2
    }
  ];

  const handlePlanClick = () => {
    navigate('/casual-plans');
  };

  return (
    <div className="space-y-3">
      {mockPlans.map((plan) => (
        <CasualPlanPreviewCard
          key={plan.id}
          plan={plan}
          isAuthenticated={isAuthenticated}
          onClick={handlePlanClick}
        />
      ))}
    </div>
  );
};
