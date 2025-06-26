
// Type declaration for @mapbox/vector-tile to resolve TypeScript errors
declare module '@mapbox/vector-tile' {
  export interface VectorTile {
    layers: { [key: string]: VectorTileLayer };
  }
  
  export interface VectorTileLayer {
    length: number;
    name: string;
    version: number;
    extent: number;
    feature(i: number): VectorTileFeature;
  }
  
  export interface VectorTileFeature {
    id: number | string | undefined;
    type: 1 | 2 | 3; // Point, LineString, Polygon
    extent: number;
    properties: { [key: string]: any };
    loadGeometry(): Array<Array<{ x: number; y: number }>>;
  }
  
  export default class VectorTile {
    constructor(data: Uint8Array | ArrayBuffer);
    layers: { [key: string]: VectorTileLayer };
  }
}
