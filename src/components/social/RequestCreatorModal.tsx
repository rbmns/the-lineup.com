
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RequestCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onRequest: () => void;
  requested: boolean;
}

export const RequestCreatorModal: React.FC<RequestCreatorModalProps> = ({
  open,
  onClose,
  onRequest,
  requested,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Become an Event Creator</DialogTitle>
          <DialogDescription>
            Only approved event creators can publish events. Request access if you'd like to create and post events for the community.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {requested ? (
            <div className="text-green-600 font-semibold">
              Your request has been submitted! We'll review it and get in touch soon.
            </div>
          ) : (
            <div className="mb-3 text-base text-ocean-deep-700">
              Want the ability to publish your own events? Let us know and we’ll reach out!
            </div>
          )}
        </div>
        <DialogFooter>
          {requested ? (
            <Button onClick={onClose} variant="default" className="w-full">Close</Button>
          ) : (
            <Button onClick={onRequest} variant="default" className="w-full">Request Creator Access</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
