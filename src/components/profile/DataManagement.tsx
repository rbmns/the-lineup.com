
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DataManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDataExport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      // Collect all user data from different tables
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('creator', user.id);

      const { data: rsvps } = await supabase
        .from('event_rsvps')
        .select(`
          *,
          events (
            title,
            start_date,
            start_time,
            event_category,
            location: venues (name, city)
          )
        `)
        .eq('user_id', user.id);

      const { data: casualPlans } = await supabase
        .from('casual_plans')
        .select('*')
        .eq('creator_id', user.id);

      const { data: casualPlanRsvps } = await supabase
        .from('casual_plan_rsvps')
        .select(`
          *,
          casual_plans (
            title,
            date,
            time,
            location,
            vibe
          )
        `)
        .eq('user_id', user.id);

      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      const { data: privacySettings } = await supabase
        .from('user_privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Compile all data
      const userData = {
        exportDate: new Date().toISOString(),
        account: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at
        },
        profile: profile,
        eventsOrganized: events || [],
        eventRsvps: rsvps || [],
        casualPlansCreated: casualPlans || [],
        casualPlanRsvps: casualPlanRsvps || [],
        friendships: friendships || [],
        privacySettings: privacySettings
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `the-lineup-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
      });

    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      // Note: In a production environment, this should be handled by a server-side function
      // to ensure proper cleanup and handle foreign key constraints
      
      // Delete user data in the correct order (respecting foreign keys)
      await supabase.from('casual_plan_rsvps').delete().eq('user_id', user.id);
      await supabase.from('casual_plans').delete().eq('creator_id', user.id);
      await supabase.from('event_rsvps').delete().eq('user_id', user.id);
      await supabase.from('events').delete().eq('creator', user.id);
      await supabase.from('friendships').delete().or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
      await supabase.from('user_privacy_settings').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      
      // Finally delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });

      // Redirect to home page
      window.location.href = '/goodbye';

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion failed",
        description: "There was an error deleting your account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export your data or permanently delete your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Data Export Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Export Your Data</h3>
          <p className="text-sm text-muted-foreground">
            Download a complete copy of your personal data in JSON format. This includes your profile, 
            events you've organized and attended, casual plans, friendships, and privacy settings.
          </p>
          <Button 
            onClick={handleDataExport}
            disabled={isExporting}
            className="flex items-center gap-2"
            variant="outline"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </Button>
        </div>

        {/* Account Deletion Section */}
        <div className="border-t pt-6 space-y-3">
          <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">This will permanently delete:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• Your profile and account information</li>
                  <li>• All events you've organized</li>
                  <li>• Your event RSVPs and attendance history</li>
                  <li>• All casual plans you've created</li>
                  <li>• Your casual plans participation history</li>
                  <li>• Your friend connections</li>
                  <li>• All privacy settings and preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers, including events you've organized,
                  casual plans you've created, and all your social connections.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleAccountDeletion}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
