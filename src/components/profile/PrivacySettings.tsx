
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PrivacySettings as PrivacySettingsType, usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Loader2, Save, Shield, Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PrivacySettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const PrivacySettingItem: React.FC<PrivacySettingItemProps> = ({ 
  title, 
  description, 
  checked, 
  disabled = false,
  onCheckedChange 
}) => {
  return (
    <div className="flex items-center justify-between space-x-4 py-3">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=unchecked]:bg-gray-200"
      />
    </div>
  );
};

interface PrivacySettingsProps {
  userId: string | undefined;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ userId }) => {
  const { settings, loading, updateSetting } = usePrivacySettings(userId);
  const [localSettings, setLocalSettings] = useState<PrivacySettingsType | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local settings when server settings are loaded
  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  }, [settings, localSettings]);

  // Check if there are unsaved changes
  useEffect(() => {
    if (settings && localSettings) {
      const hasUnsavedChanges = 
        settings.public_profile !== localSettings.public_profile ||
        settings.show_event_attendance !== localSettings.show_event_attendance ||
        settings.share_activity_with_friends !== localSettings.share_activity_with_friends ||
        settings.allow_tagging !== localSettings.allow_tagging ||
        settings.show_rsvp_status !== localSettings.show_rsvp_status;
      
      setHasChanges(hasUnsavedChanges);
    }
  }, [settings, localSettings]);

  const handleLocalChange = (field: keyof Omit<PrivacySettingsType, 'id' | 'user_id' | 'created_at' | 'updated_at'>, value: boolean) => {
    if (localSettings) {
      setLocalSettings(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSave = async () => {
    if (!localSettings || !hasChanges) return;

    setIsSaving(true);
    try {
      // Update each changed setting
      if (settings) {
        const updates: Promise<void>[] = [];
        
        if (settings.public_profile !== localSettings.public_profile) {
          updates.push(updateSetting('public_profile', localSettings.public_profile));
        }
        if (settings.show_event_attendance !== localSettings.show_event_attendance) {
          updates.push(updateSetting('show_event_attendance', localSettings.show_event_attendance));
        }
        if (settings.share_activity_with_friends !== localSettings.share_activity_with_friends) {
          updates.push(updateSetting('share_activity_with_friends', localSettings.share_activity_with_friends));
        }
        if (settings.allow_tagging !== localSettings.allow_tagging) {
          updates.push(updateSetting('allow_tagging', localSettings.allow_tagging));
        }
        if (settings.show_rsvp_status !== localSettings.show_rsvp_status) {
          updates.push(updateSetting('show_rsvp_status', localSettings.show_rsvp_status));
        }

        await Promise.all(updates);
        
        // Reset the has changes flag after successful save
        setHasChanges(false);
        console.log('Privacy settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!settings || !localSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Manage your profile and data visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Could not load your privacy settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control who can see your information and activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrivacySettingItem
            title="Public Profile"
            description="Allow others to view your profile information"
            checked={localSettings.public_profile}
            onCheckedChange={(checked) => handleLocalChange('public_profile', checked)}
          />
          <PrivacySettingItem
            title="Show Event Attendance"
            description="Share with friends which events you are attending"
            checked={localSettings.show_event_attendance}
            onCheckedChange={(checked) => handleLocalChange('show_event_attendance', checked)}
          />
          <PrivacySettingItem
            title="Show RSVP Status"
            description="Allow friends to see your RSVP status on events"
            checked={localSettings.show_rsvp_status}
            onCheckedChange={(checked) => handleLocalChange('show_rsvp_status', checked)}
          />
          <PrivacySettingItem
            title="Activity Sharing"
            description="Share your activity updates with friends"
            checked={localSettings.share_activity_with_friends}
            onCheckedChange={(checked) => handleLocalChange('share_activity_with_friends', checked)}
          />
          <PrivacySettingItem
            title="Allow Tagging"
            description="Allow friends to tag you in posts and events"
            checked={localSettings.allow_tagging}
            onCheckedChange={(checked) => handleLocalChange('allow_tagging', checked)}
          />

          {hasChanges && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GDPR Rights and Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights (GDPR)
          </CardTitle>
          <CardDescription>
            Manage your personal data and exercise your rights under GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Download className="h-5 w-5 mt-1 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-medium mb-1">Download Your Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Request a copy of all your personal data we have on file
                </p>
                <Button variant="outline" size="sm">
                  Request Data Export
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Trash2 className="h-5 w-5 mt-1 text-red-600" />
              <div className="flex-1">
                <h3 className="font-medium mb-1">Delete Your Account</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t text-sm text-gray-600">
            <p className="mb-2">
              <strong>Your Rights:</strong> You have the right to access, rectify, erase, restrict processing, 
              data portability, and to object to processing of your personal data.
            </p>
            <p>
              For questions about your data or to exercise your rights, contact us at{' '}
              <a href="mailto:privacy@the-lineup.com" className="text-blue-600 hover:underline">
                privacy@the-lineup.com
              </a>{' '}
              or review our{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
