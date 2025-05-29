import React, { useState } from 'react';
import { Button } from '@/components/polymet/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BellIcon, EyeIcon, GlobeIcon, UsersIcon } from "lucide-react";

interface UserSettingsProps {
  className?: string;
}

export default function UserSettings({ className = "" }: UserSettingsProps) {
  const [activeTab, setActiveTab] = useState<"notifications" | "privacy">(
    "notifications"
  );

  return (
    <div
      className={`rounded-lg border border-secondary-50 bg-white ${className}`}
    >
      <div className="border-b border-secondary-50 p-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-primary-75">
          Manage your account preferences
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "notifications" | "privacy")}
        className="w-full"
      >
        <div className="border-b border-secondary-50 px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-secondary"
            >
              <span className="flex items-center gap-2">
                <BellIcon size={16} />
                Notifications
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-secondary"
            >
              <span className="flex items-center gap-2">
                <EyeIcon size={16} />
                Privacy
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="notifications" className="p-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Email Notifications</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Event Reminders</p>
                    <p className="text-xs text-primary-75">
                      Get notified about upcoming events you're attending
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Friend Requests</p>
                    <p className="text-xs text-primary-75">
                      Get notified when someone sends you a friend request
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Event Invitations</p>
                    <p className="text-xs text-primary-75">
                      Get notified when you're invited to an event
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Push Notifications</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">New Messages</p>
                    <p className="text-xs text-primary-75">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Event Updates</p>
                    <p className="text-xs text-primary-75">
                      Get notified when events you're attending are updated
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm">
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="p-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Profile Visibility</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Public Profile</p>
                    <p className="text-xs text-primary-75">
                      Allow others to view your profile
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Events Attending</p>
                    <p className="text-xs text-primary-75">
                      Show others which events you're attending
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Data Sharing</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Location Services</p>
                    <p className="text-xs text-primary-75">
                      Allow the app to access your location
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Activity Status</p>
                    <p className="text-xs text-primary-75">
                      Show when you're active on the platform
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" size="sm">
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t border-secondary-50 p-4 bg-secondary-10">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary-10 p-2">
            <GlobeIcon size={18} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Data Privacy</h4>
            <p className="text-xs text-primary-75 mt-1">
              We care about your privacy. View our privacy policy to learn how
              we protect your data.
            </p>
            <Button
              variant="link"
              className="text-vibrant-teal h-auto p-0 text-xs mt-1"
            >
              View Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
