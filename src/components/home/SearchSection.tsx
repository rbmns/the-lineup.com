
import React from 'react';
import { Bot, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e?: React.FormEvent) => Promise<void>;
  isAiSearching: boolean;
  aiFeedback?: string;
  hasResults?: boolean;
  resultCount?: number;
  showScrollArrow?: boolean;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isAiSearching,
  aiFeedback,
  hasResults,
  resultCount,
  showScrollArrow
}) => {
  const scrollToResults = () => {
    const resultsSection = document.querySelector('#search-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
      <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold mb-6 sm:mb-8 text-black animate-fade-in text-center">
          What do you want to do?
        </h1>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch(e);
        }} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Textarea
              placeholder="Try asking for 'yoga this weekend' or 'beach events near Zandvoort'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pr-[4.5rem] min-h-[120px] sm:min-h-[140px] md:min-h-[160px] text-base sm:text-lg",
                "border border-gray-200 rounded-xl resize-none",
                "focus:border-black focus:ring-1 focus:ring-black shadow-sm",
                "placeholder:text-gray-400 placeholder:text-base sm:placeholder:text-lg",
                "p-4 sm:p-5"
              )}
            />
            <Button 
              type="submit" 
              className={cn(
                "absolute bottom-4 right-4",
                "bg-black text-white hover:bg-black/90",
                "px-3 sm:px-4 py-2 rounded-lg h-10",
                "flex items-center gap-2 shadow-sm"
              )}
              disabled={isAiSearching}
            >
              {isAiSearching ? 'Searching...' : (
                <>
                  <span className="hidden sm:inline">Ask assistant</span>
                  <Bot className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          
          {aiFeedback && (
            <div className={cn(
              "mt-6 p-4 sm:p-6 rounded-xl",
              "bg-gray-50 border border-gray-100",
              "animate-fade-in"
            )}>
              <p className="text-gray-600 text-base sm:text-lg">{aiFeedback}</p>
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center text-sm sm:text-base text-gray-500">
          Rather search by category? <Link to="/events" className="text-black underline hover:text-black/70">Go here</Link>
        </div>
      </div>
    </div>
  );
};
