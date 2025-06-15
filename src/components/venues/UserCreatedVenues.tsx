
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVenues } from '@/hooks/useVenues';
import { CreateVenueModal } from '@/components/venues/CreateVenueModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Globe, ExternalLink, Edit } from 'lucide-react';
import { Venue } from '@/types';

export const UserCreatedVenues: React.FC = () => {
  const { user } = useAuth();
  const { venues, isLoading } = useVenues();
  const [isCreateVenueModalOpen, setCreateVenueModalOpen] = useState(false);
  const [venueToEdit, setVenueToEdit] = useState<Venue | null>(null);

  // Filter venues created by the current user
  const userVenues = venues.filter(venue => venue.creator_id === user?.id);

  const handleModalClose = () => {
    setCreateVenueModalOpen(false);
    setVenueToEdit(null);
  };

  const handleAddClick = () => {
    setVenueToEdit(null);
    setCreateVenueModalOpen(true);
  };

  const handleEditClick = (venue: Venue) => {
    setVenueToEdit(venue);
    setCreateVenueModalOpen(true);
  };

  const handleComplete = () => {
    handleModalClose();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">My Venues</h2>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">My Venues</h2>
          <p className="text-gray-600 mt-1">Manage venues you've created for events</p>
        </div>
        <Button 
          onClick={handleAddClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Venue
        </Button>
      </div>

      {userVenues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first venue to make it available for events
            </p>
            <Button 
              onClick={handleAddClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Venue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{venue.name}</span>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      Venue
                    </Badge>
                  </CardTitle>
                  {venue.city && (
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {venue.street && `${venue.street}, `}{venue.city}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {venue.postal_code && (
                      <p className="text-sm text-gray-600">
                        <strong>Postal Code:</strong> {venue.postal_code}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {venue.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                        onClick={() => window.open(venue.website, '_blank')}
                      >
                        <Globe className="h-3 w-3" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    {venue.google_maps && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                        onClick={() => window.open(venue.google_maps, '_blank')}
                      >
                        <MapPin className="h-3 w-3" />
                        Maps
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
              <CardFooter className="p-4 pt-0">
                 <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEditClick(venue)}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Venue
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateVenueModal 
        open={isCreateVenueModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose();
          } else {
            setCreateVenueModalOpen(true);
          }
        }}
        onComplete={handleComplete}
        venueToEdit={venueToEdit}
      />
    </div>
  );
};
