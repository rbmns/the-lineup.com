
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SignupSuccessProps {
  registeredEmail: string;
  onToggleMode: () => void;
}

export const SignupSuccess: React.FC<SignupSuccessProps> = ({ registeredEmail, onToggleMode }) => {
  return (
    <div className="space-y-4 max-w-md w-full">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Registration successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          We've sent a confirmation email to <strong>{registeredEmail}</strong>.
          Please check your inbox and click the verification link to activate your account.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2 mt-4">
        <p className="text-sm text-gray-600">
          Don't see the email? Check your spam folder or try logging in anyway.
        </p>
        <Button variant="outline" className="w-full" onClick={onToggleMode}>
          Go to Login
        </Button>
      </div>
    </div>
  );
};
