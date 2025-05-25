
import React from 'react';
import { Link } from 'react-router-dom';
import { EventCategoryIcon } from '@/components/ui/event-category-icon';

interface CategoriesBrowseSectionProps {
  categories: string[];
}

export const CategoriesBrowseSection: React.FC<CategoriesBrowseSectionProps> = ({ categories }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Browse Categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/events?category=${encodeURIComponent(category)}`}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                <EventCategoryIcon 
                  category={category} 
                  size="lg"
                  className="text-gray-600 group-hover:text-gray-800"
                />
              </div>
              <span className="text-sm font-medium text-center capitalize text-gray-700 group-hover:text-gray-900">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
