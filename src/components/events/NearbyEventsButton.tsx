
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation, LocationData } from '@/hooks/useLocation';
import { toast } from '@/hooks/use-toast';

interface NearbyEventsButtonProps {
  onLocationAcquired: (location: LocationData) => void;
  onLocationClear: () => void;
  isFilteredByLocation: boolean;
}

export const NearbyEventsButton: React.FC<NearbyEventsButtonProps> = ({
  onLocationAcquired,
  onLocationClear,
  isFilteredByLocation,
}) => {
  const { getCurrentLocation, loading } = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const storedPermission = sessionStorage.getItem('locationPermission');
    if (storedPermission === 'granted') {
      setPermissionGranted(true);
    }
  }, []);

  const handleFetchLocation = async () => {
    setShowDialog(false);
    const location = await getCurrentLocation();
    if (location) {
      sessionStorage.setItem('locationPermission', 'granted');
      setPermissionGranted(true);
      onLocationAcquired(location);
      toast({
        title: "Location found!",
        description: "Showing events near you.",
      });
    } else {
      sessionStorage.setItem('locationPermission', 'denied');
      setPermissionGranted(false);
    }
  };

  const handleButtonClick = () => {
    if (isFilteredByLocation) {
      onLocationClear();
      toast({
        title: "Location filter cleared.",
      });
      return;
    }
    
    if (permissionGranted) {
      handleFetchLocation();
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Button
        variant={isFilteredByLocation ? "secondary" : "outline"}
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isFilteredByLocation ? (
          <XCircle className="mr-2 h-4 w-4" />
        ) : (
          <MapPin className="mr-2 h-4 w-4" />
        )}
        {loading ? "Locating..." : isFilteredByLocation ? "Clear Location Filter" : "Events Near Me"}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Search for events near you?</AlertDialogTitle>
            <AlertDialogDescription>
              We’ll use your location once to show nearby events. We don’t store or share it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFetchLocation}>
              Allow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
