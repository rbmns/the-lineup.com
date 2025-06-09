
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const CommunitySection: React.FC = () => {
  return (
    <Card className="border-sand">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4 text-seafoam-green" />
          Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
          <Link to="/events">
            <UserCheck className="h-4 w-4 mr-2" />
            See who's going
          </Link>
        </Button>
        
        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
          <Link to="/events">
            <Sparkles className="h-4 w-4 mr-2" />
            Get event recommendations
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
