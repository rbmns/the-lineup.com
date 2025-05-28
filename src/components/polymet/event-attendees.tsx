import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UsersIcon, UserPlusIcon } from "lucide-react";
import AttendeesList, { Attendee } from "@/polymet/components/attendees-list";

interface EventAttendeesProps {
  attendees: Attendee[];
  className?: string;
  onAddFriend?: (attendeeId: string) => void;
}

export default function EventAttendees({
  attendees,
  className = "",
  onAddFriend,
}: EventAttendeesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "friends" | "suggestions">(
    "all"
  );

  const goingAttendees = attendees.filter((a) => a.status === "going");
  const interestedAttendees = attendees.filter(
    (a) => a.status === "interested"
  );
  const friendAttendees = attendees.filter((a) => a.isFriend);
  const suggestedAttendees = attendees.filter((a) => !a.isFriend);

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white ${className}`}
    >
      <div className="border-b border-secondary-50 p-4">
        <h2 className="text-lg font-semibold">Event Attendees</h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <div className="border-b border-secondary-50 px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-secondary"
            >
              <span className="flex items-center gap-2">
                All
                <Badge variant="secondary" className="ml-1 bg-primary-10">
                  {attendees.length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-secondary"
            >
              <span className="flex items-center gap-2">
                Friends
                <Badge variant="secondary" className="ml-1 bg-primary-10">
                  {friendAttendees.length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-secondary"
            >
              <span className="flex items-center gap-2">
                Suggestions
                <Badge variant="secondary" className="ml-1 bg-primary-10">
                  {suggestedAttendees.length}
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="p-4">
          {goingAttendees.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center">
                <h3 className="text-sm font-medium text-primary-75">Going</h3>
                <Badge
                  variant="secondary"
                  className="ml-2 flex items-center gap-1"
                >
                  <UsersIcon size={12} />

                  {goingAttendees.length}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {goingAttendees.slice(0, 6).map((attendee) => (
                  <AttendeeItem
                    key={attendee.id}
                    attendee={attendee}
                    onAddFriend={onAddFriend}
                  />
                ))}
              </div>
              {goingAttendees.length > 6 && (
                <p className="mt-2 text-right text-xs text-primary-75">
                  +{goingAttendees.length - 6} more
                </p>
              )}
            </div>
          )}

          {interestedAttendees.length > 0 && (
            <div>
              <div className="mb-2 flex items-center">
                <h3 className="text-sm font-medium text-primary-75">
                  Interested
                </h3>
                <Badge
                  variant="secondary"
                  className="ml-2 flex items-center gap-1"
                >
                  <UsersIcon size={12} />

                  {interestedAttendees.length}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {interestedAttendees.slice(0, 6).map((attendee) => (
                  <AttendeeItem
                    key={attendee.id}
                    attendee={attendee}
                    onAddFriend={onAddFriend}
                  />
                ))}
              </div>
              {interestedAttendees.length > 6 && (
                <p className="mt-2 text-right text-xs text-primary-75">
                  +{interestedAttendees.length - 6} more
                </p>
              )}
            </div>
          )}

          {attendees.length === 0 && (
            <p className="py-4 text-center text-primary-75">No attendees yet</p>
          )}
        </TabsContent>

        <TabsContent value="friends" className="p-4">
          {friendAttendees.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {friendAttendees.map((attendee) => (
                <AttendeeItem
                  key={attendee.id}
                  attendee={attendee}
                  onAddFriend={onAddFriend}
                />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-primary-75">
              None of your friends attended this event
            </p>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="p-4">
          {suggestedAttendees.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {suggestedAttendees.map((attendee) => (
                <AttendeeItem
                  key={attendee.id}
                  attendee={attendee}
                  onAddFriend={onAddFriend}
                  showAddFriend
                />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-primary-75">
              No suggestions available
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AttendeeItem({
  attendee,
  onAddFriend,
  showAddFriend = false,
}: {
  attendee: Attendee;
  onAddFriend?: (attendeeId: string) => void;
  showAddFriend?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2">
        <div className="h-12 w-12 overflow-hidden rounded-full border border-secondary-50">
          {attendee.avatar ? (
            <img
              src={attendee.avatar}
              alt={attendee.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary text-primary">
              {attendee.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {attendee.status === "going" && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-vibrant-teal text-[8px] text-white">
            ✓
          </span>
        )}
      </div>
      <p className="text-sm font-medium line-clamp-1">{attendee.name}</p>
      {showAddFriend && !attendee.isFriend && onAddFriend && (
        <button
          className="mt-1 flex items-center text-xs text-vibrant-teal hover:underline"
          onClick={() => onAddFriend(attendee.id)}
        >
          <UserPlusIcon size={12} className="mr-0.5" />
          Add
        </button>
      )}
      {attendee.isFriend && (
        <span className="mt-1 text-xs text-primary-75">Friend</span>
      )}
    </div>
  );
}
