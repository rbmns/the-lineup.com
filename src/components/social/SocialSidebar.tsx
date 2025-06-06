
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';

export const SocialSidebar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="hidden xl:block w-80 bg-gray-50 border-l overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="font-semibold">Social</h2>
        </div>

        {isAuthenticated ? (
          <>
            {/* Friend Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Friend Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  Stay updated with what your friends are up to
                </div>
                <div className="text-xs text-gray-500">
                  Real-time updates coming soon...
                </div>
              </CardContent>
            </Card>

            {/* Friend Suggestions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Suggested Friends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  Discover people with similar interests
                </div>
                <div className="text-xs text-gray-500">
                  Smart suggestions coming soon...
                </div>
              </CardContent>
            </Card>

            {/* Trending Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  Popular events in your area
                </div>
                <div className="text-xs text-gray-500">
                  Trending data coming soon...
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Sign Up Teaser */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-blue-900">
                  Join the Community
                </h3>
                <p className="text-sm text-blue-700">
                  Sign up to see who's attending events, connect with friends, and get personalized recommendations.
                </p>
                <Button size="sm" className="w-full">
                  Sign Up Free
                </Button>
              </CardContent>
            </Card>

            {/* Preview Content */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">See friend activity</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UserPlus className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Get friend suggestions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Event recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
