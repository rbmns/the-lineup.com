
import { useState } from "react";
import { Button } from "@/components/polymet/button";
import { UserPlusIcon, CheckIcon, UserIcon } from "lucide-react";

export type FriendRequestStatus = "none" | "pending" | "accepted" | "sent";

interface FriendRequestButtonProps {
  userId: string;
  initialStatus?: FriendRequestStatus;
  onSendRequest?: (userId: string) => void;
  onAcceptRequest?: (userId: string) => void;
  size?: "sm" | "default";
  className?: string;
}

export default function FriendRequestButton({
  userId,
  initialStatus = "none",
  onSendRequest,
  onAcceptRequest,
  size = "default",
  className = "",
}: FriendRequestButtonProps) {
  const [status, setStatus] = useState<FriendRequestStatus>(initialStatus);

  const handleSendRequest = () => {
    setStatus("sent");
    onSendRequest?.(userId);
  };

  const handleAcceptRequest = () => {
    setStatus("accepted");
    onAcceptRequest?.(userId);
  };

  if (status === "accepted") {
    return (
      <Button
        variant="secondary"
        size={size}
        className={`text-primary-75 ${className}`}
        disabled
      >
        <UserIcon size={size === "sm" ? 14 : 16} className="mr-1.5" />
        Friends
      </Button>
    );
  }

  if (status === "sent") {
    return (
      <Button
        variant="outline"
        size={size}
        className={`text-primary-75 ${className}`}
        disabled
      >
        <CheckIcon size={size === "sm" ? 14 : 16} className="mr-1.5" />
        Request Sent
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button
        variant="default"
        size={size}
        className={className}
        onClick={handleAcceptRequest}
      >
        <CheckIcon size={size === "sm" ? 14 : 16} className="mr-1.5" />
        Accept Request
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      className={`border-primary-50 text-primary hover:bg-primary-10 ${className}`}
      onClick={handleSendRequest}
    >
      <UserPlusIcon size={size === "sm" ? 14 : 16} className="mr-1.5" />
      Add Friend
    </Button>
  );
}
