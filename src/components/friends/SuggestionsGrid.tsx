
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';

interface SuggestionsGridProps {
  suggestions: any[];
  loading: boolean;
}

export const SuggestionsGrid = ({ suggestions, loading }: SuggestionsGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No suggestions available</div>
        <div className="text-gray-400 text-sm">Check back later for friend suggestions</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="text-center space-y-4">
            <ProfileAvatar profile={suggestion} size="lg" />
            
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {suggestion.username || 'Anonymous User'}
              </h3>
              <p className="text-sm text-gray-500">Based on mutual friends</p>
            </div>

            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Add Friend
              </Button>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
