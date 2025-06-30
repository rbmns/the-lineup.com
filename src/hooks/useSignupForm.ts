
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof formSchema>;

export const useSignupForm = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [blurredFields, setBlurredFields] = useState<Record<string, boolean>>({
    password: false,
    confirmPassword: false,
  });
  const { loginWithGoogle, loading: authLoading } = useAuth();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: 'onBlur',
  });

  const handleGoogleLogin = async () => {
    if (loading || authLoading) return;
    
    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Attempting Google signup/login");
      const { error } = await loginWithGoogle();
      
      if (error) {
        console.error("Google signup/login error:", error);
        setErrorMessage(error.message || "Google authentication failed. Please try again.");
        toast({
          title: "Google sign up failed",
          description: error.message || "Please try again.",
          variant: "destructive"
        });
      } else {
        console.log("Google authentication successful");
        toast({
          title: "Welcome! 🎉",
          description: "You're now signed in with Google.",
        });
      }
    } catch (error: any) {
      console.error("Unexpected Google auth error:", error);
      setErrorMessage("An unexpected error occurred with Google authentication.");
      toast({
        title: "Something went wrong",
        description: "Please try again or use email signup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldBlur = (fieldName: string) => {
    setBlurredFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Starting signup process for email:", values.email);
      
      // Clean up any existing sessions first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log("No existing session to clear");
      }
      
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/`;
      
      console.log("Using redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: values.email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        
        let errorMsg = error.message;
        if (error.message.includes("User already registered")) {
          errorMsg = "This email is already registered. Please try logging in instead.";
        } else if (error.message.includes("Password")) {
          errorMsg = "Password must be at least 6 characters long.";
        } else if (error.message.includes("Email")) {
          errorMsg = "Please enter a valid email address.";
        }
        
        setErrorMessage(errorMsg);
        toast({
          title: "Sign up failed",
          description: errorMsg,
          variant: "destructive"
        });
        return;
      }
      
      if (data?.user) {
        console.log("Signup successful for user:", data.user.id);
        
        if (data.session) {
          // User is immediately logged in (email confirmation disabled)
          console.log("User immediately logged in after signup");
          toast({
            title: "Account created! 🎉",
            description: "Your account has been created and you're now logged in.",
          });
        } else {
          // Email confirmation required
          console.log("Email confirmation required");
          setRegistrationComplete(true);
          setRegisteredEmail(values.email);
          
          toast({
            title: "Check your email! 📧",
            description: "We've sent you a confirmation link. Please check your inbox and click the link to activate your account.",
          });
        }
      }
      
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      const errorMsg = "An unexpected error occurred. Please try again.";
      setErrorMessage(errorMsg);
      
      toast({
        title: "Sign up failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    const emailValid = await form.trigger('email');
    if (emailValid) {
      setStep(2);
      setErrorMessage(""); // Clear any previous errors when moving to next step
    }
  };

  const prevStep = () => {
    setStep(1);
    setErrorMessage("");
  };

  return {
    form,
    step,
    loading,
    authLoading,
    errorMessage,
    registrationComplete,
    registeredEmail,
    blurredFields,
    onSubmit,
    nextStep,
    prevStep,
    handleGoogleLogin,
    handleFieldBlur,
  };
};
