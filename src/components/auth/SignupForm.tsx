
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Define form schema with zod
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupForm({ onToggleMode }: { onToggleMode: () => void }) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [blurredFields, setBlurredFields] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: 'onBlur', // Only validate on blur, not on change
  });

  const handleFieldBlur = (fieldName: string) => {
    setBlurredFields(prev => ({ ...prev, [fieldName]: true }));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrorMessage("");
    
    try {
      // Clean up any lingering auth state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors during signout
      }
      
      // Get the current base URL for redirects
      const baseUrl = window.location.origin;
      console.log('Signup with redirect URL:', `${baseUrl}/profile/edit?welcome=true`);
      
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${baseUrl}/profile/edit?welcome=true`,
        }
      });

      if (error) {
        // Handle existing account error
        if (error.message.includes("User already registered")) {
          setErrorMessage("This email is already registered. Please use a different email or try logging in instead.");
          toast({
            title: "Account already exists",
            description: "This email address is already registered. Please try logging in instead.",
            variant: "destructive"
          });
          return;
        }
        
        throw error;
      }
      
      console.log('Signup response:', data);

      // Check if the user needs to confirm their email
      if (data?.user?.identities?.length === 0) {
        // This means the user already exists
        setErrorMessage("This email is already registered. Please use a different email or try logging in.");
        toast({
          title: "Account already exists",
          description: "This email address is already registered. Please try logging in instead.",
          variant: "destructive"
        });
        return;
      }

      // Show success message
      setRegistrationComplete(true);
      setRegisteredEmail(values.email);
      
      toast({
        title: "Sign up successful!",
        description: "We've sent you a confirmation email. Please check your inbox and verify your account.",
        variant: "success"
      });
    } catch (error: any) {
      // Show error message
      console.error("Signup failed:", error.message);
      setErrorMessage(error.message || "Something went wrong");
      
      toast({
        title: "Sign up failed",
        description: error.message || "Something went wrong with your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const nextStep = async () => {
    // Validate current step before proceeding
    if (step === 1) {
      const emailValid = await form.trigger('email');
      if (emailValid) {
        setStep(2);
      }
    }
  };

  const prevStep = () => {
    setStep(1);
    setErrorMessage("");
  };

  if (registrationComplete) {
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
  }

  return (
    <div className="space-y-4 max-w-md w-full">
      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-normal text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="name@example.com" 
                      type="email" 
                      autoComplete="email" 
                      disabled={loading} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        autoComplete="new-password"
                        disabled={loading} 
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldBlur('password');
                        }}
                        {...field} 
                      />
                    </FormControl>
                    {blurredFields.password && <FormMessage />}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        autoComplete="new-password" 
                        disabled={loading} 
                        onBlur={(e) => {
                          field.onBlur();
                          handleFieldBlur('confirmPassword');
                        }}
                        {...field} 
                      />
                    </FormControl>
                    {blurredFields.confirmPassword && <FormMessage />}
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                disabled={loading}
              >
                Back
              </Button>
            )}
            
            {step < 2 ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                disabled={loading} 
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={loading} 
                className="ml-auto"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button variant="link" className="p-0" onClick={onToggleMode}>
          Sign in
        </Button>
      </div>
    </div>
  );
}

