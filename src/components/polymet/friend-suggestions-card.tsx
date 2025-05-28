import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/polymet/components/button";
import { UserPlusIcon, XIcon, CalendarIcon } from "lucide-react";
import { FriendSuggestion } from "@/polymet/data/user-events-data";

interface FriendSuggestionsCardProps {
  suggestions: FriendSuggestion[];
  className?: string;
  onAddFriend?: (userId: string) => void;
  onDismiss?: (userId: string) => void;
}

export default function FriendSuggestionsCard({
  suggestions,
  className = "",
  onAddFriend = () => {},
  onDismiss = () => {},
}: FriendSuggestionsCardProps) {
  const [visibleSuggestions, setVisibleSuggestions] = useState<string[]>(
    suggestions.map((s) => s.id)
  );

  const handleAddFriend = (userId: string) => {
    onAddFriend(userId);
    setVisibleSuggestions(visibleSuggestions.filter((id) => id !== userId));
  };

  const handleDismiss = (userId: string) => {
    onDismiss(userId);
    setVisibleSuggestions(visibleSuggestions.filter((id) => id !== userId));
  };

  const filteredSuggestions = suggestions.filter((s) =>
    visibleSuggestions.includes(s.id)
  );

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white ${className}`}
    >
      <div className="border-b border-secondary-50 p-4">
        <h2 className="text-lg font-semibold">People You May Know</h2>
        <p className="text-sm text-primary-75">
          Based on events you've attended
        </p>
      </div>

      <div className="divide-y divide-secondary-50">
        {filteredSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={suggestion.avatar}
                  alt={suggestion.name}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div className="ml-3">
                  <h3 className="font-medium">{suggestion.name}</h3>
                  <p className="text-sm text-primary-75">
                    {suggestion.mutualEvents} mutual{" "}
                    {suggestion.mutualEvents === 1 ? "event" : "events"}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-50 text-primary hover:bg-primary-10"
                  onClick={() => handleAddFriend(suggestion.id)}
                >
                  <UserPlusIcon size={16} className="mr-1.5" />
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(suggestion.id)}
                >
                  <XIcon size={16} />
                </Button>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-secondary p-3">
              <div className="flex items-start">
                <CalendarIcon
                  size={16}
                  className="mr-2 mt-0.5 text-primary-75"
                />

                <div>
                  <p className="text-sm">
                    You both attended{" "}
                    <Link
                      to={`/events/${suggestion.lastEvent.id}`}
                      className="font-medium text-vibrant-teal hover:underline"
                    >
                      {suggestion.lastEvent.title}
                    </Link>
                  </p>
                  <p className="text-xs text-primary-75">
                    {suggestion.lastEvent.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="border-t border-secondary-50 p-4 text-center">
          <Button variant="link" className="text-vibrant-teal">
            See all suggestions
          </Button>
        </div>
      )}
    </div>
  );
}
