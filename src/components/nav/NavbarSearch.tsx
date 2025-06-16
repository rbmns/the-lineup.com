
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarSearchProps {
  className?: string;
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn("relative w-full", className)}>
      <Input
        type="text"
        placeholder="Search events, locations, or instructors..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-full pl-10 pr-4 h-10 text-sm"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <Search className="h-5 w-5" />
      </div>
    </form>
  );
};
