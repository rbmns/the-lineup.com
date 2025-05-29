
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/polymet/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDownIcon, ChevronUpIcon, UsersIcon } from "lucide-react";

export interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  status: "going" | "interested";
  isFriend?: boolean;
}

interface AttendeesListProps {
  attendees: Attendee[];
  title?: string;
  className?: string;
  onAddFriend?: (attendeeId: string) => void;
  showAddFriend?: boolean;
  maxVisible?: number;
}

export default function AttendeesList({
  attendees,
  title = "People who attended",
  className = "",
  onAddFriend,
  showAddFriend = false,
  maxVisible = 6,
}: AttendeesListProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleAttendees = showAll ? attendees : attendees.slice(0, maxVisible);

  const hasMore = attendees.length > maxVisible;

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white p-6 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <UsersIcon size={14} />

          {attendees.length}
        </Badge>
      </div>

      {attendees.length > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {visibleAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-2">
                  <Avatar className="h-12 w-12 border border-secondary-50">
                    {attendee.avatar ? (
                      <AvatarImage src={attendee.avatar} alt={attendee.name} />
                    ) : (
                      <AvatarFallback>
                        {attendee.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {attendee.status === "going" && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-vibrant-teal text-[8px] text-white">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium line-clamp-1">
                  {attendee.name}
                </p>
                {showAddFriend && !attendee.isFriend && onAddFriend && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 text-xs text-vibrant-teal hover:bg-vibrant-teal/10 hover:text-vibrant-teal"
                    onClick={() => onAddFriend(attendee.id)}
                  >
                    Add Friend
                  </Button>
                )}
                {attendee.isFriend && (
                  <span className="mt-1 text-xs text-primary-75">Friend</span>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full text-primary-75"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Show less <ChevronUpIcon size={16} className="ml-1" />
                </>
              ) : (
                <>
                  Show all ({attendees.length}){" "}
                  <ChevronDownIcon size={16} className="ml-1" />
                </>
              )}
            </Button>
          )}
        </>
      ) : (
        <p className="text-center text-primary-75">No attendees yet</p>
      )}
    </div>
  );
}
