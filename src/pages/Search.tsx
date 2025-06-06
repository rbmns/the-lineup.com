
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { searchEvents } from '@/lib/eventService';
import { EventCardList } from '@/components/events/EventCardList';
import { EventsLoadingState } from '@/components/events/list-components/EventsLoadingState';
import { NoResultsFound } from '@/components/events/list-components/NoResultsFound';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [submittedQuery, setSubmittedQuery] = useState(searchParams.get('q') || '');

  // Update search query when URL params change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    setSubmittedQuery(query);
  }, [searchParams]);

  // Search events query
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search-events', submittedQuery],
    queryFn: () => searchEvents(submittedQuery),
    enabled: !!submittedQuery && submittedQuery.trim().length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search for events, venues, and experiences in your area
            </p>
            
            {/* Large Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, venues, plans..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="pl-16 pr-32 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Search suggestions or popular searches could go here */}
            {!submittedQuery && (
              <div className="mt-8 text-sm text-gray-500">
                <p>Try searching for "yoga", "music", "beach", or "festival"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {submittedQuery && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Search Results for "{submittedQuery}"
              </h2>
              {searchResults && (
                <p className="text-gray-600 mt-1">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                </p>
              )}
            </div>

            {/* Loading State */}
            {isLoading && <EventsLoadingState />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">
                  Something went wrong while searching. Please try again.
                </p>
              </div>
            )}

            {/* Results */}
            {searchResults && searchResults.length > 0 && (
              <EventCardList events={searchResults} />
            )}

            {/* No Results */}
            {searchResults && searchResults.length === 0 && !isLoading && (
              <NoResultsFound 
                searchQuery={submittedQuery}
                onClearSearch={() => {
                  setSearchQuery('');
                  setSubmittedQuery('');
                  setSearchParams({});
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
