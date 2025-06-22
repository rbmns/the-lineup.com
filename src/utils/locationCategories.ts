
// Location categories mapping - groups nearby cities into logical areas
export interface LocationCategory {
  id: string;
  name: string;
  cities: string[];
  displayName: string;
}

export const LOCATION_CATEGORIES: LocationCategory[] = [
  {
    id: 'zandvoort-area',
    name: 'Zandvoort Area',
    displayName: 'Zandvoort Area',
    cities: ['Zandvoort', 'Bloemendaal', 'Overveen', 'Bentveld']
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    displayName: 'Amsterdam',
    cities: ['Amsterdam', 'Amsterdam-Noord', 'Amsterdam-West', 'Amsterdam-Zuid', 'Amsterdam-Oost']
  },
  {
    id: 'haarlem-area',
    name: 'Haarlem Area',
    displayName: 'Haarlem Area',
    cities: ['Haarlem', 'Heemstede', 'Aerdenhout']
  },
  {
    id: 'leiden-area',
    name: 'Leiden Area',
    displayName: 'Leiden Area',
    cities: ['Leiden', 'Leiderdorp', 'Voorschoten']
  },
  {
    id: 'den-haag-area',
    name: 'Den Haag Area',
    displayName: 'Den Haag Area',
    cities: ['Den Haag', 'The Hague', 'Scheveningen', 'Wassenaar']
  }
];

// Get category for a given city
export const getCategoryForCity = (city: string): LocationCategory | null => {
  return LOCATION_CATEGORIES.find(category => 
    category.cities.some(categoryCity => 
      categoryCity.toLowerCase() === city.toLowerCase()
    )
  ) || null;
};

// Get all cities that belong to a category
export const getCitiesForCategory = (categoryId: string): string[] => {
  const category = LOCATION_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.cities : [];
};

// Get category by ID
export const getCategoryById = (categoryId: string): LocationCategory | null => {
  return LOCATION_CATEGORIES.find(cat => cat.id === categoryId) || null;
};

// Convert individual cities to categories, removing duplicates
export const citiesToCategories = (cities: string[]): LocationCategory[] => {
  const categorySet = new Set<string>();
  const categories: LocationCategory[] = [];

  cities.forEach(city => {
    const category = getCategoryForCity(city);
    if (category && !categorySet.has(category.id)) {
      categorySet.add(category.id);
      categories.push(category);
    } else if (!category) {
      // For cities not in any category, create a standalone category
      const standaloneCategory: LocationCategory = {
        id: city.toLowerCase().replace(/\s+/g, '-'),
        name: city,
        displayName: city,
        cities: [city]
      };
      if (!categorySet.has(standaloneCategory.id)) {
        categorySet.add(standaloneCategory.id);
        categories.push(standaloneCategory);
      }
    }
  });

  return categories.sort((a, b) => a.displayName.localeCompare(b.displayName));
};
