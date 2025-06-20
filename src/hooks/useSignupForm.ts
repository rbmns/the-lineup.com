
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
    await loginWithGoogle();
  };

  const handleFieldBlur = (fieldName: string) => {
    setBlurredFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const onSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    setErrorMessage("");
    
    try {
      await supabase.auth.signOut({ scope: 'global' }).catch(() => {});
      
      const baseUrl = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${baseUrl}/profile/edit?welcome=true`,
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage("This email is already registered. Please use a different email or try logging in.");
          toast({
            title: "Account already exists",
            description: "This email address is already registered. Please try logging in instead.",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }
      
      setRegistrationComplete(true);
      setRegisteredEmail(values.email);
      
      toast({
        title: "Sign up successful!",
        description: "We've sent you a confirmation email. Please check your inbox and verify your account.",
        variant: "success"
      });
    } catch (error: any) {
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
  };

  const nextStep = async () => {
    const emailValid = await form.trigger('email');
    if (emailValid) {
      setStep(2);
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
