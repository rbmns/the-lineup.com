
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeRendererProps {
  status: string;
}

export const StatusBadgeRenderer: React.FC<StatusBadgeRendererProps> = ({ status }) => {
  const statusMap: {[key: string]: {color: string, bg: string}} = {
    'Local': {color: 'text-lime-600', bg: 'bg-lime-100'},
    'Tourist': {color: 'text-amber-600', bg: 'bg-amber-100'},
    'Digital Nomad': {color: 'text-teal-600', bg: 'bg-teal-100'},
    'Expat': {color: 'text-purple-600', bg: 'bg-purple-100'},
    'Visitor': {color: 'text-orange-600', bg: 'bg-orange-100'},
    'Traveler': {color: 'text-blue-600', bg: 'bg-blue-100'},
    'Remote Worker': {color: 'text-rose-600', bg: 'bg-rose-100'}
  };
  
  const style = statusMap[status] || {color: 'text-gray-600', bg: 'bg-gray-200'};
  
  return (
    <Badge 
      className={`${style.bg} ${style.color} border-0 font-normal text-xs font-inter`}
    >
      {status}
    </Badge>
  );
};
