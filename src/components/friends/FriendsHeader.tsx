
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { typography } from '@/components/polymet/brand-typography';

export const FriendsHeader = () => {
  return (
    <PageHeader 
      title={<span className={typography.h1}>Friends</span>}
      subtitle="Find your crew. Join the People, Not Just the Plans."
    />
  );
};
