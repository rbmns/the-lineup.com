import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageTreatmentGuide: React.FC = () => {
  const primaryColor = '#0891b2'; // Example color
  const vibrantColor = '#ec4899'; // Example color

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Image Treatment Guide</h2>
      <p className="text-gray-600 mb-6">
        How to properly treat images to align with our brand.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Correct Image Treatment */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">
            <CheckCircle className="inline-block h-5 w-5 mr-2 text-green-500 align-text-top" />
            Do’s
          </h3>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="https://source.unsplash.com/random/600x400?beach"
              alt="Correct Image"
              className="w-full h-48 object-cover"
            />
          </div>
          <ul className="list-disc list-inside text-gray-700">
            <li>Use high-resolution images.</li>
            <li>Ensure images are well-lit and clear.</li>
            <li>Maintain a consistent color palette.</li>
            <li>Focus on natural and authentic scenes.</li>
          </ul>
        </div>

        {/* Incorrect Image Treatment */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">
            <XCircle className="inline-block h-5 w-5 mr-2 text-red-500 align-text-top" />
            Don'ts
          </h3>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="https://source.unsplash.com/random/600x400?abstract"
              alt="Incorrect Image"
              className="w-full h-48 object-cover opacity-70 grayscale"
            />
          </div>
          <ul className="list-disc list-inside text-gray-700">
            <li>Avoid low-resolution or blurry images.</li>
            <li>Don't use overly filtered or artificial-looking images.</li>
            <li>Don't use images that clash with the brand's color palette.</li>
            <li>Avoid generic stock photos.</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Additional Guidelines</h3>
        <p className="text-gray-600">
          When selecting images, consider the following:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <strong>Relevance:</strong> Ensure the image is relevant to the
            content and target audience.
          </li>
          <li>
            <strong>Composition:</strong> Pay attention to the composition of the
            image, including the rule of thirds, leading lines, and balance.
          </li>
          <li>
            <strong>Accessibility:</strong> Provide alt text for all images to
            ensure accessibility for users with visual impairments.
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <Button>View Image Library</Button>
      </div>
    </div>
  );
};

export default ImageTreatmentGuide;
