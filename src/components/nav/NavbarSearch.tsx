import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
interface NavbarSearchProps {
  className?: string;
}
export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  className
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query.trim()); // Debug log
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    console.log('Search query updated:', newQuery); // Debug log
  };
  return;
};