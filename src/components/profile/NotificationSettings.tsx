
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/toast';

interface NotificationSettingsType {
  id?: string;
  user_id: string;
  event_reminders: boolean;
  friend_requests: boolean;
  event_invitations: boolean;
  new_messages: boolean;
  event_updates: boolean;
  created_at?: string;
  updated_at?: string;
}

interface NotificationSettingsProps {
  userId: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ userId }) => {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    user_id: userId,
    event_reminders: true,
    friend_requests: true,
    event_invitations: true,
    new_messages: true,
    event_updates: true,
  });
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, [userId]);

  const fetchNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const defaultSettings = {
          user_id: userId,
          event_reminders: true,
          friend_requests: true,
          event_invitations: true,
          new_messages: true,
          event_updates: true,
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('user_notification_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating default notification settings:', insertError);
        } else {
          setSettings(newData);
        }
      }
    } catch (error) {
      console.error('Error in fetchNotificationSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (field: keyof NotificationSettingsType, value: boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({
          user_id: userId,
          event_reminders: settings.event_reminders,
          friend_requests: settings.friend_requests,
          event_invitations: settings.event_invitations,
          new_messages: settings.new_messages,
          event_updates: settings.event_updates,
        });

      if (error) {
        console.error('Error saving notification settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to save notification settings',
          variant: 'destructive',
        });
      } else {
        setHasChanges(false);
        toast({
          title: 'Settings saved',
          description: 'Your notification preferences have been updated',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-48"></div>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h4 className="font-medium mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Event Reminders</h5>
                <p className="text-sm text-gray-600">Get notified about upcoming events you're attending</p>
              </div>
              <Switch
                checked={settings.event_reminders}
                onCheckedChange={(checked) => handleSettingChange('event_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Friend Requests</h5>
                <p className="text-sm text-gray-600">Get notified when someone sends you a friend request</p>
              </div>
              <Switch
                checked={settings.friend_requests}
                onCheckedChange={(checked) => handleSettingChange('friend_requests', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Event Invitations</h5>
                <p className="text-sm text-gray-600">Get notified when you're invited to an event</p>
              </div>
              <Switch
                checked={settings.event_invitations}
                onCheckedChange={(checked) => handleSettingChange('event_invitations', checked)}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h4 className="font-medium mb-4">Push Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">New Messages</h5>
                <p className="text-sm text-gray-600">Get notified when you receive new messages</p>
              </div>
              <Switch
                checked={settings.new_messages}
                onCheckedChange={(checked) => handleSettingChange('new_messages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">Event Updates</h5>
                <p className="text-sm text-gray-600">Get notified when events you're attending are updated</p>
              </div>
              <Switch
                checked={settings.event_updates}
                onCheckedChange={(checked) => handleSettingChange('event_updates', checked)}
              />
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="pt-4 border-t">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
