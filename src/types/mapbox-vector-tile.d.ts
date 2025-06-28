
declare module '@mapbox/vector-tile' {
  export interface VectorTileLayer {
    length: number;
    name: string;
    version: number;
    extent: number;
    feature(i: number): VectorTileFeature;
  }

  export interface VectorTileFeature {
    id?: number | string;
    type: number;
    extent: number;
    properties: { [key: string]: any };
    loadGeometry(): Array<Array<{ x: number; y: number }>>;
    bbox?(): [number, number, number, number];
    toGeoJSON(x: number, y: number, z: number): GeoJSON.Feature;
  }

  export default class VectorTile {
    constructor(data: Uint8Array | ArrayBuffer, end?: number);
    layers: { [key: string]: VectorTileLayer };
  }
}

declare module 'mapbox__vector-tile' {
  export * from '@mapbox/vector-tile';
  export { default } from '@mapbox/vector-tile';
}
