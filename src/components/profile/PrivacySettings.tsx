
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PrivacySettings as PrivacySettingsType, usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Loader2 } from 'lucide-react';

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
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};

interface PrivacySettingsProps {
  userId: string | undefined;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ userId }) => {
  const { settings, loading, updateSetting } = usePrivacySettings(userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Manage your profile and data visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Could not load your privacy settings</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Manage your profile and data visibility</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PrivacySettingItem
          title="Public Profile"
          description="Allow others to view your profile"
          checked={settings.public_profile}
          onCheckedChange={(checked) => updateSetting('public_profile', checked)}
        />
        <PrivacySettingItem
          title="Show Event Attendance"
          description="Show which events you are attending or interested in"
          checked={settings.show_event_attendance}
          onCheckedChange={(checked) => updateSetting('show_event_attendance', checked)}
        />
        <PrivacySettingItem
          title="Activity Sharing"
          description="Share your activity updates with friends"
          checked={settings.share_activity_with_friends}
          onCheckedChange={(checked) => updateSetting('share_activity_with_friends', checked)}
        />
        <PrivacySettingItem
          title="Tagging"
          description="Allow others to tag you in events and posts"
          checked={settings.allow_tagging}
          onCheckedChange={(checked) => updateSetting('allow_tagging', checked)}
        />
      </CardContent>
    </Card>
  );
};
