
// Updated color mapping based on the brand style guide nature palette
export const getCategoryColor = (category: string): string => {
  const lowerCategory = category.toLowerCase();
  
  // Nature-inspired color palette
  if (lowerCategory.includes('festival')) {
    return 'bg-sunset text-white'; // Sunset: #FF9933
  }
  
  if (lowerCategory.includes('wellness')) {
    return 'bg-leaf text-white'; // Leaf: #66CC66
  }
  
  if (lowerCategory.includes('kite')) {
    return 'bg-ocean-deep text-white'; // Ocean Deep: #005F73
  }
  
  if (lowerCategory.includes('beach')) {
    return 'bg-sand text-sandstone'; // Sand: #FFCC99, text Sandstone: #CA6702
  }
  
  if (lowerCategory.includes('game')) {
    return 'bg-dusk text-white'; // Dusk: #9966FF
  }
  
  if (lowerCategory.includes('other')) {
    return 'bg-secondary text-primary'; // Using secondary/primary from theme
  }
  
  if (lowerCategory.includes('sports')) {
    return 'bg-jungle-palm text-white'; // Palm: #40916C
  }
  
  if (lowerCategory.includes('surf')) {
    return 'bg-ocean-medium text-white'; // Ocean Medium: #0099CC
  }
  
  if (lowerCategory.includes('party')) {
    return 'bg-coral text-white'; // Coral: #FF6666
  }
  
  if (lowerCategory.includes('community')) {
    return 'bg-twilight text-white'; // Twilight: #5E60CE
  }
  
  if (lowerCategory.includes('water')) {
    return 'bg-teal text-white'; // Teal: #00CCCC
  }
  
  if (lowerCategory.includes('music')) {
    return 'bg-night text-white'; // Night: #3a0CA3
  }
  
  if (lowerCategory.includes('food')) {
    return 'bg-coral text-white'; // Coral: #FF6666
  }
  
  if (lowerCategory.includes('market')) {
    return 'bg-amber text-white'; // Amber: #EE9B00
  }
  
  if (lowerCategory.includes('yoga')) {
    return 'bg-lime text-white'; // Lime: #99CC33
  }
  
  // Default - if no match is found
  return 'bg-ocean-light text-jungle'; // Ocean Light: #94D2BD, text Jungle: #2D6A4F
};
