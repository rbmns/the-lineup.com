
import React from 'react';
import { brandColors } from '@/components/polymet/brand-colors';
import { Calendar, MapPin } from 'lucide-react';

// Simple Logo component for social media
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="w-6 h-6 bg-white rounded-full"></div>
    <span className="font-medium text-white">thelineup</span>
  </div>
);

const SocialMediaExample: React.FC = () => {
  const vibrantColor = brandColors.vibrant?.[500] || '#ec4899';
  const natureColor = brandColors.nature?.[500] || '#22c55e';
  const primaryColor = brandColors.primary[500];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Social Media Templates</h2>
        <p className="text-gray-600">
          Ready-to-use templates for social media posts and stories.
        </p>
      </div>

      {/* Instagram Story Template */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Instagram Story</h3>
        <div 
          className="w-80 h-[568px] rounded-lg p-6 flex flex-col justify-between text-white relative overflow-hidden"
          style={{ backgroundColor: vibrantColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
          
          <div className="relative z-10">
            <Logo />
            <div className="mt-4">
              <span className="text-sm uppercase tracking-wider opacity-90">Join the Flow</span>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Beach Yoga Session</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 15, 2024 • 7:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Santa Monica Beach</span>
              </div>
            </div>
            <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-center">
              <span className="font-medium">Swipe up to RSVP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Post Template */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Facebook Post</h3>
        <div className="max-w-lg bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div 
            className="h-64 relative"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-2">Surf & Sunset</h3>
                <p className="text-lg opacity-90">Join the Flow</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-full"></div>
              <div>
                <div className="font-medium">the lineup</div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
            </div>
            
            <p className="text-gray-800 mb-3">
              🏄‍♀️ Ready for an epic sunset surf session? Join us at Malibu Beach for an 
              unforgettable evening on the waves! Perfect for all skill levels.
            </p>
            
            <div className="text-sm text-gray-500 mb-3">
              📅 Tonight, 6:00 PM<br/>
              📍 Malibu Beach, CA<br/>
              💰 $25 per person
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>❤️ 42 likes</span>
              <span>💬 8 comments</span>
              <span>🔄 Share</span>
            </div>
          </div>
        </div>
      </section>

      {/* Twitter Header Template */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Twitter Header</h3>
        <div 
          className="w-full h-48 rounded-lg relative overflow-hidden"
          style={{ backgroundColor: natureColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-teal to-accent-lime opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-2">the lineup</h2>
              <p className="text-xl opacity-90">Curating coastal experiences • Join the Flow</p>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <span>🏄‍♀️ Surf</span>
                <span>🧘‍♀️ Yoga</span>
                <span>🎵 Music</span>
                <span>🌊 Beach Life</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Template Guidelines</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Keep text readable with proper contrast</li>
                <li>• Use consistent brand colors and fonts</li>
                <li>• Include clear call-to-action</li>
                <li>• Optimize images for each platform</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Platform Specifications</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instagram Story: 1080x1920px</li>
                <li>• Facebook Post: 1200x630px</li>
                <li>• Twitter Header: 1500x500px</li>
                <li>• LinkedIn Banner: 1584x396px</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaExample;
