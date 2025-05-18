
import { Users } from 'lucide-react';

interface EventAttendeesSummaryProps {
  goingCount: number;
  interestedCount: number;
}

export const EventAttendeesSummary = ({
  goingCount,
  interestedCount
}: EventAttendeesSummaryProps) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <Users className="h-5 w-5" /> 
        <span>Who's coming</span>
      </h3>
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-xl font-bold">{goingCount}</div>
          <div className="text-sm text-gray-600">Going</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{interestedCount}</div>
          <div className="text-sm text-gray-600">Interested</div>
        </div>
      </div>
    </div>
  );
};
