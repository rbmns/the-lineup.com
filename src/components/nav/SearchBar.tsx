
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery(''); // Clear the input after search
    }
  };

  // Don't show search bar on the search page itself (in mobile navigation)
  if (location.pathname === '/search') {
    return null;
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search events, venues, plans..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 w-full"
        />
      </div>
      <Button type="submit" size="sm" className="ml-2">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
