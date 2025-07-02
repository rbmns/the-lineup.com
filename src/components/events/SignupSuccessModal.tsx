import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Mail } from 'lucide-react';

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
}

export const SignupSuccessModal: React.FC<SignupSuccessModalProps> = ({
  isOpen,
  onClose,
  eventTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Almost There!</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Check Your Email!</h3>
            <p className="text-gray-600 mb-4">
              Your event <strong>"{eventTitle}"</strong> has been saved and will be published once you confirm your account.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📧 We've sent you a confirmation email. Click the link in the email to activate your account and publish your event.
            </p>
          </div>
          
          <div className="text-center">
            <Button onClick={onClose} className="w-full">
              Got it!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};