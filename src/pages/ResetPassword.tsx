
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { BrandLogo } from '@/components/ui/brand-logo';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { resetPassword, session } = useAuth();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if we have a valid session for password reset
    if (!session) {
      console.log("No valid session for password reset");
      setErrorMessage("Invalid or expired reset link. Please request a new password reset.");
    }
  }, [session]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!session) {
      setErrorMessage("Invalid or expired reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Attempting to reset password");
      
      const { error } = await resetPassword(values.password);
      
      if (error) {
        console.error("Reset password error:", error);
        let errorMsg = error.message;
        
        if (error.message.includes('weak password')) {
          errorMsg = "Password is too weak. Please choose a stronger password.";
        } else if (error.message.includes('same password')) {
          errorMsg = "New password must be different from your current password.";
        }
        
        setErrorMessage(errorMsg);
        toast({
          title: "Password reset failed",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }
      
      console.log("Password reset successful");
      setSuccess(true);
      
      toast({
        title: "Password updated! 🎉",
        description: "Your password has been successfully updated.",
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error("Unexpected reset password error:", error);
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

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <BrandLogo />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your password has been successfully updated! You'll be redirected to the login page shortly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BrandLogo />
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...form.register('password')}
                  disabled={loading}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...form.register('confirmPassword')}
                  disabled={loading}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !session} 
                className="w-full"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
            
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                disabled={loading}
                className="text-sm"
              >
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
