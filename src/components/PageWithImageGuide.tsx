
import React from 'react';
import ImageTreatmentGuide from '@/components/polymet/ImageTreatmentGuide';

interface PageWithImageGuideProps {
  children: React.ReactNode;
  showImageGuide?: boolean;
  className?: string;
}

export const PageWithImageGuide: React.FC<PageWithImageGuideProps> = ({ 
  children, 
  showImageGuide = true,
  className = ""
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      {children}
      
      {showImageGuide && (
        <div className="mt-12 py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
              Image Treatment Guide
            </h2>
            <ImageTreatmentGuide />
          </div>
        </div>
      )}
    </div>
  );
};
