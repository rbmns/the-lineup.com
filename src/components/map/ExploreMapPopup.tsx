
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { Location } from '@/types/location';

export const createPopupContent = (location: Location): string => {
  return `<div style="font-family:system-ui,-apple-system,sans-serif">
    <h3 style="font-weight:600;margin-bottom:4px">${location.name}</h3>
    ${location.type === 'friend' && location.status 
      ? `<p style="color:#6b7280;font-size:12px;margin:2px 0">${location.status}</p>` 
      : ''}
    ${location.type === 'event' && location.date 
      ? `<p style="color:#6b7280;font-size:12px;margin:2px 0">
          ${new Date(location.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>` 
      : ''}
    ${location.type === 'event' && location.category 
      ? `<span style="display:inline-block;font-size:11px;background:#f9f5ff;color:#9333ea;padding:2px 6px;border-radius:9999px;margin-top:4px">${location.category}</span>` 
      : ''}
  </div>`;
};

export const createPopup = (location: Location): mapboxgl.Popup => {
  return new mapboxgl.Popup({ offset: 25 }).setHTML(createPopupContent(location));
};
