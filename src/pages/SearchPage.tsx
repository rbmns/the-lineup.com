
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { navigateToEvent } from '@/utils/navigationUtils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const EventResultCard = ({ result, navigate }: { result: Event; navigate: ReturnType<typeof useNavigate> }) => (
    <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => navigateToEvent(result.id, navigate)}
    >
        <CardHeader>
            <CardTitle className="line-clamp-2">{result.title}</CardTitle>
            <CardDescription>{new Date(result.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">{result.description}</p>
        </CardContent>
    </Card>
);

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchResults, isSearching, performSearch, setSearchResults } = useSearch();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
        setSearchResults([]);
    }
  }, [query]);

  // Cleanup search results on unmount
  useEffect(() => {
    return () => {
      setSearchResults([]);
    };
  }, [setSearchResults]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Search results for: <span className="text-primary">{query}</span>
        </h1>
      </div>

      {isSearching ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((result) => {
            if (result.type === 'event') {
              return <EventResultCard key={result.id} result={result as unknown as Event} navigate={navigate} />;
            }
            return null;
          })}
        </div>
      ) : (
        !isSearching && query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium">No results found</h2>
            <p className="text-muted-foreground mt-2">Try a different search term.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
