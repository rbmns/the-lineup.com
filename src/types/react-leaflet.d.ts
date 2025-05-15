
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    scrollWheelZoom?: boolean;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    position: [number, number];
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }
}

export {};
