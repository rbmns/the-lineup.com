
import React from 'react';
import AppPageHeader from '@/components/ui/AppPageHeader';

export const FriendsHeader = () => {
  return (
    <div className="pt-7 pb-4 px-4 text-center bg-secondary">
      <AppPageHeader>Friends</AppPageHeader>
      <p className="text-xl text-muted-foreground leading-relaxed">
        Find your crew. Join the People, Not Just the Plans.
      </p>
    </div>
  );
};
