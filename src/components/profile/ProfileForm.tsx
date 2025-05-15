import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { profileFormSchema, ProfileFormValues } from './ProfileFormSchema';
import { UsernameSection } from './form-sections/UsernameSection';
import { EmailSection } from './form-sections/EmailSection';
import { LocationSection } from './form-sections/LocationSection';
import { TaglineSection } from './form-sections/TaglineSection';
import { UsernameDialog } from './UsernameDialog';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => void;
  onCancel?: () => void;
  profile: UserProfile | null;
  showRequiredFields?: boolean;
}

export function ProfileForm({ 
  onSubmit, 
  onCancel, 
  profile, 
  showRequiredFields
}: ProfileFormProps) {
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const { user } = useAuth();
  
  // Get the effective username - use profile username if available, otherwise use email
  const effectiveUsername = profile?.username || user?.email?.split('@')[0] || '';
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: effectiveUsername,
      email: profile?.email || user?.email || "",
      location: profile?.location || "",
      tagline: profile?.tagline || "",
    },
  });
  
  // Update the form values whenever the profile changes
  useEffect(() => {
    if (profile) {
      form.setValue('username', profile.username || effectiveUsername);
      form.setValue('email', profile.email || user?.email || "");
      form.setValue('location', profile.location || "");
      form.setValue('tagline', profile.tagline || "");
    }
  }, [profile, user, effectiveUsername, form]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === profile?.username) return true;
    
    setIsCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .neq('id', profile?.id || '')
        .single();
      
      return !data;
    } catch (error) {
      return true;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a valid username",
        variant: "destructive"
      });
      return;
    }
    
    const isAvailable = await checkUsernameAvailability(newUsername);
    
    if (!isAvailable) {
      toast({
        title: "Username unavailable",
        description: "This username is already taken",
        variant: "destructive"
      });
      return;
    }
    
    form.setValue('username', newUsername);
    setUsernameDialogOpen(false);
    
    toast({
      title: "Username updated",
      description: "Your username has been updated"
    });
  };

  const openUsernameDialog = () => {
    setNewUsername(form.getValues('username'));
    setUsernameDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Make changes to your profile here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <UsernameSection 
                form={form} 
                showRequiredFields={showRequiredFields} 
                onEditUsername={openUsernameDialog}
              />
              <EmailSection form={form} />
              <LocationSection form={form} />
              <TaglineSection form={form} />
              
              <div className="flex justify-between pt-4">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="ml-auto">Save changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <UsernameDialog 
        open={usernameDialogOpen}
        onOpenChange={setUsernameDialogOpen}
        username={newUsername}
        onUsernameChange={(e) => setNewUsername(e.target.value)}
        onSave={handleUsernameChange}
        isChecking={isCheckingUsername}
      />
    </>
  );
}
