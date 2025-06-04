
import React from 'react';
import { Event } from '@/types';
import { formatDate, formatEventTime } from '@/utils/date-formatting';
import { useEventNavigation } from '@/hooks/useEventNavigation';
import { useEventImages } from '@/hooks/useEventImages';

interface ProfileEventCardProps {
  event: Event;
}

export const ProfileEventCard: React.FC<ProfileEventCardProps> = ({ event }) => {
  const { navigateToEvent } = useEventNavigation();
  const { getEventImageUrl } = useEventImages();
  
  const imageUrl = getEventImageUrl(event);
  const formattedDate = event.start_date ? formatDate(event.start_date) : '';
  const timeDisplay = event.start_time ? 
    formatEventTime(event.start_time, event.end_time) : '';

  const handleClick = () => {
    navigateToEvent(event);
  };

  // Count attendees going and interested
  const goingCount = event.attendees?.going || 0;
  const interestedCount = event.attendees?.interested || 0;
  const totalAttendees = goingCount + interestedCount;

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* Event Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Event Details */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {event.title}
          </h3>
          
          <div className="text-sm text-gray-600 mb-1">
            {formattedDate && timeDisplay ? (
              <>
                {formattedDate} {timeDisplay}
              </>
            ) : (
              formattedDate || 'Date not set'
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {event.venues?.name || event.location || 'No location'}
          </div>
          
          {/* Attendees */}
          {totalAttendees > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex -space-x-1">
                {/* Mock avatars for now - you can enhance this later */}
                {Array.from({ length: Math.min(3, totalAttendees) }).map((_, i) => (
                  <div 
                    key={i}
                    className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {totalAttendees} attendee{totalAttendees !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* View Button */}
      <button 
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View
      </button>
    </div>
  );
};
