import { Point } from "geojson";

interface Properties {
  title: string;
  datetime: string;
  author: string;
  detail?: {
    [name: string]: any;
  };
}

export interface PlaceProperties extends Properties {
  address: string;
  photos: string[];
}

export interface PhotoProperties extends Properties {
  direction: number;
}

export interface PlaceGeoJSON extends GeoJSON.Feature {
  geometry: Point;
  properties: PlaceProperties;
}

export interface PhotoGeoJSON extends GeoJSON.Feature {
  geometry: Point;
  properties: PhotoProperties;
}
