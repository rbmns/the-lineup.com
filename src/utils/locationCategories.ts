
// Location categories mapping - now using areas from database
export interface LocationCategory {
  id: string;
  name: string;
  cities: string[];
  displayName: string;
}

// Get category for a given city by checking venue_city_areas
export const getCategoryForCity = async (city: string): Promise<LocationCategory | null> => {
  // This will be handled by the hook that fetches from database
  return null;
};

// Get all cities that belong to an area
export const getCitiesForArea = (areaId: string, cityAreas: any[]): string[] => {
  return cityAreas
    .filter(cityArea => cityArea.area_id === areaId)
    .map(cityArea => cityArea.city_name);
};

// Get area by ID
export const getAreaById = (areaId: string, areas: any[]): LocationCategory | null => {
  const area = areas.find(area => area.id === areaId);
  if (!area) return null;
  
  return {
    id: area.id,
    name: area.name,
    displayName: area.name,
    cities: [] // Will be populated by the hook
  };
};

// Convert database areas and city mappings to LocationCategory format
export const convertAreasToCategories = (areas: any[], cityAreas: any[]): LocationCategory[] => {
  return areas.map(area => ({
    id: area.id,
    name: area.name,
    displayName: area.name,
    cities: getCitiesForArea(area.id, cityAreas)
  })).sort((a, b) => a.displayName.localeCompare(b.displayName));
};
