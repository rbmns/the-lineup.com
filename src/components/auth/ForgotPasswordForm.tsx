
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { forgotPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Sending password reset email to:", values.email);
      
      const { error } = await forgotPassword(values.email);
      
      if (error) {
        console.error("Forgot password error:", error);
        let errorMsg = error.message;
        
        if (error.message.includes('User not found')) {
          errorMsg = "No account found with this email address.";
        } else if (error.message.includes('rate limit')) {
          errorMsg = "Too many requests. Please wait a few minutes before trying again.";
        }
        
        setErrorMessage(errorMsg);
        toast({
          title: "Error sending reset email",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Password reset email sent successfully");
      setEmailSent(true);
      
      toast({
        title: "Reset email sent! 📧",
        description: "Check your email for a link to reset your password.",
      });
      
    } catch (error: any) {
      console.error("Unexpected forgot password error:", error);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            We've sent a password reset link to <strong>{form.getValues('email')}</strong>. 
            Please check your email and click the link to reset your password.
          </AlertDescription>
        </Alert>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEmailSent(false);
              form.reset();
              setErrorMessage("");
            }}
            className="w-full"
          >
            Send another email
          </Button>
        </div>
        
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onBackToLogin}
            className="text-sm"
          >
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...form.register('email')}
          disabled={loading}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full"
      >
        {loading ? "Sending..." : "Send reset email"}
      </Button>
      
      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={onBackToLogin}
          disabled={loading}
          className="text-sm"
        >
          Back to login
        </Button>
      </div>
    </form>
  );
};
