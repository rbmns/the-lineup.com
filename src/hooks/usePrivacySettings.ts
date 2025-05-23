
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export interface PrivacySettings {
  id: string;
  user_id: string;
  public_profile: boolean;
  show_event_attendance: boolean;
  share_activity_with_friends: boolean;
  allow_tagging: boolean;
  created_at: string;
  updated_at: string;
}

export function usePrivacySettings(userId?: string | null) {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivacySettings() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_privacy_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Error fetching privacy settings:', error);
          setError(error.message);
          
          // Try to create default settings if they don't exist
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('user_privacy_settings')
              .insert({ user_id: userId });
              
            if (!insertError) {
              // Retry fetch after insert
              const { data: newData } = await supabase
                .from('user_privacy_settings')
                .select('*')
                .eq('user_id', userId)
                .single();
                
              setSettings(newData);
            }
          }
        } else {
          setSettings(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPrivacySettings();
  }, [userId]);

  const updateSetting = async (field: keyof Omit<PrivacySettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>, value: boolean) => {
    if (!userId || !settings) return;

    try {
      const { error } = await supabase
        .from('user_privacy_settings')
        .update({ [field]: value })
        .eq('user_id', userId);

      if (error) {
        toast({
          title: "Failed to update privacy setting",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setSettings(prev => prev ? { ...prev, [field]: value } : null);

      toast({
        title: "Settings updated",
        description: "Your privacy preferences have been saved",
        variant: "default"
      });
    } catch (err) {
      console.error('Error updating privacy setting:', err);
      toast({
        title: "An error occurred",
        description: "Could not update your settings",
        variant: "destructive"
      });
    }
  };

  return {
    settings,
    loading,
    error,
    updateSetting
  };
}
