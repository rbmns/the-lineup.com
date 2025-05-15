
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoUploader from '@/components/admin/LogoUploader';
import FaviconUploader from '@/components/admin/FaviconUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="branding">
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <LogoUploader />
              <FaviconUploader />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>
                  Customize the color scheme of your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Color customization can be done by editing the tailwind.config.js file.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>
                Manage your Supabase storage buckets and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Your application uses the following storage buckets:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>avatars</strong> - User profile images
                </li>
                <li>
                  <strong>branding</strong> - Logo and brand assets
                </li>
                <li>
                  <strong>seo</strong> - Favicon and OG images
                </li>
              </ul>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  You can manage your storage buckets directly in the Supabase dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                Information about your database structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The <code>profiles</code> table has been modified to use <code>avatar_urls</code> as an array.
              </p>
              
              <p className="text-sm text-gray-600 mt-4">
                For security reasons, all tables have Row Level Security (RLS) policies to control access.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
