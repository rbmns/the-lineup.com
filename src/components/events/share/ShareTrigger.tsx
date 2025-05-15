
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

interface ShareTriggerProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const ShareTrigger: React.FC<ShareTriggerProps> = ({ onClick, disabled = false }) => {
  return (
    <DialogTrigger asChild onClick={onClick} disabled={disabled}>
      <Button 
        variant="default" 
        size="icon"
        className="bg-white text-black border border-gray-200 hover:bg-gray-100 transition-colors animate-fade-in shadow-sm"
        title="Share event"
        aria-label="Share this event"
        disabled={disabled}
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </DialogTrigger>
  );
};
