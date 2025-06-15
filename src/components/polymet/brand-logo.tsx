import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/polymet/logo';

const BrandLogo: React.FC = () => {
  const primaryColor = '#0ea5e9'; // Example color
  const secondaryColor = '#e2e8f0'; // Example color

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Logo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Logo />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandLogo;
