import { Point } from "geojson";

export interface Properties {
  id: string;
  title: string;
  datetime: string;
  author: string;
  detail?: {
    [name: string]: any;
  };
}

export interface PlaceProperties extends Properties {
  address: string;
}

export interface PhotoProperties extends Properties {
  placeId: string;
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
