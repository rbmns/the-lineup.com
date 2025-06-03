
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Shield } from 'lucide-react';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';

interface SettingsPanelProps {
  userId: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings userId={userId} />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings userId={userId} />
          
          {/* Data Privacy Section */}
          <div className="pt-6 border-t">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 mt-1 text-gray-600" />
              <div>
                <h3 className="font-medium mb-2">Data Privacy</h3>
                <p className="text-sm text-gray-600 mb-3">
                  We care about your privacy. View our privacy policy to learn how we protect your data.
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800 underline">
                  View Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
