
import { useState, useEffect } from 'react';
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
        console.log('Fetching privacy settings for user:', userId);
        
        const { data, error } = await supabase
          .from('user_privacy_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching privacy settings:', error);
          
          // Try to create default settings if they don't exist
          if (error.code === 'PGRST116') {
            console.log('No privacy settings found, creating default ones...');
            const { data: newData, error: insertError } = await supabase
              .from('user_privacy_settings')
              .insert({ 
                user_id: userId,
                public_profile: true,
                show_event_attendance: true,
                share_activity_with_friends: false,
                allow_tagging: true
              })
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating default privacy settings:', insertError);
              setError(insertError.message);
            } else {
              console.log('Created default privacy settings:', newData);
              setSettings(newData);
            }
          } else {
            setError(error.message);
          }
        } else {
          console.log('Fetched privacy settings:', data);
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
      console.log(`Updating privacy setting ${field} to ${value} for user ${userId}`);
      
      const { error } = await supabase
        .from('user_privacy_settings')
        .update({ [field]: value })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating privacy setting:', error);
        throw error;
      }

      // Update local state
      setSettings(prev => prev ? { ...prev, [field]: value } : null);
      console.log(`Successfully updated ${field} to ${value}`);
    } catch (err) {
      console.error('Error updating privacy setting:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSetting
  };
}
