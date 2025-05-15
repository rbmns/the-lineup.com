
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile/edit?welcome=true`,
        }
      });

      if (error) {
        throw error;
      }

      // Show success message if no error
      toast.success("Sign up successful!", {
        description: "Please check your email for verification.",
      });
      
      // Navigate to the login page
      navigate('/login');
    } catch (error: any) {
      // Show error message
      toast.error("Sign up failed", {
        description: error.message || "Something went wrong",
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
  };

  return (
    <div className="space-y-4 max-w-md w-full">
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
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
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
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
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
