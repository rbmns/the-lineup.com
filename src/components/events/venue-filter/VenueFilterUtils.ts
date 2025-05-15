
/**
 * Utility functions for venue filtering with enhanced search capabilities
 */

/**
 * Preprocesses a string by normalizing it, handling articles, and expanding prefixes
 */
const preprocessString = (str: string): string => {
  if (!str) return '';
  
  // Normalize the string: lowercase and trim
  const normalized = str.toLowerCase().trim();
  
  // Handle common articles by creating variations
  const withoutArticles = normalized
    .replace(/^the\s+/, '')
    .replace(/^a\s+/, '')
    .replace(/^an\s+/, '');
  
  return withoutArticles;
};

/**
 * Split text into meaningful tokens for better matching
 */
const tokenize = (text: string): string[] => {
  if (!text) return [];
  return text.toLowerCase()
    .split(/[\s\-_.,]+/)
    .filter(token => token.length > 0);
};

/**
 * Improved fuzzy matching that handles articles and partial matches better
 */
export const fuzzyMatch = (str: string, pattern: string): boolean => {
  if (!str || !pattern) return false;
  
  // Get the normalized versions of both strings
  const normalizedStr = str.toLowerCase();
  const normalizedPattern = pattern.toLowerCase();
  
  // Direct matches (highest priority)
  if (normalizedStr === normalizedPattern) return true;
  
  // Check if string contains the pattern (common case)
  if (normalizedStr.includes(normalizedPattern)) return true;
  
  // Check if the string without "The " contains the pattern
  const strWithoutThe = preprocessString(str);
  if (strWithoutThe === normalizedPattern || 
      strWithoutThe.includes(normalizedPattern)) return true;
  
  // Check if any token in the string starts with the pattern
  const tokens = tokenize(str);
  if (tokens.some(token => token.startsWith(normalizedPattern))) return true;
  
  // Traditional fuzzy matching as a fallback (most lenient)
  let patternIdx = 0;
  let strIdx = 0;
  
  // More lenient fuzzy matching that allows skipping characters
  while (patternIdx < normalizedPattern.length && strIdx < normalizedStr.length) {
    if (normalizedPattern[patternIdx] === normalizedStr[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === normalizedPattern.length;
};

/**
 * Enhanced venue filtering function that uses multiple matching strategies
 */
export const filterVenues = (venues: Array<{value: string, label: string}>, query: string): Array<{value: string, label: string}> => {
  if (!query || !query.trim()) {
    return venues;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  console.log(`Filtering venues with query: "${normalizedQuery}"`);
  
  // Break query into words for better matching
  const queryWords = tokenize(normalizedQuery);
  
  const results = venues.filter(venue => {
    // Safety check if venue or label is undefined
    if (!venue || !venue.label) return false;
    
    const normalizedLabel = venue.label.toLowerCase();
    const preprocessedLabel = preprocessString(venue.label);
    const venueTokens = tokenize(venue.label);
    
    // For debugging
    console.log(`Checking venue: "${venue.label}" (preprocessed: "${preprocessedLabel}")`);
    
    // Multiple matching strategies in order of relevance:
    
    // 1. Exact match (highest priority)
    if (normalizedLabel === normalizedQuery) {
      console.log(`✓ Exact match: "${venue.label}"`);
      return true;
    }
    
    // 2. Check if venue name contains the full query
    if (normalizedLabel.includes(normalizedQuery)) {
      console.log(`✓ Contains match: "${venue.label}" contains "${normalizedQuery}"`);
      return true;
    }
    
    // 3. Check if pre-processed venue name (without articles) contains the query
    if (preprocessedLabel.includes(normalizedQuery)) {
      console.log(`✓ Preprocessed match: "${preprocessedLabel}" contains "${normalizedQuery}"`);
      return true;
    }
    
    // 4. Check if any token in the venue starts with any query word
    const tokenMatches = queryWords.some(queryWord => 
      venueTokens.some(venueToken => venueToken.startsWith(queryWord))
    );
    
    if (tokenMatches) {
      console.log(`✓ Token match: A token in "${venue.label}" matches a query word`);
      return true;
    }
    
    // 5. Check if venue contains all query words (partial word matching)
    if (queryWords.length > 0) {
      const allWordsMatch = queryWords.every(word => 
        normalizedLabel.includes(word)
      );
      if (allWordsMatch) {
        console.log(`✓ All words match: "${venue.label}" contains all query words`);
        return true;
      }
    }
    
    // 6. Use fuzzy matching as last resort for better results with typos
    const isFuzzyMatch = fuzzyMatch(normalizedLabel, normalizedQuery);
    if (isFuzzyMatch) {
      console.log(`✓ Fuzzy match: "${venue.label}" fuzzy matches "${normalizedQuery}"`);
    }
    return isFuzzyMatch;
  });
  
  console.log(`Found ${results.length} matches for "${normalizedQuery}"`);
  return results;
};
